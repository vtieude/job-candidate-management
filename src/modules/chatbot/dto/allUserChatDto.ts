import { UserRole } from "../../../common/enums";

export interface AllUserChatDto {
  _id: string,
  lastActivity: Date,
  role: UserRole,
  fullName: string
}