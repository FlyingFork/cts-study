'use client';

import type { QuizQuestion as QuizQuestionType } from '@/data/quiz';
import { patterns } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import CodeBlock from '@/components/patterns/CodeBlock';

export default function QuizQuestion({
  question,
  selected,
  onAnswer,
  locked,
}: {
  question: QuizQuestionType;
  selected?: string;
  onAnswer: (slug: string) => void;
  locked: boolean;
}) {
  const { lang } = useLang();
  const answers = [question.correctAnswer, ...question.distractors]
    .map((slug) => patterns.find((pattern) => pattern.slug === slug))
    .filter(Boolean)
    .sort((a, b) => a!.name.en.localeCompare(b!.name.en));

  return (
    <div className="space-y-5">
      <p className="text-lg leading-8">{question.prompt[lang]}</p>
      {question.codeSnippet && <CodeBlock code={question.codeSnippet} fileName="snippet.java" />}
      <div className="grid gap-3 sm:grid-cols-2">
        {answers.map((pattern) => {
          if (!pattern) return null;
          const isCorrect = locked && pattern.slug === question.correctAnswer;
          const isWrong = locked && selected === pattern.slug && selected !== question.correctAnswer;
          return (
            <button
              key={pattern.slug}
              type="button"
              disabled={locked}
              onClick={() => onAnswer(pattern.slug)}
              className={`rounded-md border px-4 py-3 text-left transition ${
                isCorrect
                  ? 'border-green-600 bg-green-600/15'
                  : isWrong
                    ? 'border-red-600 bg-red-600/15'
                    : 'border-transparent bg-light-surface hover:border-light-accent dark:bg-dark-surface dark:hover:border-dark-accent'
              }`}
            >
              <span className="font-medium">{pattern.name[lang]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
