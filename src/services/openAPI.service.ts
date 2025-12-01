import OpenAI from 'openai';
import config from '../configs';

let openAIInst: OpenAI;
const getOpenAIInstance = () => {
  if (!openAIInst) {
    console.log(config.openApiKey)
    openAIInst = new OpenAI({
      apiKey: config.openApiKey,
    });
  }
  return openAIInst;
}

export const chatWithGPT = async (prompt: string) => {
  try {
    const openAi = getOpenAIInstance();
    const chatCompletion = await openAi.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    console.log('🤖 GPT:', chatCompletion.choices[0].message.content);
    return chatCompletion.choices[0].message.content || '';
  } catch (error) {
    console.log(error);
  }
  return 'AI not available';
}

