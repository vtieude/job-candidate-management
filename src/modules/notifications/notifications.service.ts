import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { NotificationStatusEnum, NotificationTypeEnum } from '../../common/enums';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @Inject(forwardRef(() => require('./notifications.gateway').NotificationsGateway))
    private notificationsGateway: any,
  ) {}

  private toDto(notification: any): NotificationDto {
    return {
      _id: notification._id.toString(),
      type: notification.type,
      status: notification.status,
      title: notification.title,
      message: notification.message,
      recipient: notification.recipient.toString(),
      sender: notification.sender ? {
        _id: notification.sender._id?.toString() || notification.sender.toString(),
        email: notification.sender.email,
        fullName: notification.sender.fullName,
      } : undefined,
      job: notification.job ? {
        _id: notification.job._id?.toString() || notification.job.toString(),
        title: notification.job.title,
        company: notification.job.company,
      } : undefined,
      jobCandidate: notification.jobCandidate ? {
        _id: notification.jobCandidate._id?.toString() || notification.jobCandidate.toString(),
        status: notification.jobCandidate.status,
      } : undefined,
      metadata: notification.metadata,
      createdAt: notification.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: notification.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  async create(createNotificationDto: CreateNotificationDto): Promise<NotificationDto> {
    const notification = await this.notificationModel.create(createNotificationDto);
    
    const dto = this.toDto(notification);
    
    // Notify user via socket (only sends unread count, not notification data)
    if (this.notificationsGateway) {
      this.notificationsGateway.notifyUser(createNotificationDto.recipient);
    }
    
    return dto;
  }

  // Get all notifications for a user
  async findAllByUser(userId: string): Promise<NotificationDto[]> {
    const notifications = await this.notificationModel
      .find({ recipient: new Types.ObjectId(userId) })
      .populate('sender', 'email fullName')
      .populate('job', 'title company')
      .populate('jobCandidate', 'status')
      .sort({ createdAt: -1 })
      .lean();
    
    return notifications.map(n => this.toDto(n));
  }

  // Get unread notifications for a user
  async findUnreadByUser(userId: string): Promise<NotificationDto[]> {
    const notifications = await this.notificationModel
      .find({
        recipient: new Types.ObjectId(userId),
        status: NotificationStatusEnum.Unread
      })
      .populate('sender', 'email fullName')
      .populate('job', 'title company')
      .populate('jobCandidate', 'status')
      .sort({ createdAt: -1 })
      .lean();
    
    return notifications.map(n => this.toDto(n));
  }

  // Get unread count for a user
  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationModel.countDocuments({
      recipient: new Types.ObjectId(userId),
      status: NotificationStatusEnum.Unread,
    });
  }

  // Mark notification as read
  async markAsRead(id: string, userId: string): Promise<NotificationDto> {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: id, recipient: new Types.ObjectId(userId) },
      { status: NotificationStatusEnum.Read },
    ).lean();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    // Notify user via socket to update unread count
    if (this.notificationsGateway) {
      this.notificationsGateway.notifyUser(userId);
    }
    return this.toDto(notification);
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel.updateMany(
      { 
        recipient: new Types.ObjectId(userId),
        status: NotificationStatusEnum.Unread 
      },
      { status: NotificationStatusEnum.Read },
    );
    // Notify user via socket to update unread count
    if (this.notificationsGateway) {
      this.notificationsGateway.notifyUser(userId);
    }
    return { modifiedCount: result.modifiedCount };
  }

  // Update notification
  async update(id: string, userId: string, updateNotificationDto: UpdateNotificationDto): Promise<NotificationDto> {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: id, recipient: new Types.ObjectId(userId) },
      updateNotificationDto,
      { new: true },
    ).lean();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.toDto(notification);
  }

  // Delete notification
  async remove(id: string, userId: string): Promise<void> {
    const result = await this.notificationModel.deleteOne({
      _id: id,
      recipient: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Notification not found');
    }
    
    // Notify user via socket to update unread count
    if (this.notificationsGateway) {
      this.notificationsGateway.notifyUser(userId);
    }
  }

  // Helper method to create job application notification
  async createJobApplicationNotification(
    candidateId: string,
    recruiterId: string,
    jobId: string,
    jobCandidateId: string,
    jobTitle: string,
    candidateName: string,
  ): Promise<NotificationDto> {
    return await this.create({
      type: NotificationTypeEnum.JobApplication,
      title: 'New Job Application',
      message: `${candidateName} has applied for the position: ${jobTitle}`,
      recipient: recruiterId,
      sender: candidateId,
      job: jobId,
      jobCandidate: jobCandidateId,
      status: NotificationStatusEnum.Unread,
    });
  }

  // Helper method to create application approved notification
  async createApplicationApprovedNotification(
    candidateId: string,
    recruiterId: string,
    jobId: string,
    jobCandidateId: string,
    jobTitle: string,
  ): Promise<NotificationDto> {
    return await this.create({
      type: NotificationTypeEnum.ApplicationApproved,
      title: 'Application Approved',
      message: `Your application for ${jobTitle} has been approved!`,
      recipient: candidateId,
      sender: recruiterId,
      job: jobId,
      jobCandidate: jobCandidateId,
      status: NotificationStatusEnum.Unread,
    });
  }

  // Helper method to create application rejected notification
  async createApplicationRejectedNotification(
    candidateId: string,
    recruiterId: string,
    jobId: string,
    jobCandidateId: string,
    jobTitle: string,
  ): Promise<NotificationDto> {
    return await this.create({
      type: NotificationTypeEnum.ApplicationRejected,
      title: 'Application Update',
      message: `Thank you for your interest in ${jobTitle}. Unfortunately, we have decided to move forward with other candidates.`,
      recipient: candidateId,
      sender: recruiterId,
      job: jobId,
      jobCandidate: jobCandidateId,
      status: NotificationStatusEnum.Unread,
    });
  }

  // Helper method to create interview notification
  async createInterviewNotification(
    candidateId: string,
    recruiterId: string,
    jobId: string,
    jobCandidateId: string,
    jobTitle: string,
  ): Promise<NotificationDto> {
    return await this.create({
      type: NotificationTypeEnum.ApplicationInterview,
      title: 'Interview Invitation',
      message: `You have been invited for an interview for ${jobTitle}!`,
      recipient: candidateId,
      sender: recruiterId,
      job: jobId,
      jobCandidate: jobCandidateId,
      status: NotificationStatusEnum.Unread,
    });
  }
}
