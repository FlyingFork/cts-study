import type { Deck, Flashcard, TopicTag } from "@/lib/schema";

type RawCard = readonly [
  slug: string,
  front: string,
  back: string,
  topic: TopicTag,
  tags: string[],
];

const rawCards: RawCard[] = [
  ["proxy", "When should Proxy be used?", "When access to another object must be controlled, restricted, delayed, cached, protected, or monitored.", "design-patterns", ["intent"]],
  ["adapter", "When should Adapter be used?", "When existing functionality has an incompatible interface and must fit a new client/context.", "design-patterns", ["intent"]],
  ["facade", "When should Facade be used?", "When a complex subsystem should be exposed through one simpler interface.", "design-patterns", ["intent"]],
  ["decorator", "When should Decorator be used?", "When behavior must be added dynamically to an object without changing its class.", "design-patterns", ["intent"]],
  ["strategy", "When should Strategy be used?", "When a client chooses among interchangeable algorithms at runtime.", "design-patterns", ["intent"]],
  ["state", "When should State be used?", "When an object changes behavior as its internal state changes.", "design-patterns", ["intent"]],
  ["command", "When should Command be used?", "When a request/action must be represented as an object, queued, delayed, logged, undone, or used as a callback.", "design-patterns", ["intent"]],
  ["observer", "When should Observer be used?", "When multiple listeners must be notified after a subject changes.", "design-patterns", ["intent"]],
  ["composite", "When should Composite be used?", "When individual objects and groups must be treated uniformly in a tree structure.", "design-patterns", ["intent"]],
  ["flyweight", "When should Flyweight be used?", "When many similar objects share common data and memory usage must be reduced.", "design-patterns", ["intent"]],
  ["singleton-clues", "What are Singleton implementation clues?", "Private constructor, private static instance, public static accessor, exactly one shared object.", "design-patterns", ["implementation"]],
  ["factory-singleton", "Factory vs Singleton?", "Factory creates objects; Singleton restricts a class to one instance.", "design-patterns", ["distinction"]],
  ["adapter-facade", "Adapter vs Facade?", "Adapter converts an interface; Facade simplifies a subsystem.", "design-patterns", ["distinction"]],
  ["decorator-proxy", "Decorator vs Proxy?", "Decorator adds behavior; Proxy controls access.", "design-patterns", ["distinction"]],
  ["strategy-state", "Strategy vs State?", "Strategy is selected by the client; State changes with object lifecycle.", "design-patterns", ["distinction"]],
  ["srp", "What does SRP require?", "A class or method has one responsibility and one reason to change.", "solid", ["solid"]],
  ["ocp", "What does OCP require?", "Code should be extensible without modifying existing stable classes.", "solid", ["solid"]],
  ["lsp", "What does LSP require?", "Subtypes must be usable wherever the base type is expected.", "solid", ["solid"]],
  ["isp", "What does ISP require?", "Interfaces should be small and client-specific.", "solid", ["solid"]],
  ["dip", "What does DIP require?", "High-level modules should depend on abstractions, not concrete implementations.", "solid", ["solid"]],
  ["dry", "What does DRY warn against?", "Repeated knowledge or duplicated logic.", "clean-code", ["clean-code"]],
  ["cohesion", "What does high cohesion mean?", "Related behavior and data are kept together.", "clean-code", ["clean-code"]],
  ["coupling", "What does low coupling mean?", "Classes depend on each other as little as practical.", "clean-code", ["clean-code"]],
  ["before", "What does `@Before` do in JUnit 4?", "Runs before each test method.", "junit-4", ["junit"]],
  ["beforeclass", "What does `@BeforeClass` do in JUnit 4?", "Runs once before all tests in the class; method must be static.", "junit-4", ["junit"]],
  ["after", "What does `@After` do in JUnit 4?", "Runs after each test method.", "junit-4", ["junit"]],
  ["test", "What does `@Test` do in JUnit 4?", "Marks a method as a test.", "junit-4", ["junit"]],
  ["statement-coverage", "What is statement coverage?", "Every executable statement runs at least once.", "coverage", ["coverage"]],
  ["branch-coverage", "What is branch coverage?", "Every decision outcome is exercised.", "coverage", ["coverage"]],
  ["path-coverage", "What is path coverage?", "Distinct execution paths are exercised.", "coverage", ["coverage"]],
  ["bicep-boundary", "RIGHT-BICEP: Boundary?", "Test edge values and boundary conditions.", "test-design", ["right-bicep"]],
  ["bicep-cross-check", "RIGHT-BICEP: Cross-check?", "Verify a result using another method, oracle, or independent calculation.", "test-design", ["right-bicep"]],
  ["correct-cardinality", "CORRECT: Cardinality?", "Test zero, one, many, and maximum counts.", "test-design", ["correct"]],
  ["correct-existence", "CORRECT: Existence?", "Test null, missing, empty, or zero values.", "test-design", ["correct"]],
  ["correct-range", "CORRECT: Range?", "Test minimum, maximum, inside, and outside allowed ranges.", "test-design", ["correct"]],
];

const cards: Flashcard[] = rawCards.map(([slug, front, back, topic, tags]) => ({
  id: `cts-card-${slug}`,
  front,
  back,
  topic,
  tags,
}));

export const ctsDeck: Deck = {
  id: "cts-deck",
  courseId: "cts",
  cards,
};
