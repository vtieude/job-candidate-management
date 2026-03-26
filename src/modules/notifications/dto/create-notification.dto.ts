import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationTypeEnum, NotificationStatusEnum } from '../../../common/enums';

export class CreateNotificationDto {
  @IsEnum(NotificationTypeEnum)
  @IsNotEmpty()
  type!: NotificationTypeEnum;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsMongoId()
  @IsNotEmpty()
  recipient!: string;

  @IsMongoId()
  @IsOptional()
  sender?: string;

  @IsMongoId()
  @IsOptional()
  job?: string;

  @IsMongoId()
  @IsOptional()
  jobCandidate?: string;

  @IsEnum(NotificationStatusEnum)
  @IsOptional()
  status?: NotificationStatusEnum;

  @IsOptional()
  metadata?: Record<string, any>;
}