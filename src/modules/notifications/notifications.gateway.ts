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

  // Method to notify user that they have a new notification (without sending data)
  notifyUser(userId: string) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      // Only send unread count - client will call API to get notifications
      this.notificationsService.getUnreadCount(userId).then(count => {
        this.server.to(socketId).emit('unread_count', { count });
      });
    }
  }
}
