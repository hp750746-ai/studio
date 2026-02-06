import { Sparkles } from 'lucide-react';
import { wellnessArticles } from '@/lib/data';
import WellnessCard from '@/components/app/wellness-card';

export const metadata = {
  title: 'Wellness & Health Tips | HealthLinke',
  description: 'Explore articles and guides on yoga, diet plans, pregnancy care, mental health, and more.',
};

export default function WellnessPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <Sparkles className="mx-auto h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold font-headline mt-4 text-primary">
          Wellness Hub
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your guide to a healthier lifestyle. Explore videos, diet plans, and tips for a balanced life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {wellnessArticles.map((article) => (
          <WellnessCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
