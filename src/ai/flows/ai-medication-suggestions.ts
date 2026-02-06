'use server';

/**
 * @fileOverview An AI agent that provides basic medicine suggestions for a given medical condition.
 *
 * - getMedicationSuggestions - A function that takes a medical condition as input and returns a list of basic medicine suggestions.
 * - MedicationSuggestionsInput - The input type for the getMedicationSuggestions function.
 * - MedicationSuggestionsOutput - The return type for the getMedicationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationSuggestionsInputSchema = z.object({
  medicalCondition: z
    .string()
    .describe('The medical condition for which to suggest medications.'),
});
export type MedicationSuggestionsInput = z.infer<
  typeof MedicationSuggestionsInputSchema
>;

const MedicationSuggestionsOutputSchema = z.object({
  medicineSuggestions: z
    .array(z.string())
    .describe('A list of suggested medicines for the medical condition.'),
  notice: z
    .string()
    .describe(
      'A notice to consult a doctor before taking any medication.'
    ),
});
export type MedicationSuggestionsOutput = z.infer<
  typeof MedicationSuggestionsOutputSchema
>;

export async function getMedicationSuggestions(
  input: MedicationSuggestionsInput
): Promise<MedicationSuggestionsOutput> {
  return medicationSuggestionsFlow(input);
}

const medicationSuggestionsPrompt = ai.definePrompt({
  name: 'medicationSuggestionsPrompt',
  input: {schema: MedicationSuggestionsInputSchema},
  output: {schema: MedicationSuggestionsOutputSchema},
  prompt: `You are a helpful AI assistant that provides basic medicine suggestions for a given medical condition.

  Provide a list of basic medicine suggestions for the following medical condition:
  {{medicalCondition}}

  Include the following notice in your response: Consult a doctor before taking any medication.
  Your response should be formatted as a JSON object with the following keys:

  - medicineSuggestions: A list of suggested medicines for the medical condition.
  - notice: A notice to consult a doctor before taking any medication.
  `,
});

const medicationSuggestionsFlow = ai.defineFlow(
  {
    name: 'medicationSuggestionsFlow',
    inputSchema: MedicationSuggestionsInputSchema,
    outputSchema: MedicationSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await medicationSuggestionsPrompt(input);
    return output!;
  }
);
