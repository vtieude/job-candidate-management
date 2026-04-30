import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { OpenAiProvider } from './providers/openai.provider';
import { JobsModule } from '../jobs/jobs.module';
import { AiProvider } from './interfaces/ai-provider.abstract';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema
      }
    ]),
    JobsModule,
    UsersModule
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService,
    {
      provide: AiProvider,
      useClass: OpenAiProvider
    },
  ],
  exports: [ChatbotService],
})
export class ChatbotModule {}
