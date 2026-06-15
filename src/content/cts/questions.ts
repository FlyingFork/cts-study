import type { Question, QuestionBank, TopicTag } from "@/lib/schema";
import extracted from "./extracted-questions.json";

type ExtractedQuestion = {
  id: string;
  type: Question["type"];
  topic: string;
  difficulty: Question["difficulty"];
  prompt: string;
  code?: string;
  codeLang?: string;
  options?: string[] | null;
  matchPairs?: { left: string; right: string }[] | null;
  answer: string | string[];
  answerConfidence: Question["answerConfidence"];
  explanation?: string;
  source?: string;
};

const TOPICS = [
  "clean-code",
  "solid",
  "design-patterns",
  "junit-4",
  "test-design",
  "coverage",
] as const satisfies readonly TopicTag[];

function inferTopic(question: ExtractedQuestion): TopicTag {
  if ((TOPICS as readonly string[]).includes(question.topic)) return question.topic;
  const text = `${question.prompt} ${Array.isArray(question.answer) ? question.answer.join(" ") : question.answer}`.toLowerCase();
  if (text.includes("junit") || text.includes("@before") || text.includes("@test")) return "junit-4";
  if (text.includes("coverage") || text.includes("minimum number of tests")) return "coverage";
  if (
    text.includes("test") ||
    text.includes("right-bicep") ||
    text.includes("correct") ||
    text.includes("range") ||
    text.includes("cardinality")
  ) {
    return "test-design";
  }
  if (
    text.includes("solid") ||
    text.includes("single responsibility") ||
    text.includes("open-closed") ||
    text.includes("liskov") ||
    text.includes("interface segregation") ||
    text.includes("dependency inversion")
  ) {
    return "solid";
  }
  if (text.includes("clean code") || text.includes("kiss") || text.includes("camelcase")) return "clean-code";
  return "design-patterns";
}

function normalizeAnswer(question: ExtractedQuestion): string | string[] {
  if (question.type === "mcq" && Array.isArray(question.answer) && question.answer.length === 1) {
    return question.answer[0];
  }
  return question.answer;
}

const extractedQuestions = (extracted.questions as ExtractedQuestion[]).map(
  (question): Question => ({
    id: question.id,
    type: question.type,
    topic: inferTopic(question),
    difficulty: question.difficulty,
    prompt:
      question.answerConfidence === "unknown"
        ? `${question.prompt}\n\n_Unverified source item: use this for recognition practice only; it is excluded from scored exams._`
        : question.prompt,
    code: question.code,
    codeLang: question.codeLang,
    options: question.options ?? undefined,
    matchPairs: question.matchPairs ?? undefined,
    answer: normalizeAnswer(question),
    answerConfidence: question.answerConfidence,
    explanation: question.explanation,
    source: question.source,
  }),
);

export const ctsGeneratedQuestions: Question[] = [
  {
    id: "cts-q-generated-adapter-vs-facade",
    type: "mcq",
    topic: "design-patterns",
    difficulty: "medium",
    prompt:
      "A payment SDK exposes `chargeCard(token, cents)`, but your checkout expects a `PaymentGateway.pay(amountRon)` interface. Which pattern is the best fit?",
    options: ["Facade", "Adapter", "Decorator", "Proxy", "State"],
    answer: "Adapter",
    answerConfidence: "confirmed",
    explanation:
      "The intent is interface conversion: existing functionality is useful, but its interface is incompatible with the client. A Facade would hide a complex subsystem behind a simpler entry point.",
    source: "Generated from CTS course-guide.md",
  },
  {
    id: "cts-q-generated-facade-vs-adapter",
    type: "mcq",
    topic: "design-patterns",
    difficulty: "medium",
    prompt:
      "A video editor has many compression, audio, subtitle, and file-system classes. The UI should call one `exportMovie()` service without knowing those classes. Which pattern is the best fit?",
    options: ["Adapter", "Facade", "Builder", "Flyweight", "Memento"],
    answer: "Facade",
    answerConfidence: "confirmed",
    explanation:
      "The intent is simplification of a complex subsystem. Adapter changes an interface; Facade hides complexity behind a single easier interface.",
    source: "Generated from CTS course-guide.md",
  },
  {
    id: "cts-q-generated-decorator-vs-proxy",
    type: "mcq",
    topic: "design-patterns",
    difficulty: "medium",
    prompt:
      "A reporting object can be wrapped at runtime with optional CSV export, watermarking, and compression while keeping the same reporting interface. Which pattern is the best fit?",
    options: ["Proxy", "Decorator", "Composite", "Command", "Strategy"],
    answer: "Decorator",
    answerConfidence: "confirmed",
    explanation:
      "Decorator adds responsibilities dynamically while preserving the interface. Proxy would control access, lazily load, cache, protect, or monitor calls to another object.",
    source: "Generated from CTS course-guide.md",
  },
  {
    id: "cts-q-generated-proxy-vs-decorator",
    type: "mcq",
    topic: "design-patterns",
    difficulty: "medium",
    prompt:
      "A document service should check permissions and load the real document only when it is first opened. Which pattern is the best fit?",
    options: ["Decorator", "Proxy", "Adapter", "Template Method", "Observer"],
    answer: "Proxy",
    answerConfidence: "confirmed",
    explanation:
      "Proxy controls access to another object and can also implement lazy loading. Decorator's intent is adding behavior, not guarding access.",
    source: "Generated from CTS course-guide.md",
  },
  {
    id: "cts-q-generated-strategy-vs-state",
    type: "mcq",
    topic: "design-patterns",
    difficulty: "medium",
    prompt:
      "A map app lets the user switch the route algorithm between fastest, cheapest, and least-walking. Which pattern captures the intent?",
    options: ["State", "Strategy", "Command", "Template Method", "Memento"],
    answer: "Strategy",
    answerConfidence: "confirmed",
    explanation:
      "Strategy is an algorithm selected by the client at runtime. State is driven by an object's lifecycle and internal state transitions.",
    source: "Generated from CTS course-guide.md",
  },
  {
    id: "cts-q-generated-state-vs-strategy",
    type: "mcq",
    topic: "design-patterns",
    difficulty: "medium",
    prompt:
      "An order object behaves differently when it is Draft, Paid, Shipped, or Cancelled, and transitions decide which actions are legal. Which pattern captures the intent?",
    options: ["Strategy", "State", "Observer", "Factory", "Flyweight"],
    answer: "State",
    answerConfidence: "confirmed",
    explanation:
      "State changes behavior as internal state changes. Strategy is chosen externally by the client as an interchangeable algorithm.",
    source: "Generated from CTS course-guide.md",
  },
  {
    id: "cts-q-generated-solid-ocp",
    type: "mcq",
    topic: "solid",
    difficulty: "medium",
    prompt:
      "A discount calculator is changed from a long `if` chain over customer types into polymorphic discount policies so new policies can be added without editing stable code. Which SOLID principle is targeted?",
    options: ["SRP", "OCP", "LSP", "ISP", "DIP"],
    answer: "OCP",
    answerConfidence: "confirmed",
    explanation:
      "Open/Closed Principle: extend behavior through new implementations while keeping stable existing code closed for modification.",
    source: "Generated from CTS course-guide.md",
  },
  {
    id: "cts-q-generated-junit-beforeclass",
    type: "mcq",
    topic: "junit-4",
    difficulty: "easy",
    prompt:
      "In JUnit 4, which annotation runs once before all tests in the class and therefore requires a static method?",
    options: ["@Before", "@BeforeClass", "@After", "@Test", "@RunOnce"],
    answer: "@BeforeClass",
    answerConfidence: "confirmed",
    explanation:
      "`@BeforeClass` runs once before the class's tests. `@Before` runs before each individual test method.",
    source: "Generated from CTS course-guide.md",
  },
  {
    id: "cts-q-generated-right-bicep-boundary",
    type: "mcq",
    topic: "test-design",
    difficulty: "easy",
    prompt:
      "For a setter accepting values from 5 through 100 inclusive, testing 5, 6, 100, and 101 mainly exercises which RIGHT-BICEP/CORRECT idea?",
    options: ["Performance", "Boundary / Range", "Inverse relationship", "Cross-check", "Reference"],
    answer: "Boundary / Range",
    answerConfidence: "confirmed",
    explanation:
      "The chosen values sit on or immediately next to the allowed limits, so the testing intent is boundary/range coverage.",
    source: "Generated from CTS course-guide.md",
  },
  {
    id: "cts-q-generated-correct-cardinality",
    type: "mcq",
    topic: "test-design",
    difficulty: "medium",
    prompt:
      "A method computes the average grade of a list. Which set best matches the CORRECT Cardinality heuristic?",
    options: [
      "Only a list with many grades",
      "Only invalid negative grades",
      "Empty list, one grade, several grades, and maximum-size list if there is a limit",
      "Two equivalent sorting algorithms",
      "A database outage and a timeout",
    ],
    answer: "Empty list, one grade, several grades, and maximum-size list if there is a limit",
    answerConfidence: "confirmed",
    explanation:
      "Cardinality targets collection sizes: zero, one, many, and maximum when the system defines one.",
    source: "Generated from CTS course-guide.md",
  },
  {
    id: "cts-q-generated-coverage-branches",
    type: "mcq",
    topic: "coverage",
    difficulty: "hard",
    prompt:
      "A method has two independent `if` statements. To reach 100% branch coverage, what must your tests collectively execute?",
    options: [
      "Only one path through the method",
      "Every statement once, regardless of decision outcomes",
      "True and false outcomes for both decisions",
      "Every possible input value",
      "Only the exceptional path",
    ],
    answer: "True and false outcomes for both decisions",
    answerConfidence: "confirmed",
    explanation:
      "Branch coverage requires each decision outcome. Independent decisions can often be combined across a small set of tests, but both true and false branches must be exercised.",
    source: "Generated from CTS course-guide.md",
  },
];

export const ctsBank: QuestionBank = {
  id: "cts-bank",
  courseId: "cts",
  questions: [...extractedQuestions, ...ctsGeneratedQuestions],
};

export const ctsExamQuestionIds = [
  ...extractedQuestions
    .filter(
      (question) =>
        (question.answerConfidence === "confirmed" || question.answerConfidence === "likely") &&
        (question.type === "mcq" || question.type === "multi"),
    )
    .map((question) => question.id),
  ...ctsGeneratedQuestions.map((question) => question.id),
].slice(0, 50);
