import { patterns } from '../../../data/patterns';
import FlashcardsClient from './FlashcardsClient';

export const metadata = {
  title: 'Flashcards | CTS Study Tool',
  description: 'Review all design patterns with browse and spaced-repetition flashcards.',
};

export default function FlashcardsPage() {
  const flashcards = patterns.map((pattern) => ({
    slug: pattern.slug,
    name: pattern.name,
    category: pattern.category,
    oneLiner: pattern.oneLiner,
    analogy: pattern.analogy,
    examSignals: pattern.examSignals,
  }));

  return <FlashcardsClient patterns={flashcards} />;
}
