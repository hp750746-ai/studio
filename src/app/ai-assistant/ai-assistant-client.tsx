'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { checkSymptoms, SymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import { getMedicationSuggestions, MedicationSuggestionsOutput } from '@/ai/flows/ai-medication-suggestions';
import { getDietarySuggestions, DietarySuggestionsOutput } from '@/ai/flows/ai-dietary-suggestions';
import { useToast } from '@/hooks/use-toast';

const symptomSchema = z.object({
  symptoms: z
    .string()
    .min(10, { message: 'Please describe your symptoms in at least 10 characters.' }),
});

const medicationSchema = z.object({
  condition: z
    .string()
    .min(3, { message: 'Please enter a medical condition.' }),
});

const dietSchema = z.object({
  restrictions: z.string().min(3, { message: 'Please specify dietary restrictions.' }),
  goals: z.string().min(3, { message: 'Please specify your health goals.' }),
  preferences: z.string().optional(),
});


type AiResult = SymptomCheckerOutput | MedicationSuggestionsOutput | DietarySuggestionsOutput | null;

export default function AiAssistantClient() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('symptoms');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiResult>(null);

  const symptomForm = useForm<z.infer<typeof symptomSchema>>({
    resolver: zodResolver(symptomSchema),
    defaultValues: { symptoms: '' },
  });

  const medicationForm = useForm<z.infer<typeof medicationSchema>>({
    resolver: zodResolver(medicationSchema),
    defaultValues: { condition: '' },
  });

  const dietForm = useForm<z.infer<typeof dietSchema>>({
    resolver: zodResolver(dietSchema),
    defaultValues: { restrictions: '', goals: '', preferences: '' },
  });

  const handleSymptomSubmit = async (values: z.infer<typeof symptomSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await checkSymptoms({ symptoms: values.symptoms });
      setResult(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get symptom analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMedicationSubmit = async (values: z.infer<typeof medicationSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getMedicationSuggestions({ medicalCondition: values.condition });
      setResult(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get medication suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDietSubmit = async (values: z.infer<typeof dietSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getDietarySuggestions({
        dietaryRestrictions: values.restrictions,
        healthGoals: values.goals,
        foodPreferences: values.preferences,
      });
      setResult(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get dietary suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderResult = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-primary">
          <Loader2 className="h-12 w-12 animate-spin" />
          <p className="text-lg font-medium">Our AI is thinking...</p>
        </div>
      )
    }

    if (!result) return null;

    if ('likelyConditions' in result) {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Likely Conditions</h3>
            <ul className="list-disc list-inside mt-2 text-foreground/80">
              {result.likelyConditions.map((condition, i) => <li key={i}>{condition}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Advice</h3>
            <p className="mt-2 text-foreground/80">{result.advice}</p>
          </div>
        </div>
      );
    }

    if ('medicineSuggestions' in result) {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Medicine Suggestions</h3>
            <ul className="list-disc list-inside mt-2 text-foreground/80">
              {result.medicineSuggestions.map((med, i) => <li key={i}>{med}</li>)}
            </ul>
          </div>
           <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">{result.notice}</p>
        </div>
      );
    }
    
    if('suggestions' in result) {
        return (
            <div>
                <h3 className="font-semibold text-lg">Dietary Suggestions</h3>
                <p className="mt-2 whitespace-pre-line text-foreground/80">{result.suggestions}</p>
            </div>
        )
    }

    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <Tabs defaultValue="symptoms" className="w-full" onValueChange={id => { setActiveTab(id); setResult(null); }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="symptoms">Symptom Checker</TabsTrigger>
          <TabsTrigger value="medication">Medication</TabsTrigger>
          <TabsTrigger value="diet">Diet Tips</TabsTrigger>
        </TabsList>
        <TabsContent value="symptoms">
          <Card>
            <CardHeader>
              <CardTitle>Symptom Checker</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...symptomForm}>
                <form onSubmit={symptomForm.handleSubmit(handleSymptomSubmit)} className="space-y-6">
                  <FormField
                    control={symptomForm.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe your symptoms</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., I have a headache, fever, and a runny nose..." {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && activeTab === 'symptoms' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    Analyze Symptoms
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="medication">
          <Card>
            <CardHeader>
              <CardTitle>Medication Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...medicationForm}>
                <form onSubmit={medicationForm.handleSubmit(handleMedicationSubmit)} className="space-y-6">
                  <FormField
                    control={medicationForm.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Condition</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Common Cold" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && activeTab === 'medication' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    Get Suggestions
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="diet">
          <Card>
            <CardHeader>
              <CardTitle>Dietary Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...dietForm}>
                <form onSubmit={dietForm.handleSubmit(handleDietSubmit)} className="space-y-4">
                  <FormField control={dietForm.control} name="restrictions" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dietary Restrictions</FormLabel>
                        <FormControl><Input placeholder="e.g., Gluten-free, vegetarian" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField control={dietForm.control} name="goals" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Goals</FormLabel>
                        <FormControl><Input placeholder="e.g., Weight loss, muscle gain" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField control={dietForm.control} name="preferences" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food Preferences (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., Indian, prefer spicy food" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                     {isLoading && activeTab === 'diet' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    Get Diet Plan
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="bg-background rounded-lg border p-6 min-h-[300px] flex items-center justify-center">
        <Card className="w-full bg-primary/5">
            <CardHeader className="flex-row gap-4 items-center">
                <Sparkles className="h-8 w-8 text-primary"/>
                <CardTitle className="text-primary font-headline">AI Generated Response</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[150px] flex items-center justify-center">
                {renderResult() || <p className="text-muted-foreground text-center">Your AI-powered suggestions will appear here.</p>}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
