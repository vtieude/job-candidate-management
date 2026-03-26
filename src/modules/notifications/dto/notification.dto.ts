import { ApiProperty } from '@nestjs/swagger';
import { NotificationTypeEnum, NotificationStatusEnum } from '../../../common/enums';

class SenderDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  fullName?: string;
}

class JobDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  company: string;
}

class JobCandidateDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  status: string;
}

export class NotificationDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ enum: NotificationTypeEnum })
  type: NotificationTypeEnum;

  @ApiProperty({ enum: NotificationStatusEnum })
  status: NotificationStatusEnum;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  recipient: string;

  @ApiProperty({ type: SenderDto, required: false })
  sender?: SenderDto;

  @ApiProperty({ type: JobDto, required: false })
  job?: JobDto;

  @ApiProperty({ type: JobCandidateDto, required: false })
  jobCandidate?: JobCandidateDto;

  @ApiProperty({ required: false })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}