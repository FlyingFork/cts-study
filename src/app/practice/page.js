import { patterns } from '../../../data/patterns';
import {
  getAllPatternTags,
  getAllTopicTags,
  getTaggedQuestions,
} from '@/lib/questionTags';
import PracticeClient from './PracticeClient';

export const metadata = {
  title: 'Practice | CTS Study Tool',
  description: 'Build an untimed custom practice session from design pattern and software quality questions.',
};

const CATEGORY_ORDER = ['Creational', 'Structural', 'Behavioral'];

function buildPatternGroups(patternTags) {
  const patternBySlug = new Map(patterns.map((pattern) => [pattern.slug, pattern]));
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: [],
  }));
  const groupByCategory = new Map(grouped.map((group) => [group.category, group]));

  for (const tag of patternTags) {
    const pattern = patternBySlug.get(tag);
    const category = pattern?.category || 'Other';

    if (!groupByCategory.has(category)) {
      const group = { category, items: [] };
      grouped.push(group);
      groupByCategory.set(category, group);
    }

    groupByCategory.get(category).items.push({
      slug: tag,
      name: pattern?.name || tag,
      category,
    });
  }

  return grouped
    .map((group) => ({
      ...group,
      items: group.items.sort((left, right) => left.name.localeCompare(right.name)),
    }))
    .filter((group) => group.items.length > 0);
}

export default function PracticePage() {
  const questions = getTaggedQuestions();
  const patternGroups = buildPatternGroups(getAllPatternTags());
  const topicTags = getAllTopicTags().sort((left, right) => left.localeCompare(right));

  return (
    <PracticeClient
      questions={questions}
      patternGroups={patternGroups}
      topicTags={topicTags}
    />
  );
}
