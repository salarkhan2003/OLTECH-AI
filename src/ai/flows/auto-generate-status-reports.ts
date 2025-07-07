'use server';
/**
 * @fileOverview AI flow for automatically generating weekly status reports.
 *
 * - generateStatusReport - A function that generates a status report.
 * - GenerateStatusReportInput - The input type for the generateStatusReport function.
 * - GenerateStatusReportOutput - The return type for the generateStatusReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStatusReportInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  teamProgress: z.string().describe('A summary of the team progress for the week.'),
  potentialIssues: z.string().describe('Any potential issues or roadblocks.'),
  stakeholders: z.string().describe('List of stakeholders to be informed.'),
});
export type GenerateStatusReportInput = z.infer<typeof GenerateStatusReportInputSchema>;

const GenerateStatusReportOutputSchema = z.object({
  report: z.string().describe('The generated weekly status report.'),
  progress: z.string().describe('One-sentence summary of report generation.'),
});
export type GenerateStatusReportOutput = z.infer<typeof GenerateStatusReportOutputSchema>;

export async function generateStatusReport(input: GenerateStatusReportInput): Promise<GenerateStatusReportOutput> {
  return generateStatusReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStatusReportPrompt',
  input: {schema: GenerateStatusReportInputSchema},
  output: {schema: GenerateStatusReportOutputSchema},
  prompt: `You are an AI assistant helping project managers generate weekly status reports.

  Based on the project's team progress, potential issues, and stakeholders, create a concise and informative weekly status report.

  Project Name: {{{projectName}}}
  Team Progress: {{{teamProgress}}}
  Potential Issues: {{{potentialIssues}}}
  Stakeholders: {{{stakeholders}}}

  Format the report to be easily readable and highlight key accomplishments, risks, and upcoming milestones. Conclude with a brief overview of next week's priorities.
  Include a section on potential issues and propose mitigation strategies.
  Address the report to the stakeholders listed.
  Be brief.
  `,
});

const generateStatusReportFlow = ai.defineFlow(
  {
    name: 'generateStatusReportFlow',
    inputSchema: GenerateStatusReportInputSchema,
    outputSchema: GenerateStatusReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output!,
      progress: 'Generated a weekly status report summarizing team progress and potential issues.'
    };
  }
);
