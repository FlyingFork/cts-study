import { notFound } from 'next/navigation';
import { patterns } from '../../../../data/patterns';
import { getQuestionsByPattern } from '@/lib/questionTags';
import PatternDetailClient from './PatternDetailClient';

export function generateStaticParams() {
  return patterns.map((pattern) => ({
    slug: pattern.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pattern = patterns.find((item) => item.slug === slug);

  if (!pattern) {
    return {
      title: 'Pattern Not Found | CTS Study Tool',
    };
  }

  return {
    title: `${pattern.name} | CTS Study Tool`,
    description: pattern.oneLiner,
  };
}

export default async function PatternDetailPage({ params }) {
  const { slug } = await params;
  const patternIndex = patterns.findIndex((item) => item.slug === slug);

  if (patternIndex === -1) {
    notFound();
  }

  const pattern = patterns[patternIndex];
  const previousPattern = patterns[(patternIndex - 1 + patterns.length) % patterns.length];
  const nextPattern = patterns[(patternIndex + 1) % patterns.length];
  const quickCheckQuestions = getQuestionsByPattern(slug)
    .filter((question) => question.type === 'multiple_choice')
    .slice(0, 3);

  return (
    <PatternDetailClient
      pattern={pattern}
      previousPattern={{
        slug: previousPattern.slug,
        name: previousPattern.name,
      }}
      nextPattern={{
        slug: nextPattern.slug,
        name: nextPattern.name,
      }}
      quickCheckQuestions={quickCheckQuestions}
    />
  );
}
