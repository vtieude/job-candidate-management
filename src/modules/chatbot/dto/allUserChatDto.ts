import { UserRole } from "../../../common/enums";

export interface UserChatDto {
  _id: string,
  lastActivity: Date,
  role: UserRole,
  fullName: string
}