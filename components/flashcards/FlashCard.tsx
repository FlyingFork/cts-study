'use client';

import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import type { Pattern } from '@/data/patterns';
import { useLang } from '@/lib/context/LangContext';
import CategoryBadge from '@/components/ui/CategoryBadge';

export default function FlashCard({ pattern, flipped, onFlip }: { pattern: Pattern; flipped: boolean; onFlip: () => void }) {
  const { lang, t } = useLang();

  return (
    <button
      type="button"
      onClick={onFlip}
      className="group w-full rounded-md text-left outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
      aria-label={t('flash.flip')}
    >
      <motion.div
        key={`${pattern.slug}-${flipped ? 'back' : 'front'}`}
        initial={{ opacity: 0, y: 10, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.985 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="home-hero-panel flex min-h-[430px] flex-col justify-between rounded-md p-6 transition group-hover:-translate-y-0.5 md:p-8"
      >
        {!flipped ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-light-accent shadow-sm dark:bg-dark-bg/80 dark:text-dark-accent">
                {t('flash.front')}
              </span>
              <CategoryBadge category={pattern.category} lang={lang} />
            </div>
            <div className="max-w-xl">
              <p className="font-mono text-sm text-light-muted dark:text-dark-muted">
                {String(pattern.number).padStart(2, '0')} / 10
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">{pattern.name[lang]}</h2>
              <p className="mt-5 text-base leading-7 text-light-muted dark:text-dark-muted">{pattern.oneliner[lang]}</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-md bg-light-accent px-3 py-2 text-sm font-semibold text-white dark:bg-dark-accent dark:text-dark-bg">
              <RotateCcw className="h-4 w-4" />
              {t('flash.flip')}
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-light-accent shadow-sm dark:bg-dark-bg/80 dark:text-dark-accent">
                {t('flash.back')}
              </span>
              <CategoryBadge category={pattern.category} lang={lang} />
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="rounded-md bg-white/82 p-5 shadow-sm dark:bg-dark-bg/82">
                <p className="text-sm font-semibold text-light-accent dark:text-dark-accent">{t('flash.analogy')}</p>
                <p className="mt-3 leading-7 text-light-muted dark:text-dark-muted">{pattern.analogy[lang]}</p>
              </div>
              <div className="rounded-md bg-white/82 p-5 shadow-sm dark:bg-dark-bg/82">
                <p className="text-sm font-semibold text-light-accent dark:text-dark-accent">{t('flash.keywords')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pattern.examKeywords.map((keyword) => (
                    <span key={keyword.en} className="rounded-md bg-light-surface px-2 py-1 font-mono text-xs text-light-keyword dark:bg-dark-surface dark:text-dark-keyword">
                      {keyword[lang]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-md bg-light-bg px-3 py-2 text-sm font-semibold text-light-accent dark:bg-dark-bg dark:text-dark-accent">
              <RotateCcw className="h-4 w-4" />
              {t('flash.flip')}
            </span>
          </>
        )}
      </motion.div>
    </button>
  );
}
