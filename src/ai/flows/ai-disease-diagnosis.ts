'use server';
/**
 * @fileOverview An AI agent that analyzes a skin condition from an image.
 *
 * - diagnoseDiseaseFromImage - A function that takes an image of a skin condition and returns a possible diagnosis.
 * - DiseaseDiagnosisInput - The input type for the diagnoseDiseaseFromImage function.
 * - DiseaseDiagnosisOutput - The return type for the diagnoseDisease-from-image function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiseaseDiagnosisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a skin condition, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiseaseDiagnosisInput = z.infer<typeof DiseaseDiagnosisInputSchema>;

const DiseaseDiagnosisOutputSchema = z.object({
  likelyCondition: z.string().describe('The likely skin condition identified from the image.'),
  conditionDescription: z.string().describe('A brief description of the likely condition.'),
  recommendedActions: z.array(z.string()).describe('A few suggested non-medical actions the user can take.'),
  whenToSeeDoctor: z.string().describe('Advice on when it is important to consult a healthcare professional.'),
  disclaimer: z
    .string()
    .describe('A disclaimer that this is not a medical diagnosis and a doctor should be consulted.'),
});
export type DiseaseDiagnosisOutput = z.infer<typeof DiseaseDiagnosisOutputSchema>;

export async function diagnoseDiseaseFromImage(
  input: DiseaseDiagnosisInput
): Promise<DiseaseDiagnosisOutput> {
  return aiDiseaseDiagnosisFlow(input);
}

const diseaseDiagnosisPrompt = ai.definePrompt({
  name: 'diseaseDiagnosisPrompt',
  input: {schema: DiseaseDiagnosisInputSchema},
  output: {schema: DiseaseDiagnosisOutputSchema},
  prompt: `You are a helpful AI assistant with expertise in dermatology. Analyze the provided image of a skin condition.

Based on the image, provide the following:
1. The most likely condition.
2. A brief description of what that condition is.
3. A few simple, non-medical first-aid or comfort measures (e.g., "keep the area clean and dry", "apply a cool compress").
4. Clear advice on when the user should see a doctor (e.g., "if the rash spreads", "if you develop a fever").

IMPORTANT: Always include the following disclaimer in your response: "This is an AI-generated analysis and not a medical diagnosis. Please consult a qualified healthcare professional for any health concerns."

Image: {{media url=photoDataUri}}`,
});

const aiDiseaseDiagnosisFlow = ai.defineFlow(
  {
    name: 'aiDiseaseDiagnosisFlow',
    inputSchema: DiseaseDiagnosisInputSchema,
    outputSchema: DiseaseDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await diseaseDiagnosisPrompt(input);
    return output!;
  }
);
