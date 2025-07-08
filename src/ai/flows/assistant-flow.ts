'use server';

/**
 * @fileOverview A conversational AI assistant for the OLTECH AI platform.
 *
 * - askAssistant - A function that handles the conversational chat logic.
 * - AssistantInput - The input type for the askAssistant function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AssistantInputSchema = z.object({
  message: z.string().describe('The user query.'),
  context: z
    .string()
    .describe('A string containing relevant data like tasks and team members.'),
});

export type AssistantInput = z.infer<typeof AssistantInputSchema>;

export async function askAssistant(input: AssistantInput): Promise<string> {
  const result = await assistantFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: {
    schema: AssistantInputSchema,
  },
  prompt: `You are the OLTECH AI: Streamline assistant, a helpful and concise chatbot. Your personality is professional yet friendly.
  
  Use the following context to answer the user's question. If the question cannot be answered with the provided context, politely say that you don't have access to that information.

  CONTEXT:
  {{{context}}}

  QUESTION:
  {{{message}}}
  
  ANSWER:`,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: z.string(),
  },
  async input => {
    const {text} = await ai.generate({
      prompt: prompt.render(input),
      config: {
        // Lower temperature for more factual, less creative answers
        temperature: 0.2,
      },
    });
    return text;
  }
);
