import type { Module } from "@/lib/schema";

export const ctsModules: Module[] = [
  {
    id: "cts-mod-clean-code",
    title: "Clean Code",
    order: 1,
    lessons: [
      {
        id: "cts-les-clean-code-core",
        title: "Clean code recognition",
        summary:
          "The maintainability clues behind SRP, DRY, KISS, YAGNI, naming, coupling, and cohesion.",
        estMinutes: 25,
        topicTags: ["clean-code", "solid"],
        priority: 2,
        blocks: [
          {
            kind: "markdown",
            md: "CTS clean-code questions usually show a class, method, or naming choice and ask what maintainability rule is being respected or violated. Read the intent before matching labels: what would make this code hard to change, test, or understand?",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Core recognition clues",
            md: "**Single Responsibility:** one class or method has one reason to change.\n\n**DRY:** repeated knowledge or duplicated logic is a smell.\n\n**KISS:** prefer the simplest clear implementation.\n\n**YAGNI:** do not add future functionality before it is needed.\n\n**Meaningful names:** names reveal intent and fit the domain.\n\n**Low coupling, high cohesion:** keep related behavior together and reduce needless dependencies.",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Clean Code vs SOLID",
            md: "Clean Code is the broader maintainability lens. SOLID is a focused set of object-oriented design principles. In source questions, SRP and DIP can appear under either wording, so answer from the clue, not from the label used in the stem.",
          },
          {
            kind: "tryIt",
            prompt:
              "A method validates input, formats invoices, saves files, and sends e-mail notifications. What is the likely violation?",
            answerMd:
              "SRP. The method has several reasons to change: validation rules, formatting, persistence, and notification behavior.",
          },
        ],
      },
    ],
  },
  {
    id: "cts-mod-solid",
    title: "SOLID",
    order: 2,
    lessons: [
      {
        id: "cts-les-solid-intent",
        title: "SOLID by intent",
        summary:
          "A recognition-first pass through SRP, OCP, LSP, ISP, and DIP, with the common exam wording for each.",
        estMinutes: 30,
        topicTags: ["solid", "clean-code"],
        priority: 1,
        blocks: [
          {
            kind: "markdown",
            md: "For SOLID, start with the design pressure in the stem: too many responsibilities, repeated edits, broken substitution, oversized interfaces, or concrete dependencies.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "SRP",
            md: "Intent: keep one responsibility in one class or method. Recognition clue: a class mixes unrelated jobs such as domain logic, persistence, UI, validation, and reporting.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "OCP",
            md: "Intent: add behavior by extension without modifying stable code. Recognition clue: a long `if` or `switch` over types is replaced by polymorphism, Strategy, Template Method, or Factory-style creation.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "LSP, ISP, DIP",
            md: "**LSP:** subclasses remain usable wherever the base type is expected.\n\n**ISP:** clients do not depend on methods they do not use; split large interfaces.\n\n**DIP:** high-level modules depend on abstractions, not concrete low-level classes.",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Distinction: OCP vs DIP",
            md: "OCP is about how new behavior is added. DIP is about dependency direction. A solution can use both, but the answer depends on the stem's wording.",
          },
        ],
      },
    ],
  },
  {
    id: "cts-mod-patterns",
    title: "Design Patterns",
    order: 3,
    lessons: [
      {
        id: "cts-les-pattern-intents",
        title: "Pattern intent map",
        summary:
          "The high-yield pattern catalog taught from intent first, then structure and exam clues.",
        estMinutes: 55,
        topicTags: ["design-patterns"],
        priority: 1,
        blocks: [
          {
            kind: "markdown",
            md: "Pattern questions are usually scenario recognition. Ignore class names first. Ask: is the problem about creation, structure, access, notification, algorithm choice, lifecycle state, or request objects?",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Creational intent",
            md: "**Singleton:** exactly one shared instance; private constructor, static instance, static accessor.\n\n**Factory / Factory Method:** create objects without coupling clients to concrete classes.\n\n**Abstract Factory:** create related families of objects.\n\n**Builder:** construct complex objects step by step, especially many optional fields.\n\n**Prototype:** clone an existing object when creation is expensive.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Structural intent",
            md: "**Adapter:** make an incompatible existing interface usable.\n\n**Decorator:** add behavior dynamically while keeping the same interface.\n\n**Proxy:** control access, protect, lazy-load, cache, monitor, or delay calls.\n\n**Facade:** one simple interface over a complex subsystem.\n\n**Composite:** uniform treatment of leaves and groups in a tree.\n\n**Flyweight:** share intrinsic state to reduce memory for many similar objects.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Behavioral intent",
            md: "**Strategy:** client chooses an interchangeable algorithm at runtime.\n\n**State:** object behavior changes with internal state transitions.\n\n**Command:** request/action becomes an object for queues, undo, logging, callbacks, or delayed execution.\n\n**Observer:** subject notifies subscribers/listeners.\n\n**Template Method:** fixed algorithm skeleton, subclass-specific steps.\n\n**Memento:** save and restore snapshots.",
          },
        ],
      },
      {
        id: "cts-les-pattern-distinctions",
        title: "Distinction pairs",
        summary:
          "The pattern pairs that cost the most marks: Adapter/Facade, Decorator/Proxy, Strategy/State, Factory/Singleton, Composite/Decorator, and Command/Strategy.",
        estMinutes: 45,
        topicTags: ["design-patterns"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "tip",
            title: "Adapter vs Facade",
            md: "**Adapter** changes an interface so an existing thing fits a client. **Facade** simplifies a complex subsystem behind one entry point.",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Decorator vs Proxy",
            md: "**Decorator** adds behavior to an object. **Proxy** controls access to another object, often with authorization, lazy loading, caching, or monitoring.",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Strategy vs State",
            md: "**Strategy** is selected by the client as an interchangeable algorithm. **State** changes because the object moves through lifecycle states.",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Factory vs Singleton",
            md: "**Factory** is about creating objects without exposing concrete classes. **Singleton** is about allowing exactly one instance.",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Composite vs Decorator",
            md: "**Composite** models part-whole trees. **Decorator** wraps one object to add behavior without changing the class.",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Command vs Strategy",
            md: "**Command** represents an action/request as an object. **Strategy** represents a replaceable algorithm.",
          },
        ],
      },
    ],
  },
  {
    id: "cts-mod-junit",
    title: "JUnit 4",
    order: 4,
    lessons: [
      {
        id: "cts-les-junit-4",
        title: "JUnit 4 annotations and assertions",
        summary:
          "The annotation timing and assertion clues most often used in Moodle-style questions.",
        estMinutes: 25,
        topicTags: ["junit-4"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "Lifecycle annotations",
            md: "`@Test` marks a test method.\n\n`@Before` runs before each test method.\n\n`@After` runs after each test method.\n\n`@BeforeClass` runs once before all tests in the class and must be static.\n\n`@AfterClass` runs once after all tests in the class and must be static.",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Per-test vs once-per-class",
            md: "Use `@Before` for fresh state before each test. Use `@BeforeClass` for expensive shared setup, such as opening a database connection for the whole test class, if isolation allows it.",
          },
          {
            kind: "markdown",
            md: "Common assertions: `assertEquals(expected, actual)`, `assertTrue`, `assertFalse`, `assertNull`, `assertNotNull`, `assertSame`, and `assertNotSame`. Watch argument order in `assertEquals`: expected first, actual second.",
          },
        ],
      },
    ],
  },
  {
    id: "cts-mod-test-design",
    title: "Test Design Heuristics",
    order: 5,
    lessons: [
      {
        id: "cts-les-test-design",
        title: "RIGHT-BICEP and CORRECT",
        summary:
          "The two testing checklists as exam-recognition rules, with boundary, cross-check, range, existence, and cardinality clues.",
        estMinutes: 30,
        topicTags: ["test-design"],
        priority: 1,
        blocks: [
          {
            kind: "callout",
            tone: "key",
            title: "RIGHT-BICEP",
            md: "**Right:** are the results correct?\n\n**Boundary:** edge values and boundaries.\n\n**Inverse:** inverse relationships can verify behavior.\n\n**Cross-check:** compare with another method, oracle, or independent calculation.\n\n**Error conditions:** invalid inputs and exceptions.\n\n**Performance:** performance characteristics.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "CORRECT",
            md: "**Conformance:** format or protocol.\n\n**Ordering:** order assumptions.\n\n**Range:** minimum, maximum, inside, outside.\n\n**Reference:** aliases, null references, external dependencies.\n\n**Existence:** null, missing, empty, zero.\n\n**Cardinality:** zero, one, many, maximum.\n\n**Time:** order, concurrency, time effects.",
          },
          {
            kind: "tryIt",
            prompt:
              "A method returns an average over a collection. Which cardinality cases are the first tests?",
            answerMd:
              "Empty collection, one element, multiple elements, and maximum size if the collection has a defined maximum.",
          },
        ],
      },
    ],
  },
  {
    id: "cts-mod-coverage",
    title: "Coverage & Test Count Reasoning",
    order: 6,
    lessons: [
      {
        id: "cts-les-coverage",
        title: "Coverage counting",
        summary:
          "How to reason from control flow to the minimum tests for statement, branch, condition, and path coverage.",
        estMinutes: 35,
        topicTags: ["coverage", "test-design"],
        priority: 1,
        blocks: [
          {
            kind: "markdown",
            md: "Coverage questions are counting questions. Identify each decision first, then choose inputs that cover as many uncovered outcomes as possible without violating path constraints.",
          },
          {
            kind: "callout",
            tone: "key",
            title: "Coverage types",
            md: "**Statement coverage:** every executable statement runs at least once.\n\n**Branch / decision coverage:** every decision outcome is exercised.\n\n**Condition coverage:** boolean subconditions are independently exercised.\n\n**Path coverage:** distinct execution paths are exercised, usually more expensive than branch coverage.",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Minimum-test strategy",
            md: "For branch coverage, make a checklist of decision outcomes: `if A` needs A=true and A=false; `if B` needs B=true and B=false. Then combine compatible outcomes in the same test when possible.",
          },
          {
            kind: "tryIt",
            prompt:
              "A method has two independent `if` statements. What does 100% branch coverage require?",
            answerMd:
              "The test set must execute true and false outcomes for both decisions. It does not necessarily require every path if the question asks branch coverage rather than path coverage.",
          },
        ],
      },
    ],
  },
];
