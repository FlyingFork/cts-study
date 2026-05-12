# CTS Quiz Platform — Build Prompt

## Project Overview

Build a **CTS (Calitate și Testare Software / Software Quality & Testing) Quiz Platform** as a feature of an existing Next.js website. The platform simulates the faculty exam experience for a course that covers:

- **Design Patterns in Java** (GoF patterns)
- **SOLID Principles & Clean Code**
- **JUnit 4 testing** (annotations, execution model, test types)
- **Testing strategies** (Right-BICEP, CORRECT, code coverage, cardinality)

The site already has support/theory pages for these patterns: `adapter`, `decorator`, `composite`, `flyweight`, `facade`, `proxy`, `strategy`, `chain-of-responsibility`, `command`, `observer`. Link to them from explanations wherever relevant.

All state is persisted in **localStorage** (no backend required).

---

## Tech Stack

- **Next.js** (App Router, TypeScript)
- **localStorage** for all persistence
- **Tailwind CSS** for styling
- No external UI libraries unless already in the project

---

## Routes to Create

```
/quiz                         → Dashboard / home
/quiz/exam                    → Timed exam mode (simulates faculty test)
/quiz/practice                → Practice mode (no timer, with hints)
/quiz/results/[sessionId]     → Detailed results page after a session
/quiz/stats                   → Overall progress & weak areas
```

---

## Core Data Model

### Question Types

You must support **all five question types** found in the actual exam. Define them in `types/quiz.ts`:

```typescript
type QuestionType =
  | "single" // Radio buttons — one correct answer
  | "multiple" // Checkboxes — one or more correct answers
  | "matching" // Dropdown per row — match left items to right options
  | "ordering" // Drag-and-drop to put items in correct sequence
  | "code"; // Single or multiple choice with a Java code snippet

interface BaseQuestion {
  id: string;
  type: QuestionType;
  topic: Topic;
  difficulty: "easy" | "medium"; // for adaptive filtering
  explanation: string; // shown after answering in practice mode
  relatedPatternSlug?: string; // links to existing theory page, e.g. 'singleton'
}

interface SingleQuestion extends BaseQuestion {
  type: "single";
  text: string;
  options: { id: string; text: string }[];
  correctId: string;
}

interface MultipleQuestion extends BaseQuestion {
  type: "multiple";
  text: string;
  options: { id: string; text: string }[];
  correctIds: string[];
}

interface MatchingQuestion extends BaseQuestion {
  type: "matching";
  text: string;
  pairs: { left: string; right: string }[]; // correct pairings
  rightOptions: string[]; // shuffled pool shown in dropdowns
}

interface OrderingQuestion extends BaseQuestion {
  type: "ordering";
  text: string;
  items: { id: string; text: string }[]; // stored in correct order
}

interface CodeQuestion extends BaseQuestion {
  type: "code";
  text: string;
  codeSnippet: string; // Java code, displayed with monospace/syntax highlight
  language: "java";
  options: { id: string; text: string }[];
  correctIds: string[]; // one or more
}

type Question =
  | SingleQuestion
  | MultipleQuestion
  | MatchingQuestion
  | OrderingQuestion
  | CodeQuestion;

type Topic =
  | "design-patterns"
  | "solid"
  | "clean-code"
  | "junit4"
  | "testing-strategies";
```

### Session & Progress

```typescript
interface QuizSession {
  id: string;
  mode: "exam" | "practice";
  startedAt: number;
  finishedAt?: number;
  questionIds: string[];
  answers: Record<string, UserAnswer>;
  score?: number; // points earned out of total
  totalPoints?: number;
}

interface UserAnswer {
  questionId: string;
  value: string | string[] | Record<string, string>; // depends on type
  isCorrect: boolean;
  pointsEarned: number; // partial credit for matching/multiple
  timeSpentMs: number;
}

interface ProgressStore {
  sessions: QuizSession[];
  // derived stats (compute on demand, don't store)
}
```

---

## localStorage Keys

```
cts_quiz_sessions      → QuizSession[]
cts_quiz_settings      → { examDurationMinutes: number, examQuestionCount: number, topicFilters: Topic[] }
```

---

## Question Bank (`data/questions.ts`)

Populate with **at minimum 60 questions** drawn directly from the exam screenshots. Cover every topic and question type. Below are the exact questions observed in the exams — implement all of them plus additional variants.

### Design Patterns (≥ 25 questions)

Include questions on each of the following patterns. For every pattern, include at least:

- One scenario/story question ("you are building X, which pattern fits?")
- One "what is this code implementing?" question with a Java snippet
- One "identify the issue in this implementation" question

**Patterns to cover:**

**Singleton**

- When is it used? (answer: a single instance of a class is needed)
- Identify Singleton variants from code: lazy init, eager init, static block, thread-safe synchronized, Singleton Registry (collection of named singletons)
- Identify bugs in a flawed Singleton Registry (constructor is private but should be public for Registry; `getInstanta()` adds when key EXISTS instead of when it does NOT exist; returns the map instead of a single instance)
- Which code snippet correctly implements Singleton? (provide 3 variants — one with `return new Server()` bug, one with public constructor bug, one correct)

**Adapter**

- True/false statements: can be implemented via composition (HAS-A) or inheritance (IS-A) ✓; uses a wrapper to convert old interface to new one ✓; "allows extending a class to add new functionality" ✗ (that is Decorator); "allows objects to change behavior at runtime" ✗ (that is State/Strategy)
- Which design patterns are considered "Wrappers"? (Facade ✓, Adapter ✓, Proxy ✓ — note: Proxy also wraps)

**Decorator**

- Restaurant scenario: each base dish can have an optional topping added (Spanish/Italian); price unchanged for base; customers can also order without toppings → **Decorator**
- `History` class with `Stack<String> messages`, `saveLastMessage(push)`, `getLastMessage(pop)` → **Memento**

**Composite**

- Tree-like application menu with options and groups of options, flexible scaling, access roles → **Composite**
- Fill in the blanks: `public class Composite implements [Component] { [List] <Component> components = new [ArrayList]<Component>(); public void add(Component [component]) ... }`

**Flyweight**

- Interface with many repeated icons/pictograms; minimize memory → **Flyweight**

**Proxy**

- Car wash: fixed steps (template) + only starts if tanks are full (proxy guard) → **Template Method + Proxy**
- When is Proxy recommended? → to restrict/control the call of an existing functionality
- Web page slow loading: filter pipeline with swappable/reorderable steps → **Chain of Responsibility** (NOT State — the selected answer in one exam was wrong; correct is CoR)

**Strategy**

- E-commerce: user selects viewing layout (ascending price, descending price, with reviews) → **Strategy**
- Differences between State and Strategy: for Strategy, the **client** changes/selects the action; for State, the **object itself** changes the action; both outsource implementations; both are behavioral

**Chain of Responsibility**

- Driver's license renewal: goes through dedicated counter → duty officer → printer → pick-up counter; stages opaque to applicant → **Chain of Responsibility + Facade** (Facade hides internal complexity; CoR routes through handlers)
- Smart camera: notify all house owners (Observer); capture mode selectable by user (Strategy); storage fallback internal→SD→cloud (Chain of Responsibility)

**Command**

- `transmiteComenzile()` iterates `listaComenzi` of `IComanda` and calls `c.prelucreaza()` → **Command**
- MVC: decouple View from Controller for button actions and data loading → **Command + Observer**

**Observer**

- Door camera notifies all owners → **Observer**
- Drone software: all logs in one file, no extra files allowed → **Singleton**; different drone modes without source changes → **Strategy/Factory**

**Factory / Builder**

- Constructor with many typed parameters (CarType, int noOfSeats, Engine, Transmission, String navigationProducer) → **Builder** (telescoping constructor problem)
- Note: one exam snapshot showed "Abstract Factory" as the student's wrong answer; the correct answer is **Builder**

**Other patterns to include:**

- Memento (History class with Stack)
- Template Method (car wash fixed steps)
- State vs Strategy distinction
- Facade (simplify calling existing functionality; also a wrapper)

---

### SOLID Principles (≥ 10 questions)

- **SRP**: `Customer` class with `saveToDatabase()` + `sendEmail()` → violates SRP (two responsibilities). `Angajat` abstract class with `calculeazaSalariu`, `getAngajatiFromFile`, `saveAngajatiInBD`, `avansareInFunctie` → violates SRP
- **OCP**: "classes should be open for extension, closed for modification" — which principle? → OCP. Also: select SOLID principles that emphasize cohesion and focus on specific tasks (SRP + ISP, NOT OCP)
- **LSP**: Zoo uses `List<Monkey>` → transform to `List<Animal>` to use substitution → LSP
- **ISP**: `Reporter` class split into `ReporterEditor` (edit) + `ReporterPrinter` (print) → ISP. Calculator hierarchy with ScientificCalculator and BusinessCalculator → ISP (each subtype only gets what it needs)
- **DIP**: classes must depend on abstractions, not concrete implementations → DIP

---

### Clean Code (≥ 8 questions)

- Naming conventions matching: `expected_result` → snake_case; `ObtainedTemperature` → UpperCamelCase; `saveBtn` → lowerCamelCase; `numberOfBigNumbers` → lowerCamelCase
- Clean code rules for code review (select all that apply): functions do one thing ✓; functions should be small ✓; use names that reveal intent ✓; use domain-related names ✓; functions throw exceptions (not return error codes) ✓; functions must NOT return null ✓; classes contain accessor methods ✓
- "Classes must depend on abstractions, not concrete implementations" → DIP (this bridges Clean Code and SOLID)
- 70/20/0 rule: 70 = percent code coverage; 20 = percentage of total development time spent on testing; 0 = number of failed unit tests

---

### JUnit 4 (≥ 10 questions)

- Annotation matching: `@Before` = Creating a setup (runs before EACH test); `@BeforeClass` = runs once before all tests; `@After` = runs after each test; `@AfterClass` = runs after all; `@Test` = creating a test; `@SuiteClasses` = adding TestCases in a suite; `@IncludeCategory` = adding certain categories in a custom suite; `@ExcludeCategory` = removing certain categories
- DB connection for several tests: use `@BeforeClass` (once, optimal) NOT `@DBConnect` (doesn't exist) NOT `@Before` (runs per test, inefficient)
- Annotation before each test → `@Before` (NOT `@BeforeTest`, not `@BeforeEach` which is JUnit 5)
- How many tests does a JUnit4 Runner run from: `@Test test1`, no-annotation `test2`, `@Test(expected=Exception.class) test3` → **2** (only annotated methods run; test2 has no @Test annotation)
- Output of `@BeforeClass setUpBeforeClass`, `@Test test1`, `@Test test2`, `@After tearDown` → `Before Test1 After Test2 After` (BeforeClass once, After runs after EACH test; note: the test showed `@BeforeClass` runs once so output is "Before Test1 After Test2 After")

  Wait — re-reading: `@BeforeClass` runs once. `@After` runs after each `@Test`. So: BeforeClass prints "Before "; test1 prints "Test1 "; tearDown after test1 prints "After "; test2 prints "Test2 "; tearDown after test2 prints "After ". Result: `Before Test1 After Test2 After` ✓

- Unit test success count: `test1` calls `fail()` → FAIL; `test2` is empty `{}` → PASS; `test3` uses `assertSame(o1, o1)` where `o2 = o1` → PASS → **2 pass**
- Which test fails from `getFrecventaValoareMax(int[] v)` code: empty array `{}` with `assertEquals(0, ...)` → fails because `v[0]` throws ArrayIndexOutOfBounds; `{9,10,10,10,15,15}` expects 2 but max is 15 appearing twice AND the logic uses `>=` so it also counts 9 initially... trace carefully and provide the correct answer with explanation
- Singleton category from code (static block with try/catch to create instance eagerly) → **Static Block Singleton** (NOT Lazy, which checks null on demand)

---

### Testing Strategies (≥ 10 questions)

**Right-BICEP association:**

- I (Inverse Relationship): using `sqrt` of degree 2 to test a squaring function
- B (Boundary): values of -1, 0 and 1 for a person's age
- C (Cross-check): using quicksort to test a bubble sort algorithm
- P (Performance): using timeout from JUnit4
- E (Error): using `expected` from JUnit4

**CORRECT — Cardinality:**

- `boolean method(List<Integer> listGrade)` returns true if ≥ 2 passing grades → minimum Cardinality tests: 0 elements, 1 element, 2 elements (boundary), many elements → **5** tests in total (0, 1, exactly 2 — boundary, more than 2, null/edge). Actually the exam answer shown was **5**. Cardinality from CORRECT means: 0, 1, 2, many (n), and the critical threshold (2 in this case). So: 0 items, 1 item, exactly 2 items, 3+ items, null = 5 categories. Keep answer as 5.

**Boundary testing:**

- `method(int a, int b)` where b ∈ (10, 30]: boundary values are **10** (just outside lower, excluded), **11** (just inside), **30** (at upper bound, included), **31** (just outside upper) → from the exam: answers 10 and 30 are boundary ✓; 11 is interior; Integer.MAX_VALUE is beyond-range not boundary

**Code coverage:**

- `ceaMaiMicaSolutie(float a, float b, float c)` has branches: `a!=0` → `delta>=0` → return value OR throw; `a==0` → throw. Minimum tests for 100% coverage: need to cover all branches. `a!=0, delta>=0` (1 path), `a!=0, delta<0` (1 path), `a==0` (1 path) = **3 tests**... but the exam showed answer **2**. Re-examine: the exam PDF showed answer d=2. Look at the code more carefully — if `a!=0` AND `delta>=0`, returns the value. If `a!=0` AND `delta<0`, throws. If `a==0`, throws. That's 3 branches minimum. But perhaps code coverage (line coverage not branch) can be 100% with 2? Or perhaps the question is about statement coverage. Include the question with explanation of both interpretations.

**Cross-check (Right-BICEP):**

- Test that uses `Math.sqrt(power(3, 2))` and asserts result equals 3 → **Inverse Relationship** (inverse of squaring is square root), NOT Cross-check

**Cardinality perspective for average:**

- Testing average of a collection: Cardinality perspective (from CORRECT) allows: single element {10} ✓, large collection {1..100} ✓, two-element {10,20} ✓; NOT empty (that is Existence) and NOT null (also Existence)

**Cross-Check definition:**

- Cross-Check allows different algorithms to calculate the same result ✓ (e.g., quicksort vs bubblesort)
- Cross-Check involves checking results using other independent methods ✓
- NOT "validates with predefined values" (that is Right), NOT "ensures all branches covered" (that is code coverage)

---

## Scoring System

Match the faculty's system exactly:

- **Single-select**: 1 point if correct, 0 if wrong
- **Multiple-select**: partial credit — for n correct answers and m wrong selected:
  - Points = max(0, (correct_selected / total_correct) − (wrong_selected / total_wrong_options))
  - Round to 2 decimals, shown as e.g. `0.50 din 1.00`
- **Matching**: (number of correct pairs / total pairs) × 1 point
- **Ordering**: 1 point if fully correct, 0 otherwise
- **Code (single)**: 1 point; **code (multiple)**: partial as above

Display on each question card: `Marcat X.XX din 1.00`

---

## UI Specifications

### Quiz Dashboard (`/quiz`)

```
[Start Exam]          [Practice Mode]
  50 questions          Unlimited time
  60 min timer          Hints enabled
  No explanations       Explanations shown

[Topic Filter]   [Stats]   [Question Bank Preview]
```

- Show count of questions available per topic with progress bars (% answered correctly at least once)
- Show last 3 session results with score and date

### Exam Mode (`/quiz/exam`)

Mirrors the faculty platform (`online.ase.ro`) as closely as possible:

- **Top bar**: Question counter (e.g., "Întrebare 12 din 50"), live timer counting down
- **Question header card**: shows `Complet` / `Incomplete` badge + `Marcat X.XX din 1.00` (hidden until after submission) + flag button
- **Navigation grid** at the bottom: numbered buttons 1–50, color-coded:
  - Grey = not visited
  - Blue/filled = answered
  - Orange = flagged
  - Current = highlighted border
- **No explanations** shown during exam
- On timer expiry → auto-submit
- After submission → redirect to `/quiz/results/[sessionId]`

### Practice Mode (`/quiz/practice`)

- Same layout as exam mode BUT:
  - No timer
  - After submitting each answer, show:
    - ✅ / ❌ per option
    - Explanation paragraph
    - "Learn more →" link to the theory page (if `relatedPatternSlug` is set)
  - "Skip" button instead of forced progression

### Question Renderers

Build a separate React component for each type:

**`SingleQuestion.tsx`** — radio buttons, styled like the ASE platform (circle border, checkmark on select)

**`MultipleQuestion.tsx`** — checkboxes with the same styling

**`MatchingQuestion.tsx`** — table with left-side labels and right-side `<select>` dropdowns; shuffle the right-side options on mount

**`OrderingQuestion.tsx`** — draggable list (use native HTML5 drag-and-drop or a simple swap-on-click approach; no library dependency required)

**`CodeQuestion.tsx`** — renders the code snippet in a styled `<pre>` block with monospace font and light syntax coloring (just color keywords manually with CSS classes — no Prism/highlight.js required); question text above, options below (single or multiple)

### Results Page (`/quiz/results/[sessionId]`)

Sections:

1. **Score summary**: large score display, pass/fail (≥ 50% = pass, matching faculty), time taken, completion date
2. **Topic breakdown**: score per topic as a mini bar chart (pure CSS, no chart library)
3. **Question review**: for each question:
   - Your answer vs correct answer (color-coded)
   - Points earned
   - Explanation (always shown on results page)
   - Link to theory page if applicable
4. **Action buttons**: "Retry same questions", "New exam", "Go to practice for weak topics"

### Stats Page (`/quiz/stats`)

- Total sessions, average score, best score
- Per-topic accuracy (questions answered correctly / total attempted)
- "Weak areas" list: topics below 60% accuracy, with a "Practice this topic" button
- Session history table: date, mode, score, duration

---

## Explanation Content

Every question must have an `explanation` string. For pattern questions, the explanation should:

1. Name the pattern and its category (creational / structural / behavioral)
2. In 2–3 sentences explain WHY this answer is correct
3. Mention what distinguishes it from the most common wrong answer (the distractor)

Example for the car wash question:

> **Template Method** defines the skeleton of an algorithm (the fixed washing steps) in a base class, allowing subclasses to override specific steps without changing the structure. **Proxy** acts as a guard that controls access to the real object — here it checks preconditions (tank levels) before allowing the wash to proceed. The distractor Builder is wrong because Builder is for constructing complex objects step by step, not for guarding or templating a process.

---

## File Structure

```
app/
  quiz/
    page.tsx                    ← Dashboard
    exam/
      page.tsx                  ← Exam mode wrapper
    practice/
      page.tsx                  ← Practice mode wrapper
    results/
      [sessionId]/
        page.tsx                ← Results
    stats/
      page.tsx                  ← Stats

components/
  quiz/
    QuizShell.tsx               ← Shared layout (nav grid, timer, header)
    QuestionCard.tsx            ← Routes to correct renderer
    questions/
      SingleQuestion.tsx
      MultipleQuestion.tsx
      MatchingQuestion.tsx
      OrderingQuestion.tsx
      CodeQuestion.tsx
    results/
      ScoreSummary.tsx
      TopicBreakdown.tsx
      QuestionReview.tsx
    Timer.tsx
    NavigationGrid.tsx
    FlagButton.tsx

data/
  questions.ts                  ← All 60+ questions

hooks/
  useQuizSession.ts             ← Start, answer, submit, load session
  useQuizStats.ts               ← Aggregate stats from localStorage
  useTimer.ts                   ← Countdown timer with pause

lib/
  quiz/
    storage.ts                  ← Read/write localStorage helpers
    scoring.ts                  ← Score computation per question type
    sessionBuilder.ts           ← Build a session (sample questions, shuffle)

types/
  quiz.ts                       ← All TypeScript types defined above
```

---

## Important Implementation Notes

1. **Shuffle on mount**: Randomize option order for every question on each new session (except matching right-column, which is always shuffled). Store the shuffled order in session state, not in the question bank.

2. **Partial credit for multiple-select**: Must match the ASE platform formula. A question with 3 correct options out of 7 total, where the student selects 2 correct + 1 wrong, should not give full marks.

3. **No external state libraries**: Use React `useState`/`useReducer` + Context if needed, plus the localStorage hooks. Do not install Redux or Zustand.

4. **Code display**: Use a `<pre className="font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">` block. Manually highlight Java keywords (`public`, `private`, `static`, `class`, `void`, `return`, `new`, `if`, `for`, `this`) by wrapping them in `<span className="text-purple-400">` during render — parse the snippet with a simple regex replace.

5. **Accessibility**: All interactive question components must be keyboard-navigable. Radio/checkbox inputs should have proper `<label>` associations.

6. **Mobile-first**: The ASE platform is used on mobile (320–768px). The navigation grid should collapse to a scrollable row on small screens. All tap targets must be ≥ 44px tall.

7. **Linking to theory pages**: The existing theory pages live at `/patterns/[slug]` (e.g., `/patterns/singleton`). When `relatedPatternSlug` is set on a question, show a "📖 Review: Singleton" link that opens in a new tab.

---

## What NOT to do

- Do not create a backend or API routes — everything is client-side with localStorage
- Do not install chart libraries (Recharts, Chart.js, etc.) — use CSS bars
- Do not install drag-and-drop libraries — implement ordering with simple click-to-select-then-click-to-place
- Do not hallucinate JUnit or Java behavior — use only the verified answers from the question bank above
- Do not skip the `explanation` field on any question
