import { Controller, Post, Body, Req } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CurrentUser } from '../../common/decorators';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('chat')
  async chat(
    @Body('message') message: string,
    @Body('conversationId') conversationId: string,
    @CurrentUser('userId') userId: string
  ) {
    // Replace 'static-user-id' with req.user.id if using AuthGuards
    
    return await this.chatbotService.getAIChatResponse(
      userId,
      message,
      conversationId,
    );
  }
}
