import Image from 'next/image';
import Link from 'next/link';

import type { WellnessArticle } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type WellnessCardProps = {
  article: WellnessArticle;
  className?: string;
};

export default function WellnessCard({ article, className }: WellnessCardProps) {
  const image = PlaceHolderImages.find(img => img.id === article.image);

  return (
    <Card className={cn('flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300', className)}>
      <div className="relative h-48 w-full">
        {image && (
          <Image
            src={image.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            data-ai-hint={image.imageHint}
          />
        )}
      </div>
      <CardHeader>
        <Badge variant="outline" className="w-fit">{article.category}</Badge>
        <CardTitle className="text-xl font-headline text-primary mt-2">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{article.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild>
          <Link href={`/wellness/${article.id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
