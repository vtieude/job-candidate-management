import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { CurrentUser } from '../../common/decorators';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a notification (Admin only)' })
  @ApiResponse({ status: 201, type: NotificationDto })
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<NotificationDto> {
    return await this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user' })
  @ApiResponse({ status: 200, type: [NotificationDto] })
  async findAll(@CurrentUser('userId') userId: string): Promise<NotificationDto[]> {
    return await this.notificationsService.findAllByUser(userId);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread notifications for current user' })
  @ApiResponse({ status: 200, type: [NotificationDto] })
  async findUnread(@CurrentUser('userId') userId: string): Promise<NotificationDto[]> {
    return await this.notificationsService.findUnreadByUser(userId);
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Get unread notification count for current user' })
  @ApiResponse({ status: 200, schema: { properties: { count: { type: 'number' } } } })
  async getUnreadCount(@CurrentUser('userId') userId: string): Promise<{ count: number }> {
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, type: NotificationDto })
  async markAsRead(@Param('id') id: string, @CurrentUser('userId') userId: string): Promise<NotificationDto> {
    return await this.notificationsService.markAsRead(id, userId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, schema: { properties: { modifiedCount: { type: 'number' } } } })
  async markAllAsRead(@CurrentUser('userId') userId: string): Promise<{ modifiedCount: number }> {
    return await this.notificationsService.markAllAsRead(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update notification' })
  @ApiResponse({ status: 200, type: NotificationDto })
  async update(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationDto> {
    return await this.notificationsService.update(id, userId, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 200, schema: { properties: { message: { type: 'string' } } } })
  async remove(@Param('id') id: string, @CurrentUser('userId') userId: string): Promise<{ message: string }> {
    await this.notificationsService.remove(id, userId);
    return { message: 'Notification deleted successfully' };
  }
}