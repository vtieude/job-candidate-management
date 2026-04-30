import { Controller, Post, Body, Req } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CurrentUser } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { UserChatDto, UserChatResponseDto } from './dto/aiChatResponse.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('chat')
  async chat(
    @Body() userChatDto: UserChatDto,
    @CurrentUser('role') role: UserRole,
    @CurrentUser('userId') userId: string
  ) : Promise<UserChatResponseDto> {
    // Replace 'static-user-id' with req.user.id if using AuthGuards
    return await this.chatbotService.getAIChatResponse(
      userId,
      userChatDto.content,
      role,
      userChatDto.conversationId,
    );
  }
}
