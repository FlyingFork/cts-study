'use client';

import { useMemo, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import CodeBlock from '@/components/ui/CodeBlock';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import { recordAnswer } from '@/lib/progress';

function hashString(value) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }

  return Math.abs(hash);
}

function seededShuffle(items, seedValue) {
  const shuffled = [...items];
  let seed = hashString(seedValue || 'quiz');

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    const swapIndex = seed % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function sameAnswerSet(selected, correct) {
  return selected.length === correct.length
    && correct.every((answer) => selected.includes(answer));
}

function getCorrectAnswerText(question) {
  if (Array.isArray(question.correctAnswers)) {
    return question.correctAnswers.join(', ');
  }

  if (question.correctAnswers && typeof question.correctAnswers === 'object') {
    return Object.entries(question.correctAnswers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  }

  return '';
}

function getOptionState({ submitted, selected, correctAnswers, option }) {
  const selectedOption = selected.includes(option);
  const correctOption = correctAnswers.includes(option);

  if (!submitted) {
    return selectedOption ? 'selected' : 'idle';
  }

  if (selectedOption && correctOption) {
    return 'correct';
  }

  if (selectedOption && !correctOption) {
    return 'wrong';
  }

  if (!selectedOption && correctOption) {
    return 'missed';
  }

  return 'disabled';
}

function optionClassName(state) {
  const base = 'min-h-[48px] rounded-lg border px-4 py-3 text-left text-sm leading-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]';

  if (state === 'correct') {
    return `${base} border-[var(--color-success)] bg-emerald-950/40 text-emerald-100`;
  }

  if (state === 'wrong') {
    return `${base} border-[var(--color-error)] bg-rose-950/40 text-rose-100`;
  }

  if (state === 'missed') {
    return `${base} border-emerald-700/60 bg-emerald-950/20 text-emerald-100`;
  }

  if (state === 'selected') {
    return `${base} border-[var(--color-accent)] bg-[var(--color-surface-2)] text-[var(--color-text)]`;
  }

  if (state === 'disabled') {
    return `${base} border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)]`;
  }

  return `${base} border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]`;
}

function selectClassName(status) {
  const base = 'min-h-[44px] max-w-full rounded-md border bg-[var(--color-surface)] px-3 py-2 font-[family-name:var(--font-mono)] text-sm outline-none transition-colors focus:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]';

  if (status === 'correct') {
    return `${base} border-[var(--color-success)] text-emerald-100`;
  }

  if (status === 'wrong') {
    return `${base} border-[var(--color-error)] text-rose-100`;
  }

  return `${base} border-[var(--color-border)] text-[var(--color-text)]`;
}

function Feedback({ submitted, wasCorrect, explanation }) {
  if (!submitted) {
    return null;
  }

  return (
    <div
      className={`rounded-lg border p-4 text-sm leading-6 ${
        wasCorrect
          ? 'border-[var(--color-success)] bg-emerald-950/25 text-emerald-100'
          : 'border-[var(--color-error)] bg-rose-950/25 text-rose-100'
      }`}
    >
      <p className="font-semibold">{wasCorrect ? 'Correct' : 'Incorrect'}</p>
      <p className="mt-1 text-[var(--color-text)]">{explanation}</p>
    </div>
  );
}

function MultipleChoiceQuestion({ question, state, onSelect, onSubmit }) {
  const selected = state.selected || [];
  const correctAnswers = Array.isArray(question.correctAnswers) ? question.correctAnswers : [];
  const submitted = state.submitted;

  return (
    <div className="flex flex-col gap-4">
      {question.codeSnippet ? (
        <CodeBlock code={question.codeSnippet} maxHeight="max-h-72" />
      ) : null}

      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option) => {
          const optionState = getOptionState({
            submitted,
            selected,
            correctAnswers,
            option,
          });

          return (
            <button
              key={option}
              type="button"
              disabled={submitted}
              aria-pressed={selected.includes(option)}
              onClick={() => onSelect(option)}
              className={optionClassName(optionState)}
            >
              <span className="flex items-start gap-3">
                {question.isMultiSelect ? (
                  <span
                    aria-hidden="true"
                    className={`mt-1 h-4 w-4 shrink-0 rounded border ${
                      selected.includes(option)
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                        : 'border-[var(--color-border)]'
                    }`}
                  />
                ) : null}
                <span>{option}</span>
              </span>
            </button>
          );
        })}
      </div>

      {question.isMultiSelect && !submitted ? (
        <div>
          <Button
            type="button"
            variant="primary"
            disabled={selected.length === 0}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function CodeWithDropZones({ question, state, zoneOptions, onChange }) {
  const parts = question.snippetWithDropZones.split(/(\[\[ZONE_\d+\]\])/g);

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] shadow-inner shadow-black/30">
      <pre className="min-w-0 p-3 text-sm leading-8 text-[var(--color-text)] sm:p-4">
        <code className="block whitespace-pre font-[family-name:var(--font-mono)]">
          {parts.map((part, index) => {
            const zoneMatch = part.match(/^\[\[(ZONE_\d+)\]\]$/);
            if (!zoneMatch) {
              const highlighted = Prism.highlight(part, Prism.languages.java, 'java');
              return (
                <span
                  key={`segment-${index}`}
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
              );
            }

            const zone = zoneMatch[1];
            const selected = state.values?.[zone] || '';
            const correct = question.correctAnswers?.[zone];
            const status = !state.submitted
              ? 'idle'
              : selected === correct
                ? 'correct'
                : 'wrong';

            return (
              <span key={zone} className="inline-flex max-w-full flex-wrap items-center gap-2 align-baseline">
                <select
                  value={selected}
                  disabled={state.submitted}
                  onChange={(event) => onChange(zone, event.target.value)}
                  className={selectClassName(status)}
                  aria-label={`Answer for ${zone}`}
                >
                  <option value="">Select</option>
                  {(zoneOptions[zone] || []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {state.submitted && selected !== correct ? (
                  <span className="min-h-[28px] rounded border border-emerald-700/60 bg-emerald-950/30 px-2 py-0.5 font-[family-name:var(--font-mono)] text-xs text-emerald-100">
                    {correct}
                  </span>
                ) : null}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

function DragAndDropQuestion({ question, state, onChange, onSubmit }) {
  const zones = Object.keys(question.dropZones || {});
  const zoneOptions = useMemo(() => {
    return Object.fromEntries(
      zones.map((zone) => [
        zone,
        seededShuffle(question.dropZones[zone] || [], `${question.id}-${zone}`),
      ]),
    );
  }, [question, zones]);
  const complete = zones.every((zone) => state.values?.[zone]);

  return (
    <div className="flex flex-col gap-4">
      <CodeWithDropZones
        question={question}
        state={state}
        zoneOptions={zoneOptions}
        onChange={onChange}
      />

      {!state.submitted ? (
        <div>
          <Button type="button" disabled={!complete} onClick={onSubmit}>
            Submit
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function DropdownMatchingQuestion({ question, state, onChange, onSubmit }) {
  const matchingOptions = useMemo(() => {
    return seededShuffle(question.matchingOptions || [], `${question.id}-matching`);
  }, [question]);
  const entities = question.matchingEntities || [];
  const complete = entities.every((entity) => state.values?.[entity]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {entities.map((entity) => {
          const selected = state.values?.[entity] || '';
          const correct = question.correctAnswers?.[entity];
          const status = !state.submitted
            ? 'idle'
            : selected === correct
              ? 'correct'
              : 'wrong';

          return (
            <div
              key={entity}
              className="grid grid-cols-1 gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 md:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] md:items-center"
            >
              <label className="text-sm font-semibold leading-6 text-[var(--color-text)]">
                {entity}
              </label>
              <div className="flex flex-col gap-2">
                <select
                  value={selected}
                  disabled={state.submitted}
                  onChange={(event) => onChange(entity, event.target.value)}
                  className={selectClassName(status)}
                >
                  <option value="">Select match</option>
                  {matchingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {state.submitted && selected !== correct ? (
                  <p className="text-xs leading-5 text-emerald-100">
                    Correct: {correct}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {!state.submitted ? (
        <div>
          <Button type="button" disabled={!complete} onClick={onSubmit}>
            Submit
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function createInitialState(question) {
  if (question?.type === 'multiple_choice') {
    return {
      selected: [],
      submitted: false,
      wasCorrect: false,
    };
  }

  return {
    values: {},
    submitted: false,
    wasCorrect: false,
  };
}

export default function QuizSession({ questions, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState(() => createInitialState(questions[0]));
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);

  const currentQuestion = questions[currentIndex];
  const plannedTotal = questions.length;
  const progress = plannedTotal > 0 ? ((currentIndex + 1) / plannedTotal) * 100 : 0;
  const isFinalQuestion = currentIndex >= plannedTotal - 1;

  function completeSession({ nextAnswered = answered, nextScore = score, endedEarly = false } = {}) {
    const wrongIds = new Set(
      nextAnswered
        .filter((answer) => !answer.wasCorrect)
        .map((answer) => answer.questionId),
    );

    onComplete({
      score: nextScore,
      total: nextAnswered.length,
      plannedTotal,
      answeredCount: nextAnswered.length,
      answers: nextAnswered,
      wrongQuestions: questions.filter((question) => wrongIds.has(question.id)),
      endedEarly,
    });
  }

  function submitAnswer(wasCorrect) {
    if (!currentQuestion || answerState.submitted) {
      return;
    }

    recordAnswer(currentQuestion.id, wasCorrect);

    const nextScore = score + (wasCorrect ? 1 : 0);
    const nextAnswered = [
      ...answered,
      {
        questionId: currentQuestion.id,
        wasCorrect,
      },
    ];

    setScore(nextScore);
    setAnswered(nextAnswered);
    setAnswerState((current) => ({
      ...current,
      submitted: true,
      wasCorrect,
    }));
  }

  function selectMultipleChoice(option) {
    if (!currentQuestion || answerState.submitted) {
      return;
    }

    if (!currentQuestion.isMultiSelect) {
      const wasCorrect = sameAnswerSet([option], currentQuestion.correctAnswers || []);
      setAnswerState({
        selected: [option],
        submitted: false,
        wasCorrect: false,
      });

      recordAnswer(currentQuestion.id, wasCorrect);

      const nextScore = score + (wasCorrect ? 1 : 0);
      const nextAnswered = [
        ...answered,
        {
          questionId: currentQuestion.id,
          wasCorrect,
        },
      ];

      setScore(nextScore);
      setAnswered(nextAnswered);
      setAnswerState({
        selected: [option],
        submitted: true,
        wasCorrect,
      });
      return;
    }

    setAnswerState((current) => {
      const selected = current.selected.includes(option)
        ? current.selected.filter((item) => item !== option)
        : [...current.selected, option];

      return {
        ...current,
        selected,
      };
    });
  }

  function submitMultipleChoice() {
    submitAnswer(sameAnswerSet(answerState.selected || [], currentQuestion.correctAnswers || []));
  }

  function changeValue(key, value) {
    if (answerState.submitted) {
      return;
    }

    setAnswerState((current) => ({
      ...current,
      values: {
        ...current.values,
        [key]: value,
      },
    }));
  }

  function submitMappedAnswers(keys) {
    const wasCorrect = keys.every((key) => {
      return answerState.values?.[key] === currentQuestion.correctAnswers?.[key];
    });

    submitAnswer(wasCorrect);
  }

  function moveNext() {
    if (isFinalQuestion) {
      completeSession();
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setAnswerState(createInitialState(questions[nextIndex]));
  }

  if (!currentQuestion) {
    return (
      <EmptyState
        title="No questions available"
        actions={(
          <Button type="button" variant="secondary" onClick={() => completeSession()}>
            Back
          </Button>
        )}
      >
        This session does not have any questions to show.
      </EmptyState>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Question {currentIndex + 1} / {plannedTotal}
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              Score: {score} / {answered.length}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => completeSession({ endedEarly: true })}
          >
            End early
          </Button>
        </div>
        <ProgressBar value={progress} />
      </Card>

      <Card className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            {currentQuestion.type.replaceAll('_', ' ')}
          </p>
          <h1 className="text-xl font-semibold leading-8 text-[var(--color-text)]">
            {currentQuestion.questionText}
          </h1>
        </div>

        {currentQuestion.type === 'multiple_choice' ? (
          <MultipleChoiceQuestion
            question={currentQuestion}
            state={answerState}
            onSelect={selectMultipleChoice}
            onSubmit={submitMultipleChoice}
          />
        ) : null}

        {currentQuestion.type === 'drag_and_drop' ? (
          <DragAndDropQuestion
            question={currentQuestion}
            state={answerState}
            onChange={changeValue}
            onSubmit={() => submitMappedAnswers(Object.keys(currentQuestion.dropZones || {}))}
          />
        ) : null}

        {currentQuestion.type === 'dropdown_matching' ? (
          <DropdownMatchingQuestion
            question={currentQuestion}
            state={answerState}
            onChange={changeValue}
            onSubmit={() => submitMappedAnswers(currentQuestion.matchingEntities || [])}
          />
        ) : null}

        <Feedback
          submitted={answerState.submitted}
          wasCorrect={answerState.wasCorrect}
          explanation={currentQuestion.explanation}
        />

        {answerState.submitted ? (
          <div className="flex justify-end">
            <Button type="button" size="lg" onClick={moveNext}>
              {isFinalQuestion ? 'Finish' : 'Next'}
            </Button>
          </div>
        ) : null}
      </Card>
    </section>
  );
}

export { getCorrectAnswerText };
