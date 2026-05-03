import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../../common/enums";

export class AllUserChatDto {
  @ApiProperty()
  conversationId!: string
  @ApiProperty()
  lastActivity!: Date
  @ApiProperty()
  fullName!: string
  @ApiProperty()
  lastMessage!:string
}