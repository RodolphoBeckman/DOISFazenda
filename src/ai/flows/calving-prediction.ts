// src/ai/flows/calving-prediction.ts
'use server';

/**
 * @fileOverview A flow to predict the calving date based on the insemination date.
 *
 * - predictCalvingDate - A function that predicts the calving date based on the insemination date.
 * - PredictCalvingDateInput - The input type for the predictCalvingDate function.
 * - PredictCalvingDateOutput - The return type for the predictCalvingDate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCalvingDateInputSchema = z.object({
  inseminationDate: z
    .string() // Changed to string to accept date strings from the form
    .describe('The date of insemination in ISO format (YYYY-MM-DD).'),
});
export type PredictCalvingDateInput = z.infer<typeof PredictCalvingDateInputSchema>;

const PredictCalvingDateOutputSchema = z.object({
  predictedCalvingDate: z
    .string()
    .describe('The predicted calving date in ISO format (YYYY-MM-DD).'),
  daysUntilCalving: z
    .number()
    .describe('The number of days until the predicted calving date.'),
  isNearCalving: z
    .boolean()
    .describe(
      'Whether the predicted calving date is near (within a configurable number of days).'
    ),
});
export type PredictCalvingDateOutput = z.infer<typeof PredictCalvingDateOutputSchema>;

export async function predictCalvingDate(
  input: PredictCalvingDateInput
): Promise<PredictCalvingDateOutput> {
  return predictCalvingDateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCalvingDatePrompt',
  input: {schema: PredictCalvingDateInputSchema},
  output: {schema: PredictCalvingDateOutputSchema},
  prompt: `You are an AI assistant specialized in predicting calving dates for cattle.

  Given the insemination date, calculate the predicted calving date assuming a gestation period of 283 days.

  Input Insemination Date: {{{inseminationDate}}}

  Output the predicted calving date in ISO format (YYYY-MM-DD), the number of days until calving, and whether the calving date is near (within 30 days).

  Ensure the predictedCalvingDate is in ISO format (YYYY-MM-DD).`,
});

const predictCalvingDateFlow = ai.defineFlow(
  {
    name: 'predictCalvingDateFlow',
    inputSchema: PredictCalvingDateInputSchema,
    outputSchema: PredictCalvingDateOutputSchema,
  },
  async input => {
    // Parse the insemination date string into a Date object
    const inseminationDate = new Date(input.inseminationDate);

    // Calculate the predicted calving date (283 days gestation period)
    const gestationPeriodDays = 283;
    const calvingDate = new Date(
      inseminationDate.getTime() + gestationPeriodDays * 24 * 60 * 60 * 1000
    );

    // Format the calving date as ISO string (YYYY-MM-DD)
    const predictedCalvingDateISO = calvingDate.toISOString().slice(0, 10);

    // Calculate the number of days until calving
    const today = new Date();
    const timeDiff = calvingDate.getTime() - today.getTime();
    const daysUntilCalving = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Determine if the calving date is near (within 30 days)
    const isNearCalving = daysUntilCalving <= 30;

    // Call the prompt to get the formatted output
    const {output} = await prompt({
      ...input,
      predictedCalvingDate: predictedCalvingDateISO,
      daysUntilCalving: daysUntilCalving,
      isNearCalving: isNearCalving,
    });

    return {
      predictedCalvingDate: predictedCalvingDateISO,
      daysUntilCalving: daysUntilCalving,
      isNearCalving: isNearCalving,
    };
  }
);
