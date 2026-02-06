'use server';
/**
 * @fileOverview This file defines a Genkit flow for checking symptoms and providing likely conditions.
 *
 * The flow takes a description of symptoms as input and returns a prioritized list
 * of likely conditions along with advice on when to see a doctor.
 *
 * @exports {
 *   checkSymptoms,
 *   SymptomCheckerInput,
 *   SymptomCheckerOutput,
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptoms: z.string().describe('A description of the symptoms experienced by the user.'),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  likelyConditions: z
    .array(z.string())
    .describe('A prioritized list of likely conditions based on the symptoms.'),
  advice: z.string().describe('Advice on when the user should see a doctor.'),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function checkSymptoms(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are an AI health assistant. Given the following symptoms, provide a prioritized list of likely conditions and advice on when the user should see a doctor.

Symptoms: {{{symptoms}}}

Respond in the following format:
{
  "likelyConditions": ["Condition 1", "Condition 2", ...],
  "advice": "When to see a doctor."
}
`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await symptomCheckerPrompt(input);
    return output!;
  }
);
