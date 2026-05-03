import { MessageRole } from "../../../common/enums";

export class MessageDto {
  conversationId!: string;

  role!: MessageRole; // 'user' for human, 'assistant' for AI

  senderId!: string;

  content!: string;

  createdAt!: Date;
}