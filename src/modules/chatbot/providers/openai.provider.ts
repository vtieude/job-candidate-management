// src/chatbot/providers/openai.provider.ts
import { AiProvider, ChatMessage } from '../interfaces/ai-provider.abstract';
import OpenAI from 'openai';
import { appConfig } from '../../../config/app.config';

export class OpenAiProvider extends  AiProvider {
  private openai = new OpenAI({ apiKey: appConfig.aiSetup.openApiKey });

  async generateResponse(messages: ChatMessage[]): Promise<string> {
    const finalMessages = this.prepareMessages(messages);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
    });
    // You can use the helper from the parent class
    return response.choices[0].message.content ?? '';
  }
}
