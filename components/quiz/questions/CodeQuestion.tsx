'use client';

import CodeBlock from '@/components/patterns/CodeBlock';
import MultipleQuestion from './MultipleQuestion';
import SingleQuestion from './SingleQuestion';
import type { CodeQuestion as CodeQuestionType } from '@/types/quiz';

export default function CodeQuestion({
  question,
  options,
  value,
  onChange,
  disabled,
}: {
  question: CodeQuestionType;
  options: CodeQuestionType['options'];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}) {
  const selected = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-4">
      <CodeBlock code={question.codeSnippet} fileName="snippet.java" />
      {question.correctIds.length === 1 ? (
        <SingleQuestion options={options} value={selected[0]} disabled={disabled} onChange={(next) => onChange([next])} />
      ) : (
        <MultipleQuestion options={options} value={selected} disabled={disabled} onChange={onChange} />
      )}
    </div>
  );
}
