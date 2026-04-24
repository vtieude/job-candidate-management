import { ChatMessage, AiProvider } from "../interfaces/ai-provider.abstract";

export class ClaudeProvider extends AiProvider {
  // Logic for Anthropic SDK goes here
  async generateResponse(messages: ChatMessage[]): Promise<string> {
    return "This is a response from Claude"; 
  }
}
