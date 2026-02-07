import Image from 'next/image';
import { notFound } from 'next/navigation';
import { wellnessArticles } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = wellnessArticles.find((a) => a.id === params.id);
  if (!article) {
    return {
      title: 'Article not found | HealthLinke',
    }
  }
  return {
    title: `${article.title} | HealthLinke`,
    description: article.description,
  }
}

export default function WellnessArticlePage({ params }: { params: { id: string } }) {
  const article = wellnessArticles.find((a) => a.id === params.id);

  if (!article) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === article.image);

  const fullArticleContent: Record<string, {paragraphs: string[]}> = {
    well1: {
      paragraphs: [
        "Yoga is a mind and body practice with a 5,000-year history in ancient Indian philosophy. Various styles of yoga combine physical postures, breathing techniques, and meditation or relaxation.",
        "Some simple poses to start with include Mountain Pose (Tadasana), Downward-Facing Dog (Adho Mukha Svanasana), and Warrior I (Virabhadrasana I). These foundational poses help build strength, flexibility, and balance.",
        "Consistency is key. Try practicing for just 15-20 minutes each day to start feeling the benefits. Over time, you can gradually increase the duration and difficulty of your practice."
      ]
    },
    well2: {
      paragraphs: [
        "A healthy diet is crucial for weight loss, but it doesn't have to be about deprivation. Focus on eating a variety of nutrient-dense foods, including fruits, vegetables, lean proteins, and whole grains.",
        "Portion control is also important. Use smaller plates to help manage serving sizes. Drink plenty of water throughout the day, as it can help you feel full and boost your metabolism.",
        "Avoid processed foods, sugary drinks, and excessive amounts of unhealthy fats. Instead, opt for whole foods that are minimally processed. Remember, slow and steady progress is more sustainable in the long run."
      ]
    },
    well3: {
      paragraphs: [
        "Pregnancy is a special time that requires extra care for both mother and baby. Regular prenatal check-ups with your doctor are essential to monitor the health of you and your baby.",
        "A balanced diet, regular exercise (as approved by your doctor), and adequate rest are crucial. Folic acid, iron, and calcium are particularly important nutrients during pregnancy.",
        "It's also important to take care of your mental health. Don't hesitate to talk to your partner, friends, or a professional about any anxieties or concerns you may have."
      ]
    },
    well4: {
        paragraphs: [
            "Stress is a natural part of life, but chronic stress can take a toll on your health. Learning to manage stress is key to overall well-being. Techniques like deep breathing, meditation, and mindfulness can be very effective.",
            "Regular physical activity is a great stress reliever. Even a brisk walk can help clear your mind and reduce stress levels. Ensure you're getting enough sleep, as fatigue can exacerbate stress.",
            "Connecting with others can also help. Spend time with friends and family who are supportive. If you're feeling overwhelmed, consider talking to a mental health professional."
        ]
    },
    well5: {
        paragraphs: [
            "Aging is a natural process, and a healthy lifestyle can help you enjoy your later years to the fullest. Staying physically active is one of the most important things you can do for your health.",
            "A balanced diet, rich in nutrients, can help prevent age-related health issues. Social engagement is also crucial for mental and emotional health. Stay connected with friends, family, and your community.",
            "Regular check-ups with your doctor are important to catch any health problems early. It's never too late to adopt healthy habits for a better quality of life."
        ]
    }
  }

  const content = fullArticleContent[article.id] || { paragraphs: [article.description, "More content coming soon..."] };

  return (
    <div className="bg-background">
      <div className="container mx-auto py-12 lg:py-16">
        <article className="max-w-4xl mx-auto">
            {image && (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-8 shadow-lg">
                    <Image
                        src={image.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                        priority
                    />
                </div>
            )}
            <div className="mb-8 text-center">
                <Badge variant="secondary" className="text-sm">{article.category}</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold font-headline mt-4 text-primary">{article.title}</h1>
                <p className="mt-4 text-lg text-muted-foreground">{article.description}</p>
            </div>

            <div className="prose-lg max-w-none mx-auto text-foreground/90 text-lg space-y-6">
                {content.paragraphs.map((p, i) => <p key={i} className="leading-relaxed">{p}</p>)}
            </div>
        </article>
      </div>
    </div>
  );
}
