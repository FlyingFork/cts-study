import { notFound } from 'next/navigation';
import WalkthroughPlayer from '@/components/walkthrough/WalkthroughPlayer';
import { patterns } from '@/data/patterns';
import { getPatternWithCode } from '@/lib/server/code';

export function generateStaticParams() {
  return patterns.map((pattern) => ({ slug: pattern.slug }));
}

export default function WalkthroughPage({ params }: { params: { slug: string } }) {
  const pattern = getPatternWithCode(params.slug);
  if (!pattern) notFound();

  return <WalkthroughPlayer pattern={pattern} />;
}
