'use server';

import { summarizeDocument, SummarizeDocumentInput } from '@/ai/flows/document-summarization';
import { generateStatusReport, GenerateStatusReportInput } from '@/ai/flows/auto-generate-status-reports';

export async function summarizeDocumentAction(input: SummarizeDocumentInput) {
  try {
    const result = await summarizeDocument(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to summarize document.' };
  }
}

export async function generateStatusReportAction(input: GenerateStatusReportInput) {
  try {
    const result = await generateStatusReport(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate report.' };
  }
}
