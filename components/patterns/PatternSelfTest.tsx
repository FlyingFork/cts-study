'use client';

import { useState } from 'react';
import type { SelfTestQuestion } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';

type Props = {
  questions: SelfTestQuestion[];
};

export default function PatternSelfTest({ questions }: Props) {
  const { lang, t } = useLang();
  const [selected, setSelected] = useState<Record<string, number | null>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function handleCheck(id: string) {
    setChecked((prev) => ({ ...prev, [id]: true }));
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => {
        const sel = selected[q.id] ?? null;
        const isChecked = checked[q.id] ?? false;
        const isCorrect = sel === q.correctIndex;

        return (
          <div key={q.id} className="rounded-md bg-light-surface p-4 dark:bg-dark-surface">
            <p className="mb-3 text-sm font-semibold">{q.question[lang]}</p>
            <div className="space-y-2">
              {q.options.map((option, index) => {
                const isSelected = sel === index;
                let optionStyle = 'rounded-md border px-3 py-2 text-left text-sm transition w-full ';
                if (!isChecked) {
                  optionStyle += isSelected
                    ? 'border-light-accent bg-light-accent/10 text-light-accent dark:border-dark-accent dark:bg-dark-accent/10 dark:text-dark-accent'
                    : 'border-light-border bg-light-bg text-light-text hover:border-light-accent dark:border-dark-border dark:bg-dark-bg dark:text-dark-text dark:hover:border-dark-accent';
                } else if (index === q.correctIndex) {
                  optionStyle += 'border-green-500 bg-green-500/10 text-green-800 dark:text-green-300';
                } else if (isSelected && !isCorrect) {
                  optionStyle += 'border-red-400 bg-red-400/10 text-red-800 dark:text-red-300';
                } else {
                  optionStyle += 'border-light-border bg-light-bg text-light-muted dark:border-dark-border dark:bg-dark-bg dark:text-dark-muted';
                }

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={isChecked}
                    onClick={() => setSelected((prev) => ({ ...prev, [q.id]: index }))}
                    className={optionStyle}
                  >
                    {option[lang]}
                  </button>
                );
              })}
            </div>

            {!isChecked && (
              <button
                type="button"
                disabled={sel === null}
                onClick={() => handleCheck(q.id)}
                className="mt-3 rounded-md bg-light-accent px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-dark-accent dark:text-dark-bg"
              >
                {t('guide.checkAnswer')}
              </button>
            )}

            {isChecked && (
              <div className={`mt-3 rounded-md p-3 text-sm ${isCorrect ? 'bg-green-500/10 text-green-800 dark:text-green-300' : 'bg-red-400/10 text-red-800 dark:text-red-300'}`}>
                <p className="font-semibold">{isCorrect ? t('guide.correct') : t('guide.tryAgain')}</p>
                <p className="mt-1">
                  <span className="font-medium">{t('guide.answerExplanation')}: </span>
                  {q.explanation[lang]}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
