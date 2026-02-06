import { Bot } from 'lucide-react';
import AiAssistantClient from './ai-assistant-client';

export const metadata = {
  title: 'AI Health Assistant | HealthLinke',
  description: 'Get AI-powered health advice, symptom analysis, and dietary suggestions.',
};

export default function AiAssistantPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <Bot className="mx-auto h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold font-headline mt-4 text-primary">
          AI Health Assistant
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your personal health companion. Get instant suggestions for your health queries, but always consult a doctor for medical advice.
        </p>
      </div>

      <AiAssistantClient />
    </div>
  );
}
