import { notFound } from 'next/navigation';
import PatternGuide from '@/components/patterns/PatternGuide';
import { patterns } from '@/data/patterns';
import { getPatternWithCode } from '@/lib/server/code';

export function generateStaticParams() {
  return patterns.map((pattern) => ({ slug: pattern.slug }));
}

export default function PatternPage({ params }: { params: { slug: string } }) {
  const pattern = getPatternWithCode(params.slug);
  if (!pattern) notFound();

  return (
    <PatternGuide pattern={pattern} />
  );
}
