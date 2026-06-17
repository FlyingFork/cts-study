"""Targeted supplement to raise under-represented patterns to the ~15+ goal:
Interpreter, Iterator, Visitor, Simple Factory, Abstract Factory."""
from genlib import mc, scenario, dnd


def build():
    qs = []
    S = qs.append

    # ---- Interpreter: D&D skeletons --------------------------------------
    INTERP = [("AddExpression", "+", "adds"), ("SubtractExpression", "-", "subtracts"),
              ("MultiplyExpression", "*", "multiplies"), ("DivideExpression", "/", "divides"),
              ("ModuloExpression", "%", "takes the remainder of")]
    tpl = ("interface Expression {\n"
           "  int interpret();\n"
           "}\n\n"
           "class NumberExpression implements Expression {\n"
           "  private int value;\n"
           "  NumberExpression(int value) { this.value = value; }\n"
           "  public int interpret() { return value; }\n"
           "}\n\n"
           "class {C} implements [[ZONE_1]] {\n"
           "  private Expression left, right;\n"
           "  {C}(Expression l, Expression r) { left = l; right = r; }\n"
           "  public int interpret() {\n"
           "    return left.interpret() [[ZONE_2]] right.interpret();\n"
           "  }\n"
           "}")
    for cname, op, _ in INTERP:
        S(dnd(
            f"Complete the Interpreter pattern where {cname} {[d for c,o,d in INTERP if c==cname][0]} its two sub-expressions.",
            tpl.replace("{C}", cname),
            {"ZONE_1": ["Expression", "NumberExpression", cname],
             "ZONE_2": [op] + [o for c, o, d in INTERP if o != op][:2]},
            {"ZONE_1": "Expression", "ZONE_2": op},
            "Each terminal/non-terminal implements the common Expression interface; a binary expression interprets its children and combines them with its operator.",
            tags=["Interpreter"]))

    # ---- Interpreter: MC --------------------------------------------------
    S(scenario(
        "You must build a small rule engine that parses and evaluates boolean expressions such as '(active AND premium) OR trial' written by business users in a custom mini-language. Which single design pattern is most associated with this?",
        ["Interpreter"], ["Visitor", "Composite", "Strategy", "Command", "Chain of Responsibility"],
        "Defining a grammar for a little language and an evaluator for its sentences is the Interpreter pattern.",
        ["Interpreter"]))
    S(scenario(
        "A search box lets users type a tiny query language ('price<100 AND brand=acme') that your code must parse into an expression tree and evaluate against each product. Which single design pattern fits best?",
        ["Interpreter"], ["Iterator", "Builder", "Observer", "Decorator", "Mediator"],
        "Representing grammar rules as classes and evaluating the resulting expression tree is the Interpreter pattern.",
        ["Interpreter"]))
    S(mc("Which design pattern does the following code implement?",
         ["Interpreter", "Composite", "Visitor", "Strategy", "Command"],
         ["Interpreter"],
         "An Expression interface with interpret(), terminal Number expressions and non-terminal operator expressions forming an AST is the Interpreter pattern.",
         code="interface Expr { int interpret(Map<String,Integer> ctx); }\nclass Var implements Expr {\n  String name;\n  public int interpret(Map<String,Integer> c){ return c.get(name); }\n}\nclass Plus implements Expr {\n  Expr l, r;\n  public int interpret(Map<String,Integer> c){ return l.interpret(c) + r.interpret(c); }\n}",
         tags=["Interpreter"]))
    S(mc("Which statement best describes the Interpreter pattern?",
         ["It defines a representation for a grammar plus an interpreter that evaluates sentences in that language",
          "It provides sequential access to a collection's elements",
          "It adds responsibilities to an object by wrapping it",
          "It ensures a class has only one instance"],
         ["It defines a representation for a grammar plus an interpreter that evaluates sentences in that language"],
         "Interpreter models grammar rules as a class hierarchy and evaluates expression trees built from them.",
         tags=["Interpreter"]))
    S(mc("In a typical Interpreter implementation, which roles usually appear? Select 1 or more answers",
         ["An abstract Expression with an interpret() method",
          "Terminal expressions (e.g., numbers, variables)",
          "Non-terminal expressions (e.g., add, multiply) holding sub-expressions",
          "A single static instance shared globally",
          "A cloning method to copy the grammar"],
         ["An abstract Expression with an interpret() method",
          "Terminal expressions (e.g., numbers, variables)",
          "Non-terminal expressions (e.g., add, multiply) holding sub-expressions"],
         "Interpreter has an abstract expression plus terminal and non-terminal expression classes; the other options describe Singleton/Prototype.",
         tags=["Interpreter"]))

    # ---- Iterator: MC -----------------------------------------------------
    S(scenario(
        "A social network must let callers walk a user's friends list one by one (and later a paginated server-backed version) without ever exposing whether the data is an array, a linked list, or a remote cursor. Which single design pattern fits best?",
        ["Iterator"], ["Composite", "Observer", "Proxy", "Visitor", "Strategy"],
        "Providing uniform sequential access while hiding the underlying storage is the Iterator pattern.",
        ["Iterator"]))
    S(mc("Which two methods are the core of Java's Iterator interface?",
         ["hasNext() and next()", "first() and last()", "size() and get()", "open() and close()"],
         ["hasNext() and next()"],
         "java.util.Iterator centers on hasNext() (is there more?) and next() (return next element and advance).",
         tags=["Iterator"]))
    S(mc("Which design pattern does the following code implement?",
         ["Iterator", "Composite", "Strategy", "Observer", "Visitor"],
         ["Iterator"],
         "An object exposing hasNext()/next() to traverse a collection without revealing its representation is the Iterator pattern.",
         code="class Range implements Iterable<Integer> {\n  int from, to;\n  public Iterator<Integer> iterator(){\n    return new Iterator<>(){\n      int cur = from;\n      public boolean hasNext(){ return cur < to; }\n      public Integer next(){ return cur++; }\n    };\n  }\n}",
         tags=["Iterator"]))
    S(mc("Why is the Iterator pattern preferable to exposing a collection's internal list directly? Select 1 or more answers",
         ["It hides the internal representation of the collection",
          "It lets multiple traversals proceed independently",
          "It offers a uniform traversal interface across different collections",
          "It guarantees the collection has a single instance",
          "It converts the collection's interface to another one"],
         ["It hides the internal representation of the collection",
          "It lets multiple traversals proceed independently",
          "It offers a uniform traversal interface across different collections"],
         "Iterator encapsulates traversal, supports concurrent independent cursors, and unifies the interface; the last two options describe Singleton/Adapter.",
         tags=["Iterator"]))

    # ---- Visitor: MC ------------------------------------------------------
    S(scenario(
        "A finance app has a fixed hierarchy of account types (Checking, Savings, Loan). You must keep adding new cross-cutting operations over them — interest report this quarter, tax export next quarter — without editing the account classes each time. Which single design pattern fits best?",
        ["Visitor"], ["Strategy", "Decorator", "Composite", "Template Method", "Observer"],
        "Adding new operations over a stable set of element classes without modifying them is the Visitor pattern.",
        ["Visitor"]))
    S(mc("Which design pattern does the following code implement?",
         ["Visitor", "Strategy", "Composite", "Interpreter", "Command"],
         ["Visitor"],
         "Elements exposing accept(visitor) that call back visitor.visit(this), with a visitor declaring a visit() overload per element type, is the Visitor pattern (double dispatch).",
         code="interface Visitor { void visit(Book b); void visit(Dvd d); }\ninterface Item { void accept(Visitor v); }\nclass Book implements Item {\n  public void accept(Visitor v){ v.visit(this); }\n}",
         tags=["Visitor"]))
    S(mc("The Visitor pattern relies on 'double dispatch'. What does that mean here?",
         ["The operation invoked depends on both the element's runtime type and the visitor's type",
          "Every method is called twice for safety",
          "Two threads dispatch the call in parallel",
          "The visitor clones itself before each visit"],
         ["The operation invoked depends on both the element's runtime type and the visitor's type"],
         "accept() selects the element type; the visit() overload selects the operation — two dispatches combine to pick the behavior.",
         tags=["Visitor"]))

    # ---- Simple Factory: MC ----------------------------------------------
    S(mc("Which design pattern (idiom) does the following code implement?",
         ["Simple Factory", "Abstract Factory", "Builder", "Prototype", "Singleton"],
         ["Simple Factory"],
         "One method that switches on a parameter and returns a product instance is the Simple Factory idiom (not a formal GoF pattern).",
         code="class PizzaFactory {\n  Pizza create(String type){\n    if (type.equals(\"margherita\")) return new Margherita();\n    if (type.equals(\"pepperoni\")) return new Pepperoni();\n    return null;\n  }\n}",
         tags=["Simple Factory"]))
    S(mc("Simple Factory vs Factory Method: which statement is TRUE?",
         ["Simple Factory centralises creation in one method/class; Factory Method defers the choice to subclasses",
          "They are the same GoF pattern",
          "Factory Method centralises creation in one method; Simple Factory uses subclasses",
          "Simple Factory always returns a singleton"],
         ["Simple Factory centralises creation in one method/class; Factory Method defers the choice to subclasses"],
         "Simple Factory is one switch-like creator; Factory Method uses polymorphism so subclasses pick the concrete product.",
         tags=["Simple Factory", "Factory Method"]))
    S(scenario(
        "A document app needs one helper that, given a string extension ('pdf','docx','txt'), returns the right Document object, centralising this creation logic in a single place. Which creational approach is described (note: not a formal GoF pattern)?",
        ["Simple Factory"], ["Abstract Factory", "Builder", "Prototype", "Bridge", "Decorator"],
        "Centralising parameterised object creation in a single method/class is the Simple Factory idiom.",
        ["Simple Factory"]))
    S(mc("Which are valid criticisms of the Simple Factory idiom? Select 1 or more answers",
         ["It tends to violate the Open/Closed Principle as new types are added",
          "Its conditional chain grows with every new product",
          "It can return null for unknown inputs",
          "It cannot create objects at all",
          "It forces every product to be a singleton"],
         ["It tends to violate the Open/Closed Principle as new types are added",
          "Its conditional chain grows with every new product",
          "It can return null for unknown inputs"],
         "Adding products means editing the factory (OCP), the if/switch grows, and unknown inputs may yield null. The last two options are false.",
         tags=["Simple Factory", "OCP"]))

    # ---- Abstract Factory: MC --------------------------------------------
    S(mc("Which design pattern does the following code implement?",
         ["Abstract Factory", "Factory Method", "Builder", "Simple Factory", "Prototype"],
         ["Abstract Factory"],
         "A factory interface declaring multiple create methods for a family of related products, implemented per family, is Abstract Factory.",
         code="interface GUIFactory {\n  Button createButton();\n  Checkbox createCheckbox();\n}\nclass MacFactory implements GUIFactory {\n  public Button createButton(){ return new MacButton(); }\n  public Checkbox createCheckbox(){ return new MacCheckbox(); }\n}",
         tags=["Abstract Factory"]))
    S(mc("Factory Method vs Abstract Factory: which statement is TRUE?",
         ["Factory Method creates one product via subclassing; Abstract Factory creates whole families of related products",
          "They are identical",
          "Abstract Factory creates exactly one product; Factory Method creates families",
          "Abstract Factory is a behavioral pattern"],
         ["Factory Method creates one product via subclassing; Abstract Factory creates whole families of related products"],
         "Factory Method = one product through overriding; Abstract Factory = a set of related products behind one factory interface.",
         tags=["Abstract Factory", "Factory Method"]))
    S(scenario(
        "A cross-platform UI toolkit must produce matching sets of widgets — a Windows family (WinButton, WinScrollbar, WinMenu) and a macOS family (MacButton, MacScrollbar, MacMenu) — so that a whole consistent set is created together. Which single design pattern fits best?",
        ["Abstract Factory"], ["Factory Method", "Builder", "Prototype", "Bridge", "Composite"],
        "Creating coordinated families of related products behind one factory interface is the Abstract Factory pattern.",
        ["Abstract Factory"]))
    S(mc("Which statements about Abstract Factory are TRUE? Select 1 or more answers",
         ["It creates families of related objects without naming their concrete classes",
          "Each concrete factory produces one consistent product family",
          "It is a creational pattern",
          "It guarantees a single global instance",
          "It converts one interface into another"],
         ["It creates families of related objects without naming their concrete classes",
          "Each concrete factory produces one consistent product family",
          "It is a creational pattern"],
         "Abstract Factory is creational and builds consistent product families behind abstractions; it is not Singleton or Adapter.",
         tags=["Abstract Factory"]))

    return qs


if __name__ == "__main__":
    print(len(build()))
