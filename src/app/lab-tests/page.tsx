import { TestTube } from 'lucide-react';
import { labTests } from '@/lib/data';
import LabTestCard from '@/components/app/lab-test-card';

export const metadata = {
  title: 'Book Lab Tests Online | HealthLinke',
  description: 'Book blood tests, sugar tests, and full body checkups with home sample collection.',
};

export default function LabTestsPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <TestTube className="mx-auto h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold font-headline mt-4 text-primary">
          Book Lab Tests
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Conveniently book lab tests from home. Get your samples collected and reports online.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {labTests.map((test) => (
          <LabTestCard key={test.id} test={test} />
        ))}
      </div>
    </div>
  );
}
