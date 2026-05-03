import { ApiProperty } from "@nestjs/swagger";
import { JobsDto } from "../../jobs/dto/jobs.dto";
import { UserDto } from "../../users/dto/user.dto";
import { MessageDto } from "./message.dto";

export class UserChatDto {
  @ApiProperty()
  content!: string;
  @ApiProperty()
  conversationId?: string;
}

export class UserChatResponseDto extends UserChatDto {
  @ApiProperty()
  messageDto!: MessageDto;
  @ApiProperty()
  jobDtos?: JobsDto[];
  @ApiProperty()
  userDtos?: UserDto[];
}