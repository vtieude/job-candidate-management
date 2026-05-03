import { Controller, Post, Body, Req, Query, Get, Param } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CurrentUser, Public, Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { UserChatDto, UserChatResponseDto } from './dto/aiChatResponse.dto';
import { AllUserChatDto } from './dto/allUserChatDto';
import { ApiPaginatedResponse } from '../../common/swaggers/paginated.decorators';
import { PaginationDto, PaginatedDto } from '../../common/dto';
import { MessageDto } from './dto/message.dto';

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

  @Get('chat/detail/:convId')
  @Roles(UserRole.Admin)
  async getConversactionDetail(@Param('convId') convId: string): Promise<MessageDto[]> {
    // Replace 'static-user-id' with req.user.id if using AuthGuards
    return await this.chatbotService.getChatConversactionDetail(convId);
  }

  @Get('conversations')
  @Roles(UserRole.Admin)
  @ApiPaginatedResponse(AllUserChatDto)
  async getAllUserConvers(@Query() pagination: PaginationDto): Promise<PaginatedDto<AllUserChatDto>> {
    // Replace 'static-user-id' with req.user.id if using AuthGuards
    return await this.chatbotService.getChatUserList(pagination.offset, pagination.limit);
  }
}
