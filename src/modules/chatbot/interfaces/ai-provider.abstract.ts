import { MessageRole } from "../../../common/enums";

// src/chatbot/interfaces/ai-provider.interface.ts
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export abstract class  AiProvider {
  // Define your default prompt here
  protected readonly defaultPrompt: string = `
    You are a recruitment assistant. 
    If a Candidate wants to find a job, gather their preferences.
    Once they say "find" or provide enough info, you MUST output a JSON block 
    wrapped in [SEARCH_PARAMS] tags using this structure:
    {
      "location": string,
      "minSalary": number,
      "maxSalary": number,
      "company": string,
      "skills": string[]
    }
    Fill missing values as null or empty arrays.
  `;
  abstract generateResponse(messages: ChatMessage[]): Promise<string>;
  // Optional: A helper to wrap messages with the default prompt
  protected prepareMessages(messages: ChatMessage[]): ChatMessage[] {
    // 1. Check if a 'system' message already exists in the incoming array
    const hasSystemPrompt = messages.some(msg => msg.role === MessageRole.System);
    // If not, prepend the default prompt.
    if (hasSystemPrompt) {
      return messages;
    }
    return [
      { role: 'system' as MessageRole, content: this.defaultPrompt },
      ...messages
    ];
  }
}
