import { MessageRole, UserRole } from "../../../common/enums";

// src/chatbot/interfaces/ai-provider.interface.ts
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface AIResponse {
  rawText: string;        // What the user sees
  searchParams?: any;     // Parsed JSON logic
  detectedIntent?: string;
  aiResponse: string;
}

export abstract class  AiProvider {
  // Inject the prompt so it's dynamic based on user type
  // Define your default prompt here
  protected readonly candidatePrompt: string = `
    Role: You are candidate assistance.
    Task: Convert user requests into a [SEARCH_PARAMS] JSON block.

    CRITICAL RULES:
    1. EXTRACT requirements: If the candidate provides EVEN ONE requirement (e.g., just "Senior" or just "Python"), you MUST generate the [SEARCH_PARAMS] block immediately..
    2. ASSUMPTION: If the user mentions a number without context, assign it to "minSalary", If they specify a quantity (e.g., "top 5"), update "limit" accordingly, default limit is 10.
    3. NO CHAT: Do not ask for more information if at least one filter is found.
    4. FORMAT: You MUST wrap the JSON between [SEARCH_PARAMS] and [/SEARCH_PARAMS].

    JSON SCHEMA:
    {
      "location": string | null,
      "minSalary": number | null,
      "maxSalary": number | null,
      "company": string | null,
      "skills": string[],
      "limit": 10
    }
    ### EXAMPLE:
    User: "Find job with company CMC and location at danang"
    Assistant: "I found some jobs:
    [SEARCH_PARAMS]
    { "location": "danang", "skills": [], "minSalary": null, "maxSalary": null, "company": "CMC" , "limit": 10}
    [/SEARCH_PARAMS]"
  - Support both Vietnamese and English. Keep messages very concise (1-2 sentences).
`;




  protected readonly recruiterPrompt: string = `
  You are a Recruiter Search Assistant. Your ONLY job is to help recruiter find candidates.

  SEARCH RULES:
  1. EXTRACT requirements: level (e.g., Intern, Junior, Senior) and skills (e.g., React, Java).
  2. TRIGGER: If the recruiter provides EVEN ONE requirement (e.g., just "Senior" or just "Python"), you MUST generate the [SEARCH_PARAMS] block immediately.
  3. DO NOT ask follow-up questions for more details if at least one filter is identified. Assume the recruiter wants results now.
  4. DEFAULT: "limit" is 10. If they specify a quantity (e.g., "top 5"), update "limit" accordingly.

  JSON FORMAT:
  [SEARCH_PARAMS]
  {
    "level": string | null,
    "skills": string[],
    "limit": number
  }
  [/SEARCH_PARAMS]

   ### EXAMPLE:
    User: "Find candidate with nodejs skills"
    Assistant: "I found some candidates:
    [SEARCH_PARAMS]
    { "level": null, "skills": [nodejs], "limit": 10}
    [/SEARCH_PARAMS]"
  - Support both Vietnamese and English. Keep messages very concise (1-2 sentences).
`;

  private systemPrompts = {
    [UserRole.Candidate]: this.candidatePrompt,
    [UserRole.Recruiter]: this.recruiterPrompt,
    [UserRole.Admin]: 'You are a admin assistant.'
  }
  
  abstract generateResponse(messages: ChatMessage[], role: UserRole): Promise<AIResponse>;
  // Optional: A helper to wrap messages with the default prompt
  protected prepareMessages(messages: ChatMessage[], role: UserRole): ChatMessage[] {
    // 1. Check if a 'system' message already exists in the incoming array
    const hasSystemPrompt = messages.some(msg => msg.role === MessageRole.System);
    // If not, prepend the default prompt.
    if (hasSystemPrompt) {
      return messages;
    }
    return [
      { role: MessageRole.System, content: this.systemPrompts[role] },
      ...messages
    ];
  }
}
