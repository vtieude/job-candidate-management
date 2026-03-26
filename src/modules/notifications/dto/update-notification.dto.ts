import { IsEnum, IsOptional } from 'class-validator';
import { NotificationStatusEnum } from '../../../common/enums';

export class UpdateNotificationDto {
  @IsEnum(NotificationStatusEnum)
  @IsOptional()
  status?: NotificationStatusEnum;
}