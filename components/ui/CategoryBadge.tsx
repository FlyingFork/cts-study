import type { Lang, PatternCategory } from '@/data/patterns';
import { translations } from '@/data/translations';

export default function CategoryBadge({ category, lang }: { category: PatternCategory; lang: Lang }) {
  const className =
    category === 'structural'
      ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300'
      : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${className}`}>
      {translations[lang][`category.${category}`]}
    </span>
  );
}
