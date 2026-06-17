import questionBank from '../../data/questions.json';

const PATTERNS = [
  {
    slug: 'abstract-factory',
    name: 'Abstract Factory',
    aliases: ['Abstract Factory', 'families of objects', 'family of related objects'],
  },
  {
    slug: 'adapter',
    name: 'Adapter',
    aliases: ['Adapter', 'Wrapper'],
  },
  {
    slug: 'bridge',
    name: 'Bridge',
    aliases: ['Bridge', 'separate abstraction from implementation'],
  },
  {
    slug: 'builder',
    name: 'Builder',
    aliases: ['Builder', 'step by step construction', 'fluent builder'],
  },
  {
    slug: 'chain-of-responsibility',
    name: 'Chain of Responsibility',
    aliases: ['Chain of Responsibility', 'Chain', 'handler chain', 'chain of handlers'],
  },
  {
    slug: 'command',
    name: 'Command',
    aliases: ['Command', 'request as an object', 'undoable operation', 'macro command'],
  },
  {
    slug: 'composite',
    name: 'Composite',
    aliases: ['Composite', 'part-whole', 'tree structure'],
  },
  {
    slug: 'decorator',
    name: 'Decorator',
    aliases: ['Decorator', 'Wrapper Decorator', 'add responsibilities dynamically'],
  },
  {
    slug: 'facade',
    name: 'Facade',
    aliases: ['Facade', 'simplified interface'],
  },
  {
    slug: 'factory-method',
    name: 'Factory Method',
    aliases: ['Factory Method', 'virtual constructor'],
  },
  {
    slug: 'flyweight',
    name: 'Flyweight',
    aliases: ['Flyweight', 'shared intrinsic state', 'many small objects'],
  },
  {
    slug: 'interpreter',
    name: 'Interpreter',
    aliases: ['Interpreter', 'grammar', 'expression tree'],
  },
  {
    slug: 'iterator',
    name: 'Iterator',
    aliases: ['Iterator', 'Cursor', 'traverse collection'],
  },
  {
    slug: 'mediator',
    name: 'Mediator',
    aliases: ['Mediator', 'central coordinator'],
  },
  {
    slug: 'memento',
    name: 'Memento',
    aliases: ['Memento', 'snapshot', 'restore state'],
  },
  {
    slug: 'observer',
    name: 'Observer',
    aliases: ['Observer', 'Publish Subscribe', 'Publisher Subscriber', 'event listener'],
  },
  {
    slug: 'prototype',
    name: 'Prototype',
    aliases: ['Prototype', 'clone', 'cloning'],
  },
  {
    slug: 'proxy',
    name: 'Proxy',
    aliases: ['Proxy', 'surrogate', 'access control', 'lazy access'],
  },
  {
    slug: 'singleton',
    name: 'Singleton',
    aliases: ['Singleton', 'single instance', 'global instance'],
  },
  {
    slug: 'state',
    name: 'State',
    aliases: ['State', 'state object', 'changes behavior when state changes'],
  },
  {
    slug: 'strategy',
    name: 'Strategy',
    aliases: ['Strategy', 'Policy', 'interchangeable algorithms'],
  },
  {
    slug: 'template-method',
    name: 'Template Method',
    aliases: ['Template Method', 'Template', 'algorithm skeleton', 'fixed algorithm steps'],
  },
  {
    slug: 'visitor',
    name: 'Visitor',
    aliases: ['Visitor', 'double dispatch'],
  },
  {
    slug: 'simple-factory',
    name: 'Simple Factory',
    aliases: ['Simple Factory'],
  },
];

const TOPICS = [
  {
    tag: 'SRP',
    aliases: ['SRP', 'Single Responsibility Principle', 'single responsibility'],
  },
  {
    tag: 'OCP',
    aliases: ['OCP', 'Open Closed Principle', 'Open/Closed Principle', 'open closed', 'open for extension'],
  },
  {
    tag: 'LSP',
    aliases: ['LSP', 'Liskov Substitution Principle', 'Liskov', 'substitution principle'],
  },
  {
    tag: 'ISP',
    aliases: ['ISP', 'Interface Segregation Principle', 'interface segregation', 'fat interface'],
  },
  {
    tag: 'DIP',
    aliases: ['DIP', 'Dependency Inversion Principle', 'dependency inversion', 'depend on abstractions'],
  },
  {
    tag: 'Coverage',
    aliases: ['Coverage', 'code coverage', 'branch coverage', 'statement coverage', 'test coverage'],
  },
  {
    tag: 'Boundary',
    aliases: ['Boundary', 'boundary value', 'boundary values', 'limit value', 'edge case'],
  },
  {
    tag: 'Cyclomatic Complexity',
    aliases: ['Cyclomatic Complexity', 'McCabe', 'control flow complexity', 'independent paths'],
  },
  {
    tag: 'JUnit',
    aliases: ['JUnit', '@Test', '@Before', '@After', 'assertEquals', 'assertThrows'],
  },
  {
    tag: 'FIRST',
    aliases: ['FIRST', 'Fast Independent Repeatable Self-validating Timely', 'Fast', 'Independent', 'Repeatable', 'Self-validating', 'Timely'],
  },
  {
    tag: 'Cardinality',
    aliases: ['Cardinality', 'multiplicity', 'one-to-many', 'many-to-many', '1..*', '0..1'],
  },
  {
    tag: 'Unit Testing',
    aliases: ['unit test', 'unit tests', 'test case', 'test cases', 'mock', 'stub'],
  },
  {
    tag: 'Equivalence Partitioning',
    aliases: ['Equivalence Partitioning', 'equivalence class', 'equivalence classes', 'partition'],
  },
  {
    tag: 'Regression Testing',
    aliases: ['Regression Testing', 'regression test', 'regression tests'],
  },
];

let cachedQuestions = null;
let cachedPatternTags = null;
let cachedTopicTags = null;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasAlphaNumericBoundaryMatch(text, alias) {
  const escaped = escapeRegex(alias);
  const pattern = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
  return pattern.test(text);
}

function toText(value) {
  if (value == null) {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map(toText).join(' ');
  }

  if (typeof value === 'object') {
    return Object.values(value).map(toText).join(' ');
  }

  return String(value);
}

function getQuestionsSource() {
  const questions = Array.isArray(questionBank) ? questionBank : questionBank.questions;

  if (!Array.isArray(questions)) {
    throw new Error('data/questions.json must be an array or contain a questions array.');
  }

  return questions;
}

function getStrongSearchText(question) {
  return [
    question.questionText,
    question.codeSnippet,
    question.snippetWithDropZones,
    question.matchingEntities,
    question.correctAnswers,
    question.explanation,
  ]
    .map(toText)
    .join(' ');
}

function getWeakSearchText(question) {
  return [
    question.options,
    question.dropZones,
    question.matchingOptions,
  ]
    .map(toText)
    .join(' ');
}

function matchesAnyAlias(text, aliases) {
  return aliases.some((alias) => hasAlphaNumericBoundaryMatch(text, alias));
}

function findPatternTags(question) {
  const strongText = getStrongSearchText(question);
  const weakText = getWeakSearchText(question);
  const matched = new Set();

  for (const pattern of PATTERNS) {
    if (pattern.slug === 'simple-factory') {
      continue;
    }

    if (matchesAnyAlias(strongText, pattern.aliases)) {
      matched.add(pattern.slug);
    }
  }

  const matchedSpecificFactory =
    matched.has('abstract-factory') || matched.has('factory-method');

  if (matchesAnyAlias(strongText, ['Simple Factory'])) {
    matched.add('simple-factory');
  } else if (!matchedSpecificFactory && hasAlphaNumericBoundaryMatch(strongText, 'Factory')) {
    matched.add('simple-factory');
  }

  // Weak fields are usually answer pools. Use them only when no stronger clue exists.
  if (matched.size === 0) {
    for (const pattern of PATTERNS) {
      if (pattern.slug === 'simple-factory') {
        continue;
      }

      if (matchesAnyAlias(weakText, pattern.aliases)) {
        matched.add(pattern.slug);
      }
    }

    if (
      matchesAnyAlias(weakText, ['Simple Factory']) ||
      (
        !matched.has('abstract-factory') &&
        !matched.has('factory-method') &&
        hasAlphaNumericBoundaryMatch(weakText, 'Factory')
      )
    ) {
      matched.add('simple-factory');
    }
  }

  return PATTERNS
    .filter((pattern) => matched.has(pattern.slug))
    .map((pattern) => pattern.slug);
}

function findTopicTags(question) {
  const strongText = getStrongSearchText(question);
  const weakText = getWeakSearchText(question);
  const matched = new Set();

  for (const topic of TOPICS) {
    if (matchesAnyAlias(strongText, topic.aliases)) {
      matched.add(topic.tag);
    }
  }

  if (matched.size === 0) {
    for (const topic of TOPICS) {
      if (matchesAnyAlias(weakText, topic.aliases)) {
        matched.add(topic.tag);
      }
    }
  }

  return TOPICS
    .filter((topic) => matched.has(topic.tag))
    .map((topic) => topic.tag);
}

function computeTaggedQuestions() {
  const taggedQuestions = getQuestionsSource().map((question) => ({
    ...question,
    patterns: findPatternTags(question),
    topics: findTopicTags(question),
  }));

  cachedPatternTags = [...new Set(taggedQuestions.flatMap((question) => question.patterns))];
  cachedTopicTags = [...new Set(taggedQuestions.flatMap((question) => question.topics))];

  return taggedQuestions;
}

export function getTaggedQuestions() {
  if (!cachedQuestions) {
    cachedQuestions = computeTaggedQuestions();
  }

  return cachedQuestions;
}

export function getAllPatternTags() {
  getTaggedQuestions();
  return cachedPatternTags;
}

export function getAllTopicTags() {
  getTaggedQuestions();
  return cachedTopicTags;
}

export function getQuestionsByPattern(slug) {
  return getTaggedQuestions().filter((question) => question.patterns.includes(slug));
}

export function getQuestionsByTopic(tag) {
  return getTaggedQuestions().filter((question) => question.topics.includes(tag));
}
