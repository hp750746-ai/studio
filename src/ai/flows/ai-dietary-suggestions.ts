'use server';

/**
 * @fileOverview Provides personalized dietary suggestions based on user restrictions and health goals.
 *
 * - `getDietarySuggestions` - A function that takes user input and returns dietary suggestions.
 * - `DietarySuggestionsInput` - The input type for the `getDietarySuggestions` function.
 * - `DietarySuggestionsOutput` - The return type for the `getDietarySuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DietarySuggestionsInputSchema = z.object({
  dietaryRestrictions: z
    .string()
    .describe(
      'Specific dietary restrictions or allergies the user has (e.g., gluten-free, dairy-free, nut allergy).'
    ),
  healthGoals: z
    .string()
    .describe(
      'The users health and wellness goals (e.g., weight loss, muscle gain, improved energy).'
    ),
  foodPreferences: z
    .string()
    .optional()
    .describe(
      'The users preferred types of food (e.g. Seafood, Vegan, Indian food).'
    ),
});
export type DietarySuggestionsInput = z.infer<typeof DietarySuggestionsInputSchema>;

const DietarySuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('A list of dietary suggestions tailored to the user.'),
});
export type DietarySuggestionsOutput = z.infer<typeof DietarySuggestionsOutputSchema>;

export async function getDietarySuggestions(
  input: DietarySuggestionsInput
): Promise<DietarySuggestionsOutput> {
  return aiDietarySuggestionsFlow(input);
}

const dietarySuggestionsPrompt = ai.definePrompt({
  name: 'dietarySuggestionsPrompt',
  input: {schema: DietarySuggestionsInputSchema},
  output: {schema: DietarySuggestionsOutputSchema},
  prompt: `You are a registered dietician that specializes in providing dietary suggestions based on dietary restrictions and health goals.

    Dietary Restrictions: {{{dietaryRestrictions}}}
    Health Goals: {{{healthGoals}}}
    Food Preferences: {{{foodPreferences}}}

    Based on these details, provide personalized dietary suggestions.`,
});

const aiDietarySuggestionsFlow = ai.defineFlow(
  {
    name: 'aiDietarySuggestionsFlow',
    inputSchema: DietarySuggestionsInputSchema,
    outputSchema: DietarySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await dietarySuggestionsPrompt(input);
    return output!;
  }
);
