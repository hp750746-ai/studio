import { config } from 'dotenv';
config();

import '@/ai/flows/ai-symptom-checker.ts';
import '@/ai/flows/ai-medication-suggestions.ts';
import '@/ai/flows/ai-dietary-suggestions.ts';