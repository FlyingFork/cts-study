'use client';

import { BarChart3, BookOpenCheck, CheckCircle2, Clock, Dumbbell, Flag, Languages, ListChecks, MousePointerClick, Trophy } from 'lucide-react';
import Link from 'next/link';
import { questions, topicLabels } from '@/data/questions';
import { useLang } from '@/lib/context/LangContext';
import { useQuizStats } from '@/lib/hooks/useQuizStats';
import type { Topic } from '@/types/quiz';

const topics = Object.keys(topicLabels) as Topic[];

const copy = {
  en: {
    title: 'CTS Quiz Platform',
    subtitle: 'Practice the CTS exam mix: design patterns, SOLID, clean code, JUnit 4, and testing strategies.',
    stats: 'Stats',
    startExam: 'Start Exam',
    examBody: '50 questions, 60 minute timer, no explanations until results.',
    practiceMode: 'Practice Mode',
    practiceBody: '20 questions, unlimited time, explanations after each answer.',
    guideTitle: 'How this quiz works',
    guideIntro: 'Use Exam mode when you want a faculty-style simulation. Use Practice mode when you want to learn from explanations and repeat weak topics.',
    topicFilters: 'Topic filters',
    questions: 'questions',
    practice: 'Practice',
    lastSessions: 'Last sessions',
    noSessions: 'No finished sessions yet.',
    guide: [
      {
        title: 'Choose a mode',
        body: 'Exam starts a timed mixed session. Practice starts a shorter session with instant feedback, skip support, and theory links when a question maps to a pattern page.',
      },
      {
        title: 'Answer every question type',
        body: 'The bank includes single choice, multiple choice, matching, ordering, and Java code questions. Multiple-choice questions may have more than one correct answer.',
      },
      {
        title: 'Use the navigation grid',
        body: 'The numbered grid lets you jump between questions. Filled items are answered, orange items are flagged, and the highlighted item is your current question.',
      },
      {
        title: 'Flag uncertain answers',
        body: 'Flag questions you want to review before submitting. Flags do not change your score; they only mark questions for navigation.',
      },
      {
        title: 'Read scoring carefully',
        body: 'Single and ordering questions are all-or-nothing. Matching gives proportional credit. Multiple-select subtracts for wrong selections, so guessing everything is penalized.',
      },
      {
        title: 'Review results and stats',
        body: 'After submission, results show pass/fail, topic breakdown, earned points per question, explanations, and retry links. Stats tracks average score, best score, weak areas, and history.',
      },
    ],
    language: 'The language toggle in the top bar changes quiz prompts, answer choices, explanations, topic labels, and controls between English and Romanian.',
  },
  ro: {
    title: 'Platforma de quiz CTS',
    subtitle: 'Exerseaza materia de examen CTS: design pattern-uri, SOLID, Clean Code, JUnit 4 si strategii de testare.',
    stats: 'Statistici',
    startExam: 'Incepe examen',
    examBody: '50 de intrebari, cronometru de 60 de minute, fara explicatii pana la rezultate.',
    practiceMode: 'Mod practica',
    practiceBody: '20 de intrebari, timp nelimitat, explicatii dupa fiecare raspuns.',
    guideTitle: 'Cum functioneaza quiz-ul',
    guideIntro: 'Foloseste modul Examen pentru o simulare apropiata de platforma facultatii. Foloseste modul Practica atunci cand vrei sa inveti din explicatii si sa repeti topicurile slabe.',
    topicFilters: 'Filtre pe topic',
    questions: 'intrebari',
    practice: 'Practica',
    lastSessions: 'Ultimele sesiuni',
    noSessions: 'Nu exista sesiuni finalizate inca.',
    guide: [
      {
        title: 'Alege un mod',
        body: 'Examen porneste o sesiune mixta cronometrata. Practica porneste o sesiune mai scurta cu feedback imediat, skip si linkuri catre teorie cand intrebarea corespunde unei pagini de pattern.',
      },
      {
        title: 'Raspunde la toate tipurile',
        body: 'Banca include intrebari single choice, multiple choice, matching, ordering si intrebari cu cod Java. Intrebarile multiple choice pot avea mai multe raspunsuri corecte.',
      },
      {
        title: 'Foloseste grila de navigare',
        body: 'Grila numerotata iti permite sa sari intre intrebari. Elementele pline sunt raspunse, cele portocalii sunt marcate, iar elementul evidentiat este intrebarea curenta.',
      },
      {
        title: 'Marcheaza raspunsurile incerte',
        body: 'Marcheaza intrebarile pe care vrei sa le revizuiesti inainte de trimitere. Marcajele nu schimba scorul; sunt doar pentru navigare.',
      },
      {
        title: 'Citeste atent scorarea',
        body: 'Intrebarile single si ordering sunt totul-sau-nimic. Matching acorda punctaj proportional. Multiple-select scade pentru selectii gresite, deci bifarea tuturor raspunsurilor este penalizata.',
      },
      {
        title: 'Revizuieste rezultatele si statisticile',
        body: 'Dupa trimitere, rezultatele arata admis/respins, breakdown pe topic, punctajul pe fiecare intrebare, explicatii si linkuri de retry. Statisticile urmaresc media, cel mai bun scor, zonele slabe si istoricul.',
      },
    ],
    language: 'Butonul de limba din bara de sus schimba intre engleza si romana pentru enunturi, variante, explicatii, topicuri si controale.',
  },
} as const;

const guideIcons = [MousePointerClick, CheckCircle2, ListChecks, Flag, Trophy, BarChart3];

export default function QuizDashboardPage() {
  const { lang } = useLang();
  const text = copy[lang];
  const stats = useQuizStats();
  const lastSessions = stats.finished.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-light-accent dark:text-dark-accent">quiz/home</p>
          <h1 className="mt-2 text-3xl font-semibold">{text.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-light-muted dark:text-dark-muted">
            {text.subtitle}
          </p>
        </div>
        <Link href="/quiz/stats" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-light-border px-4 py-2 text-sm font-semibold dark:border-dark-border">
          <BarChart3 className="h-4 w-4" />
          {text.stats}
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/quiz/exam" className="surface-hover rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-light-accent dark:text-dark-accent" />
            <h2 className="text-xl font-semibold">{text.startExam}</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-light-muted dark:text-dark-muted">{text.examBody}</p>
        </Link>
        <Link href="/quiz/practice" className="surface-hover rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
          <div className="flex items-center gap-3">
            <Dumbbell className="h-5 w-5 text-light-accent dark:text-dark-accent" />
            <h2 className="text-xl font-semibold">{text.practiceMode}</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-light-muted dark:text-dark-muted">{text.practiceBody}</p>
        </Link>
      </section>

      <section className="rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-light-accent dark:text-dark-accent">quiz/guide</p>
          <h2 className="mt-2 text-2xl font-semibold">{text.guideTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-light-muted dark:text-dark-muted">{text.guideIntro}</p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {text.guide.map((item, index) => {
            const Icon = guideIcons[index];
            return (
              <div key={item.title} className="rounded-md bg-light-bg p-4 dark:bg-dark-bg">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-light-surface2 text-light-accent dark:bg-dark-surface2 dark:text-dark-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-light-muted dark:text-dark-muted">{item.body}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-3 rounded-md bg-light-bg p-4 text-sm leading-6 text-light-muted dark:bg-dark-bg dark:text-dark-muted">
          <Languages className="mt-0.5 h-4 w-4 shrink-0 text-light-accent dark:text-dark-accent" />
          <p>{text.language}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
          <div className="mb-4 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-light-accent dark:text-dark-accent" />
            <h2 className="font-semibold">{text.topicFilters}</h2>
          </div>
          <div className="grid gap-3">
            {topics.map((topic) => {
              const total = questions.filter((question) => question.topic === topic).length;
              const row = stats.topicStats.find((item) => item.topic === topic);
              const percent = row?.totalPoints ? Math.round((row.pointsEarned / row.totalPoints) * 100) : 0;
              return (
                <div key={topic} className="rounded-md bg-light-bg p-3 dark:bg-dark-bg">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{topicLabels[topic][lang]}</span>
                    <span className="text-light-muted dark:text-dark-muted">{total} {text.questions}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-light-surface2 dark:bg-dark-surface2">
                    <div className="h-2 rounded-full bg-light-accent dark:bg-dark-accent" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/quiz/practice?topic=${topic}`} className="rounded-md border border-light-border px-3 py-1.5 text-xs font-semibold dark:border-dark-border">
                      {text.practice}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-md border border-light-border bg-light-surface p-5 dark:border-dark-border dark:bg-dark-surface">
          <div className="mb-4 flex items-center gap-2">
            <BookOpenCheck className="h-4 w-4 text-light-accent dark:text-dark-accent" />
            <h2 className="font-semibold">{text.lastSessions}</h2>
          </div>
          {lastSessions.length ? (
            <div className="space-y-3">
              {lastSessions.map((session) => (
                <Link key={session.id} href={`/quiz/results/${session.id}`} className="block rounded-md bg-light-bg p-3 text-sm dark:bg-dark-bg">
                  <div className="flex justify-between gap-3">
                    <span className="font-medium capitalize">{session.mode}</span>
                    <span className="font-mono">{(session.score ?? 0).toFixed(2)}/{session.totalPoints}</span>
                  </div>
                  <p className="mt-1 text-xs text-light-muted dark:text-dark-muted">{new Date(session.finishedAt ?? session.startedAt).toLocaleString()}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-light-muted dark:text-dark-muted">{text.noSessions}</p>
          )}
        </div>
      </section>
    </div>
  );
}
