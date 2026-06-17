"""Curated knowledge tables + builders. Content is authored here; the helpers
only assemble it into the seed JSON shape so structural rules hold by
construction (correctAnswers always drawn from the same source as options)."""
import random

RNG = random.Random(20260617)

# ---------------------------------------------------------------------------
# PATTERN KNOWLEDGE: name -> (category, intent line)
# ---------------------------------------------------------------------------
PATTERNS = {
    "Singleton": ("Creational", "Ensures a class has only one instance and provides a global access point to it"),
    "Simple Factory": ("Creational", "Encapsulates object creation in one method or class that returns instances based on a parameter"),
    "Factory Method": ("Creational", "Defines an interface for creating an object but lets subclasses decide which class to instantiate"),
    "Abstract Factory": ("Creational", "Provides an interface for creating families of related objects without specifying their concrete classes"),
    "Prototype": ("Creational", "Creates new objects by cloning an existing instance instead of instantiating from scratch"),
    "Builder": ("Creational", "Separates the construction of a complex object from its representation using a step-by-step process"),
    "Adapter": ("Structural", "Converts the interface of a class into another interface that clients expect"),
    "Bridge": ("Structural", "Decouples an abstraction from its implementation so that the two can vary independently"),
    "Composite": ("Structural", "Composes objects into tree structures and lets clients treat individual objects and compositions uniformly"),
    "Decorator": ("Structural", "Attaches additional responsibilities to an object dynamically by wrapping it"),
    "Facade": ("Structural", "Provides a unified, simplified interface to a set of interfaces in a subsystem"),
    "Flyweight": ("Structural", "Shares common intrinsic state between many fine-grained objects to save memory"),
    "Proxy": ("Structural", "Provides a surrogate or placeholder for another object to control access to it"),
    "Chain of Responsibility": ("Behavioral", "Passes a request along a chain of handlers until one of them handles it"),
    "Command": ("Behavioral", "Encapsulates a request as an object, allowing parameterization, queuing, and undo"),
    "Interpreter": ("Behavioral", "Defines a grammar and an interpreter that evaluates sentences written in that language"),
    "Iterator": ("Behavioral", "Provides sequential access to the elements of a collection without exposing its underlying representation"),
    "Mediator": ("Behavioral", "Centralizes communication between a set of objects so they no longer refer to each other directly"),
    "Memento": ("Behavioral", "Captures and externalizes an object's internal state so it can be restored later without violating encapsulation"),
    "Observer": ("Behavioral", "Defines a one-to-many dependency so that when one object changes state all its dependents are notified automatically"),
    "State": ("Behavioral", "Allows an object to alter its behavior when its internal state changes, appearing to change its class"),
    "Strategy": ("Behavioral", "Defines a family of interchangeable algorithms and makes them selectable at runtime"),
    "Template Method": ("Behavioral", "Defines the skeleton of an algorithm in a base method, deferring some steps to subclasses"),
    "Visitor": ("Behavioral", "Lets you define a new operation on a set of objects without changing the classes of those objects"),
}

# Alternate one-line "defining characteristic" phrasings (distinct from intent),
# used to build a second style of matching question.
CHARACTERISTIC = {
    "Singleton": "Uses a private constructor and a static accessor so only one object ever exists",
    "Factory Method": "A creator class declares an abstract factory method that subclasses override",
    "Abstract Factory": "A factory interface declares one creation method per product in a related family",
    "Prototype": "Relies on a clone()/copy operation to duplicate a pre-configured object",
    "Builder": "Uses a fluent chain of setter-style methods ending in a build() call",
    "Adapter": "Wraps an existing class and translates its calls to a target interface",
    "Bridge": "Holds a reference to a separate implementation hierarchy chosen at construction time",
    "Composite": "Both leaves and containers implement the same component interface and containers hold children",
    "Decorator": "A wrapper that implements the same interface as the object it wraps and adds behavior around it",
    "Facade": "A single class delegates to several subsystem classes to hide their complexity",
    "Flyweight": "Splits object data into shared intrinsic state and per-context extrinsic state, often cached in a factory",
    "Proxy": "An object implementing the same interface as the real subject intercepts calls to it",
    "Chain of Responsibility": "Each handler holds a reference to the next handler and forwards what it cannot handle",
    "Command": "Encapsulates a receiver plus an action behind an execute() method",
    "Iterator": "Exposes hasNext() and next() to walk a collection's elements",
    "Mediator": "Colleague objects send events to a central object instead of calling each other",
    "Memento": "A separate snapshot object stores state that an originator can later restore from",
    "Observer": "Subjects keep a list of subscribers and call an update method on each when they change",
    "State": "The context delegates behavior to a swappable state object that it can replace at runtime",
    "Strategy": "The context holds an algorithm interface reference that can be set/replaced at runtime",
    "Template Method": "A final base method calls abstract step methods that subclasses fill in",
    "Visitor": "Elements expose accept(visitor) and call back visit(this) for double dispatch",
}

# ---------------------------------------------------------------------------
# SOLID
# ---------------------------------------------------------------------------
SOLID_FULL = {
    "Single Responsibility Principle (SRP)": "A class should have only one reason to change",
    "Open/Closed Principle (OCP)": "Software entities should be open for extension but closed for modification",
    "Liskov Substitution Principle (LSP)": "Subtypes must be substitutable for their base types without breaking behavior",
    "Interface Segregation Principle (ISP)": "Clients should not be forced to depend on methods they do not use",
    "Dependency Inversion Principle (DIP)": "High-level modules should depend on abstractions, not on concrete low-level modules",
}
SOLID_VIOLATION = {
    "SRP": "A class that both generates a report and also emails it and writes it to disk",
    "OCP": "Adding a new shape forces you to edit an existing switch statement that draws shapes",
    "LSP": "A Square subclass of Rectangle breaks code that sets width and height independently",
    "ISP": "A SimplePrinter forced to implement scan() and fax() with empty bodies",
    "DIP": "A high-level OrderService that directly instantiates a concrete MySqlDatabase",
}

# ---------------------------------------------------------------------------
# TESTING
# ---------------------------------------------------------------------------
JUNIT4 = {
    "@BeforeClass": "Runs once before any test in the class; must be static",
    "@AfterClass": "Runs once after all tests in the class have finished; must be static",
    "@Before": "Runs before every individual test method",
    "@After": "Runs after every individual test method",
    "@Test": "Marks a method as a test case to be executed by the runner",
    "@Test(expected = ArithmeticException.class)": "Passes only if the test method throws the named exception",
    "@Test(timeout = 1000)": "Fails the test if it runs longer than the given number of milliseconds",
    "@Ignore": "Tells the runner to skip this test method",
}
JUNIT5 = {
    "@BeforeAll": "Runs once before all tests; must be static (JUnit 5)",
    "@AfterAll": "Runs once after all tests; must be static (JUnit 5)",
    "@BeforeEach": "Runs before each test method (JUnit 5)",
    "@AfterEach": "Runs after each test method (JUnit 5)",
    "@DisplayName": "Provides a custom human-readable name for a test (JUnit 5)",
    "@ParameterizedTest": "Runs the same test repeatedly with different argument sets (JUnit 5)",
    "@Disabled": "Skips a test in JUnit 5 (the replacement for @Ignore)",
    "@Nested": "Marks an inner class as a nested group of tests (JUnit 5)",
}
JUNIT4_TO_5 = {
    "@Before": "@BeforeEach",
    "@After": "@AfterEach",
    "@BeforeClass": "@BeforeAll",
    "@AfterClass": "@AfterAll",
    "@Ignore": "@Disabled",
}
COVERAGE_DEFS = {
    "Statement coverage": "Percentage of executable statements that have been run at least once",
    "Branch coverage": "Percentage of decision outcomes (true/false of each branch) that have been exercised",
    "Path coverage": "Percentage of independent end-to-end execution paths through the code that have been taken",
    "Condition coverage": "Percentage of individual boolean sub-conditions evaluated both true and false",
    "Function coverage": "Percentage of functions or methods that have been called at least once",
}
TEST_DOUBLES = {
    "Dummy": "An object passed around but never actually used, only to fill a parameter list",
    "Stub": "Provides canned, predefined answers to calls made during the test",
    "Mock": "A pre-programmed object with expectations that verifies the calls it receives",
    "Spy": "A real object wrapper that also records information about how it was called",
    "Fake": "A working but lightweight implementation, such as an in-memory database",
}
TEST_CONCEPTS = {
    "Boundary value analysis": "Designs tests at the edges of valid input ranges (min, max, just inside/outside)",
    "Equivalence partitioning": "Divides inputs into classes that should be treated the same and tests one value per class",
    "Cyclomatic complexity": "Counts the number of linearly independent paths through a method (decision points + 1)",
    "Cardinality testing": "Tests the 0 / 1 / many cases for collections and counts",
    "Regression testing": "Re-runs existing tests to confirm that new changes did not break old behavior",
    "Error-condition testing": "Verifies the code behaves correctly when given invalid input or when exceptions occur",
}
FIRST = {
    "Fast": "Tests should run quickly so they can be executed often",
    "Independent": "Tests must not depend on each other or on execution order",
    "Repeatable": "Tests must give the same result every time, in any environment",
    "Self-validating": "Tests must automatically report pass/fail without manual inspection",
    "Timely": "Tests should be written at the right time, ideally just before the production code",
}

# ---------------------------------------------------------------------------
# BUILDERS
# ---------------------------------------------------------------------------
def mc(text, options, correct, expl, code=None, tags=()):
    assert all(c in options for c in correct), (text, correct, options)
    assert len(set(options)) == len(options), ("dup options", text)
    assert len(correct) >= 1
    return {
        "type": "multiple_choice",
        "questionText": text,
        "codeSnippet": code,
        "options": list(options),
        "isMultiSelect": len(correct) > 1,
        "correctAnswers": list(correct),
        "explanation": expl,
        "_tags": list(tags),
    }

def scenario(text, correct, distractors, expl, tags):
    opts = list(correct) + list(distractors)
    RNG.shuffle(opts)
    return mc(text, opts, correct, expl, code=None, tags=tags)

def dnd(text, snippet, zones, correct, expl, tags=()):
    # zones: {ZONE_x: [choices...]} ; correct: {ZONE_x: choice}
    return {
        "type": "drag_and_drop",
        "questionText": text,
        "snippetWithDropZones": snippet,
        "dropZones": {z: list(ch) for z, ch in zones.items()},
        "correctAnswers": dict(correct),
        "explanation": expl,
        "_tags": list(tags),
    }

def matching(text, mapping, expl, tags=(), extra_options=()):
    ents = list(mapping.keys())
    opts = list(mapping.values()) + list(extra_options)
    RNG.shuffle(ents)
    shuffled_opts = list(opts)
    RNG.shuffle(shuffled_opts)
    return {
        "type": "dropdown_matching",
        "questionText": text,
        "matchingEntities": ents,
        "matchingOptions": shuffled_opts,
        "correctAnswers": dict(mapping),
        "explanation": expl,
        "_tags": list(tags),
    }
