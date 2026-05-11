import 'server-only';

import { patterns } from '@/data/patterns';
import { quizQuestions } from '@/data/quiz';
import { readPatternCode } from './code';

function bullet(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n');
}

function mdEscape(value: string) {
  return value.replace(/\r\n/g, '\n').trim();
}

export const aiTutorPrompt = `You are helping me study CTS design patterns using the attached Markdown knowledge base as the only source of truth.

When I give you a professor-style question:
1. Identify the most likely pattern from the course's 10 patterns.
2. Explain the decision using the exact exam clues and intent from the knowledge base.
3. Name the required roles/classes and map them to the problem.
4. If code is requested, write a Java solution in the same style as the course examples.
5. If two patterns are similar, compare them and explain why the rejected pattern is not the best answer.
6. Keep the answer exam-focused, concise, and aligned with the professor's expected reasoning.

Do not invent patterns outside this course unless I explicitly ask. If the question is ambiguous, ask for the missing detail before choosing a pattern.`;

export function buildCourseMarkdown() {
  const lines: string[] = [
    '# CTS Design Patterns Course Knowledge Base',
    '',
    'This Markdown file is designed to be read by an AI assistant before helping with CTS design-pattern questions. Treat this document as the canonical course source.',
    '',
    '## AI Tutor Prompt',
    '',
    '```text',
    aiTutorPrompt,
    '```',
    '',
    '## Course Scope',
    '',
    'The course focuses on 10 software design patterns:',
    '',
    bullet(patterns.map((pattern) => `${pattern.number}. ${pattern.name.en} (${pattern.category}) - ${pattern.oneliner.en}`)),
    '',
    '## How To Answer Professor-Style Questions',
    '',
    bullet([
      'Start from the problem intent, not from class names.',
      'Look for exam trigger words such as incompatible, dynamically add, tree, memory, simplified API, control access, user preference, pass to next, queue, undo, subscribe, or notify.',
      'Choose one pattern, then justify it with intent, roles, and structure.',
      'If the prompt asks for implementation, use Java classes and role names consistent with the examples below.',
      'When similar patterns compete, explain the deciding difference: interface change, same interface, wrapper purpose, tree vs chain, queue vs algorithm, or one handler vs all observers.',
    ]),
    '',
    '## Pattern Confusion Rules',
    '',
    '### Adapter vs Decorator vs Proxy',
    '',
    bullet([
      'Adapter changes or translates an incompatible interface.',
      'Decorator keeps the same interface and adds behavior/features dynamically.',
      'Proxy keeps the same interface and controls access, filters, logs, or lazy-loads.',
    ]),
    '',
    '### Strategy vs Chain vs Command',
    '',
    bullet([
      'Strategy selects one interchangeable algorithm based on preference or configuration.',
      'Chain passes a request through handlers until one handles it.',
      'Command turns an action/request into an object so it can be queued, logged, or undone.',
    ]),
    '',
    '### Composite vs Chain',
    '',
    bullet([
      'Composite is a tree of individual objects and groups treated uniformly.',
      'Chain is a linear sequence of handlers for routing a request.',
    ]),
    '',
    '## Patterns',
    '',
  ];

  for (const pattern of patterns) {
    const related = pattern.confusedWith.map((slug) => patterns.find((item) => item.slug === slug)?.name.en ?? slug);

    lines.push(
      `### ${pattern.number}. ${pattern.name.en}`,
      '',
      `- Category: ${pattern.category}`,
      `- One-line intent: ${pattern.oneliner.en}`,
      `- Romanian intent: ${pattern.oneliner.ro}`,
      `- Analogy: ${pattern.analogy.en}`,
      `- Romanian analogy: ${pattern.analogy.ro}`,
      `- Often confused with: ${related.join(', ') || 'None'}`,
      '',
      '#### Exam Keywords',
      '',
      bullet(pattern.examKeywords.map((keyword) => `${keyword.en} / ${keyword.ro}`)),
      '',
      '#### Participants',
      '',
      bullet(pattern.participants.map((participant) => `${participant.role}: ${participant.description.en} Example: ${participant.example}`)),
      '',
      '#### Structure',
      '',
      '```text',
      pattern.structureDiagram,
      '```',
      '',
      '#### Common Mistakes',
      '',
      bullet(pattern.commonMistakes.map((mistake) => mistake.en)),
      '',
      '#### When To Use',
      '',
      bullet(pattern.useWhen.map((item) => item.en)),
      '',
      '#### Do Not Use When',
      '',
      bullet(pattern.doNotUseWhen.map((item) => item.en)),
      '',
      '#### Common Exam Phrases',
      '',
      bullet(pattern.examPhrases.map((item) => item.en)),
      '',
      '#### Step-by-Step Solve Example',
      '',
      `Problem: ${pattern.solveExample.problem.en}`,
      '',
      'Keywords to underline:',
      bullet(pattern.solveExample.keywords.map((kw) => kw.en)),
      '',
      'Reasoning:',
      bullet(pattern.solveExample.reasoning.map((step) => step.en)),
      '',
      'Role mapping:',
      bullet(pattern.solveExample.roleMappings.map((rm) => `${rm.role} -> ${rm.mappedTo}: ${rm.explanation.en}`)),
      '',
      'Answer outline:',
      bullet(pattern.solveExample.answerOutline.map((step) => step.en)),
      '',
      '#### Self-Test',
      '',
      ...pattern.selfTest.flatMap((q) => [
        `Question: ${q.question.en}`,
        'Options:',
        bullet(q.options.map((opt, i) => `${i === q.correctIndex ? '[correct] ' : ''}${opt.en}`)),
        `Correct answer: ${q.options[q.correctIndex].en}`,
        `Explanation: ${q.explanation.en}`,
        '',
      ]),
      '#### Walkthrough Summary',
      '',
      bullet(pattern.codeWalkthrough.map((step) => `Step ${step.stepNumber} (${step.roleName}): ${step.title.en} - ${step.description.en}. Highlight lines: ${step.highlightLines.join(', ')}`)),
      '',
      `#### Canonical Java Example: ${pattern.codeFile}`,
      '',
      '```java',
      mdEscape(readPatternCode(pattern)),
      '```',
      '',
    );
  }

  lines.push('## Quiz And Recognition Practice', '');

  for (const question of quizQuestions) {
    const answer = patterns.find((pattern) => pattern.slug === question.correctAnswer)?.name.en ?? question.correctAnswer;
    const distractors = question.distractors
      .map((slug) => patterns.find((pattern) => pattern.slug === slug)?.name.en ?? slug)
      .join(', ');

    lines.push(
      `### ${question.id}`,
      '',
      `- Type: ${question.type}`,
      `- Prompt: ${question.prompt.en}`,
      `- Correct answer: ${answer}`,
      `- Distractors: ${distractors}`,
      `- Explanation: ${question.explanation.en}`,
    );

    if (question.codeSnippet) {
      lines.push('', '```java', question.codeSnippet, '```');
    }

    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}
