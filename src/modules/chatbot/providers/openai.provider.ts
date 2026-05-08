// src/chatbot/providers/openai.provider.ts
import { AIResponse, AiProvider, ChatMessage } from '../interfaces/ai-provider.abstract';
import OpenAI from 'openai';
import { appConfig } from '../../../config/app.config';
import { UserRole } from '../../../common/enums';

export class OpenAiProvider extends  AiProvider {
  private openai = new OpenAI({ apiKey: appConfig.aiSetup.openApiKey });

  private hasRealSearchFilter(searchParams: any, role: UserRole): boolean {
    if (!searchParams) return false;

    if (role === UserRole.Candidate) {
      return Boolean(
        searchParams.location?.trim?.() ||
        searchParams.company?.trim?.() ||
        searchParams.minSalary ||
        searchParams.maxSalary ||
        (Array.isArray(searchParams.skills) && searchParams.skills.length > 0)
      );
    }

    if (role === UserRole.Recruiter) {
      return Boolean(
        searchParams.level?.trim?.() ||
        (Array.isArray(searchParams.skills) && searchParams.skills.length > 0)
      );
    }

    return false;
  }

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

    const hasSearchFilter = this.hasRealSearchFilter(searchParams, role);
    const hasSearchParamsWithoutFilter = Boolean(searchParams) && !hasSearchFilter;
    if (hasSearchParamsWithoutFilter) {
      searchParams = null;
    }

    // 2. Clean the raw text (remove the JSON block from the user's view)
    const rawText = hasSearchParamsWithoutFilter
      ? this.getMissingFilterMessage(role)
      : content.replace(/\[SEARCH_PARAMS\][\s\S]*?(\[\/SEARCH_PARAMS\]|$)/g, '').trim();

    return {
      aiResponse: content,
      rawText: rawText,
      searchParams,
      detectedIntent: searchParams ? 'SEARCH' : 'CONVERSATION'
    };
  }

  private getMissingFilterMessage(role: UserRole): string {
    if (role === UserRole.Candidate) {
      return 'Please provide at least one job filter, such as location, skill, company, or salary.';
    }

    if (role === UserRole.Recruiter) {
      return 'Please provide at least one candidate filter, such as level or skill.';
    }

    return 'Please provide at least one search filter.';
  }
}
