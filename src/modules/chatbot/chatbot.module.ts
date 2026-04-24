import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { appConfig } from '../../config/app.config';
import { ClaudeProvider } from './providers/claude.provider';
import { OpenAiProvider } from './providers/openai.provider';
import { JobsModule } from '../jobs/jobs.module';
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
    JobsModule
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService,
    {
      provide: 'AI_PROVIDER',
      useFactory: () => {
        const type = appConfig.aiSetup.provider;
        
        if (type === 'claude') {
          return new ClaudeProvider();
        }
        // Default to OpenAI
        return new OpenAiProvider();
      },
    },
  ],
  exports: [ChatbotService],
})
export class ChatbotModule {}
