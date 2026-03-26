import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.userId;

      // Store the socket connection
      this.userSockets.set(userId, client.id);
      client.data.userId = userId;

      console.log(`User ${userId} connected to notifications`);

      // Send unread count on connection
      const unreadCount = await this.notificationsService.getUnreadCount(userId);
      client.emit('unread_count', { count: unreadCount });
    } catch (error) {
      console.error('WebSocket authentication error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.userSockets.delete(userId);
      console.log(`User ${userId} disconnected from notifications`);
    }
  }

  @SubscribeMessage('get_notifications')
  async handleGetNotifications(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (!userId) return;

    const notifications = await this.notificationsService.findAllByUser(userId);
    client.emit('notifications_list', notifications);
  }

  @SubscribeMessage('get_unread_count')
  async handleGetUnreadCount(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (!userId) return;

    const count = await this.notificationsService.getUnreadCount(userId);
    client.emit('unread_count', { count });
  }

  // Method to send notification to specific user
  sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('new_notification', notification);
      
      // Also update unread count
      this.notificationsService.getUnreadCount(userId).then(count => {
        this.server.to(socketId).emit('unread_count', { count });
      });
    }
  }

  // Method to broadcast notification to all connected users
  broadcastNotification(notification: any) {
    this.server.emit('new_notification', notification);
  }
}