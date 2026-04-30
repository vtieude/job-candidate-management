// src/chatbot/providers/openai.provider.ts
import { AIResponse, AiProvider, ChatMessage } from '../interfaces/ai-provider.abstract';
import OpenAI from 'openai';
import { appConfig } from '../../../config/app.config';
import { UserRole } from '../../../common/enums';

export class OpenAiProvider extends  AiProvider {
  private openai = new OpenAI({ apiKey: appConfig.aiSetup.openApiKey });

  async generateResponse(messages: ChatMessage[], role: UserRole): Promise<AIResponse> {
    const finalMessages = this.prepareMessages(messages, role);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: finalMessages,
    });
    const content = response.choices[0].message?.content ?? '';

    // 1. Extract the JSON block using Regex
    const searchMatch = content.match(/\[SEARCH_PARAMS\]([\s\S]*?)\[\/SEARCH_PARAMS\]/);
    let searchParams = null;

    if (searchMatch && searchMatch[1]) {
      try {
        searchParams = JSON.parse(searchMatch[1].trim());
      } catch (e) {
        console.error("Failed to parse search params", e);
      }
    }

    // 2. Clean the raw text (remove the JSON block from the user's view)
    const rawText = content.replace(/\[SEARCH_PARAMS\][\s\S]*?(\[\/SEARCH_PARAMS\]|$)/g, '').trim();

    return {
      aiResponse: content,
      rawText: rawText,
      searchParams,
      detectedIntent: searchParams ? 'SEARCH' : 'CONVERSATION'
    };
  }
}
