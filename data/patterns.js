export const patterns = [
  {
    slug: 'abstract-factory',
    name: 'Abstract Factory',
    category: 'Creational',
    oneLiner: 'Create related objects without hard-coding the exact classes.',
    problem: 'An app often needs several objects that must work together, such as a button and a checkbox from the same UI theme. If every screen creates those classes directly, switching from one family to another becomes a search-and-edit job. Mixing objects from different families can also create awkward bugs.',
    solution: 'Define a factory interface with one method for each product in the family. Each concrete factory creates a matching set, such as light controls or dark controls. The client asks the factory for objects and does not know which concrete classes it receives.',
    analogy: 'A furniture showroom package gives you a chair, sofa, and table from the same collection instead of making you match each item yourself.',
    structure: [
      { role: 'AbstractFactory', description: 'Declares creation methods for each product type in the family.' },
      { role: 'ConcreteFactory', description: 'Creates one compatible family of products.' },
      { role: 'AbstractProduct', description: 'Defines what each product type must support.' },
      { role: 'ConcreteProduct', description: 'Implements a product for one specific family.' },
      { role: 'Client', description: 'Uses only factory and product interfaces.' },
    ],
    javaExample: `interface TicketUiFactory {
  Button createButton();
  Alert createAlert();
}

interface Button {
  String render();
}

interface Alert {
  String render();
}

class MobileButton implements Button {
  public String render() {
    return "large tap button";
  }
}

class MobileAlert implements Alert {
  public String render() {
    return "full screen mobile alert";
  }
}

class MobileUiFactory implements TicketUiFactory {
  public Button createButton() {
    return new MobileButton();
  }

  public Alert createAlert() {
    return new MobileAlert();
  }
}

class CheckoutScreen {
  private final Button payButton;
  private final Alert errorAlert;

  CheckoutScreen(TicketUiFactory factory) {
    this.payButton = factory.createButton();
    this.errorAlert = factory.createAlert();
  }
}`,
    whenToUse: [
      'You need families of related objects.',
      'The app must switch whole families at runtime or configuration time.',
      'Client code should not depend on concrete product classes.',
      'Products from different families should not be mixed.',
    ],
    whenNotToUse: [
      'You only create one simple object type.',
      'Adding new product types happens often, because every factory must change.',
    ],
    confusedWith: [
      { pattern: 'Factory Method', distinction: 'Factory Method creates one product through inheritance; Abstract Factory creates a whole family through a factory object.' },
      { pattern: 'Simple Factory', distinction: 'Simple Factory is usually one concrete creator with conditionals; Abstract Factory is an interface with multiple concrete factories.' },
    ],
    examSignals: [
      'family of related objects',
      'compatible products',
      'switch theme or platform',
      'avoid mixing product variants',
    ],
  },
  {
    slug: 'adapter',
    name: 'Adapter',
    category: 'Structural',
    oneLiner: 'Make an incompatible class look like the interface your code already expects.',
    problem: 'You have useful code, but its method names, parameters, or data format do not match the rest of the app. Rewriting either side may be expensive or risky. The problem is not missing behavior, but incompatible shape.',
    solution: 'Create an adapter that implements the expected interface and wraps the incompatible object. The adapter translates calls, parameters, and results between the two sides. Existing client code keeps calling the interface it already knows.',
    analogy: 'A travel plug lets your charger fit a different wall socket without changing the charger or the wall.',
    structure: [
      { role: 'Target', description: 'The interface the client expects.' },
      { role: 'Adapter', description: 'Implements the target interface and translates calls.' },
      { role: 'Adaptee', description: 'The existing class with an incompatible interface.' },
      { role: 'Client', description: 'Calls the target interface.' },
    ],
    javaExample: `interface PaymentGateway {
  boolean pay(String orderId, int cents);
}

class LegacyBankTerminal {
  boolean sendPayment(String rawMessage) {
    return rawMessage.startsWith("PAY");
  }
}

class BankTerminalAdapter implements PaymentGateway {
  private final LegacyBankTerminal terminal;

  BankTerminalAdapter(LegacyBankTerminal terminal) {
    this.terminal = terminal;
  }

  public boolean pay(String orderId, int cents) {
    return terminal.sendPayment("PAY|" + orderId + "|" + cents);
  }
}`,
    whenToUse: [
      'A useful class has the wrong interface.',
      'You need to integrate a legacy or external API.',
      'You want existing client code to stay unchanged.',
      'You need translation between formats or method signatures.',
    ],
    whenNotToUse: [
      'You own both interfaces and can simply make them consistent.',
      'The wrapper would add no real translation.',
    ],
    confusedWith: [
      { pattern: 'Facade', distinction: 'Adapter changes an interface to fit a client; Facade simplifies a larger subsystem.' },
      { pattern: 'Proxy', distinction: 'Adapter translates calls; Proxy controls access to an object with the same basic interface.' },
    ],
    examSignals: [
      'legacy API',
      'incompatible interface',
      'existing code must not change',
      'translate calls or data format',
    ],
  },
  {
    slug: 'bridge',
    name: 'Bridge',
    category: 'Structural',
    oneLiner: 'Separate what something does from how it is implemented so both can vary independently.',
    problem: 'Two dimensions of change can multiply subclasses quickly. For example, reports may be PDF or HTML, and they may be sent by email or saved to disk. Combining every type with every delivery method in inheritance creates a class explosion.',
    solution: 'Put one dimension behind an implementation interface and let the main abstraction hold a reference to it. The abstraction delegates the variable part to that implementation. You can add new abstractions or implementations without rebuilding every combination.',
    analogy: 'A remote control can work with different TVs because the remote behavior is separate from the TV implementation.',
    structure: [
      { role: 'Abstraction', description: 'Defines high-level behavior and holds an implementor.' },
      { role: 'RefinedAbstraction', description: 'Extends or specializes the high-level behavior.' },
      { role: 'Implementor', description: 'Defines operations for the implementation side.' },
      { role: 'ConcreteImplementor', description: 'Provides one implementation variant.' },
    ],
    javaExample: `interface ReportSender {
  void send(String title, String body);
}

class EmailSender implements ReportSender {
  public void send(String title, String body) {
    System.out.println("Email: " + title + "\\n" + body);
  }
}

abstract class Report {
  protected final ReportSender sender;

  Report(ReportSender sender) {
    this.sender = sender;
  }

  abstract void publish();
}

class SalesReport extends Report {
  SalesReport(ReportSender sender) {
    super(sender);
  }

  void publish() {
    sender.send("Sales", "Revenue by region");
  }
}`,
    whenToUse: [
      'Two independent dimensions are causing too many subclasses.',
      'The abstraction and implementation should be replaceable separately.',
      'You want composition instead of a deep inheritance tree.',
    ],
    whenNotToUse: [
      'There is only one stable implementation.',
      'A simple strategy object would express the variation more clearly.',
    ],
    confusedWith: [
      { pattern: 'Adapter', distinction: 'Bridge is designed up front to separate dimensions; Adapter fixes an interface mismatch after the fact.' },
      { pattern: 'Strategy', distinction: 'Strategy swaps one algorithm; Bridge separates a whole abstraction hierarchy from an implementation hierarchy.' },
    ],
    examSignals: [
      'two axes of variation',
      'avoid class explosion',
      'abstraction and implementation vary independently',
      'composition instead of inheritance combinations',
    ],
  },
  {
    slug: 'builder',
    name: 'Builder',
    category: 'Creational',
    oneLiner: 'Build a complex object step by step without a huge constructor.',
    problem: 'Some objects need many optional settings, validation rules, or ordered construction steps. A constructor with many parameters is hard to read and easy to call incorrectly. Several constructor overloads can become just as confusing.',
    solution: 'Move construction into a builder object with named methods for each step or option. The builder stores the intermediate choices and creates the final object when build is called. Client code becomes readable and can enforce required steps more clearly.',
    analogy: 'Ordering a custom sandwich works by choosing bread, filling, sauces, and extras before the final sandwich is made.',
    structure: [
      { role: 'Builder', description: 'Declares steps for configuring the product.' },
      { role: 'ConcreteBuilder', description: 'Stores choices and creates the final product.' },
      { role: 'Product', description: 'The complex object being built.' },
      { role: 'Director', description: 'Optionally defines a standard order of build steps.' },
    ],
    javaExample: `class Invoice {
  private final String customer;
  private final boolean includeVat;
  private final String note;

  private Invoice(Builder builder) {
    this.customer = builder.customer;
    this.includeVat = builder.includeVat;
    this.note = builder.note;
  }

  static class Builder {
    private final String customer;
    private boolean includeVat;
    private String note = "";

    Builder(String customer) {
      this.customer = customer;
    }

    Builder includeVat() {
      this.includeVat = true;
      return this;
    }

    Builder note(String note) {
      this.note = note;
      return this;
    }

    Invoice build() {
      return new Invoice(this);
    }
  }
}`,
    whenToUse: [
      'An object has many optional constructor parameters.',
      'Construction has several named steps.',
      'You need readable object creation in tests or setup code.',
      'The final object should be immutable after creation.',
    ],
    whenNotToUse: [
      'The object has only a couple of simple fields.',
      'The builder repeats all fields without improving clarity.',
    ],
    confusedWith: [
      { pattern: 'Abstract Factory', distinction: 'Builder focuses on step-by-step construction of one complex object; Abstract Factory creates families of related objects.' },
      { pattern: 'Factory Method', distinction: 'Factory Method chooses which concrete product to create; Builder controls how one product is assembled.' },
    ],
    examSignals: [
      'many optional parameters',
      'step by step construction',
      'avoid telescoping constructors',
      'fluent creation API',
    ],
  },
  {
    slug: 'chain-of-responsibility',
    name: 'Chain of Responsibility',
    category: 'Behavioral',
    oneLiner: 'Pass a request along handlers until one handles it.',
    problem: 'A request may need to be processed by one of several objects, but the sender should not know which one. Hard-coding if statements for every handler makes the sender depend on all possible processors. Changing the order or adding a handler becomes messy.',
    solution: 'Give each handler the same interface and a reference to the next handler. A handler either processes the request or forwards it. The chain can be assembled in different orders without changing the sender.',
    analogy: 'A support ticket moves from first-level support to billing to engineering until someone can solve it.',
    structure: [
      { role: 'Handler', description: 'Declares a method for handling or forwarding a request.' },
      { role: 'ConcreteHandler', description: 'Handles requests it understands and passes others on.' },
      { role: 'Client', description: 'Sends the request to the first handler in the chain.' },
    ],
    javaExample: `abstract class ExpenseApprover {
  private ExpenseApprover next;

  ExpenseApprover linkTo(ExpenseApprover next) {
    this.next = next;
    return next;
  }

  void approve(int amount) {
    if (!tryApprove(amount) && next != null) {
      next.approve(amount);
    }
  }

  protected abstract boolean tryApprove(int amount);
}

class ManagerApprover extends ExpenseApprover {
  protected boolean tryApprove(int amount) {
    if (amount <= 1000) {
      System.out.println("Manager approved");
      return true;
    }
    return false;
  }
}`,
    whenToUse: [
      'Several objects may handle the same request.',
      'The sender should not choose the handler directly.',
      'Handler order should be configurable.',
      'Some requests may pass through multiple checks.',
    ],
    whenNotToUse: [
      'Exactly one known object must always handle the request.',
      'Silent unhandled requests would be dangerous.',
    ],
    confusedWith: [
      { pattern: 'Decorator', distinction: 'Chain may stop when one handler processes the request; Decorator usually layers behavior around the same operation.' },
      { pattern: 'Command', distinction: 'Command packages a request as an object; Chain routes a request through possible handlers.' },
    ],
    examSignals: [
      'pass request along',
      'handler chain',
      'next handler',
      'sender does not know receiver',
    ],
  },
  {
    slug: 'command',
    name: 'Command',
    category: 'Behavioral',
    oneLiner: 'Wrap a request as an object so it can be stored, queued, logged, or undone.',
    problem: 'Code that triggers an action can become tightly coupled to the object that performs it. You may also need to queue actions, retry them, log them, or undo them. A plain method call does not carry enough information for those needs.',
    solution: 'Create command objects with an execute method and any data needed to perform the action. The invoker stores or runs commands without knowing the receiver details. Optional undo can be supported by storing previous state or reverse behavior.',
    analogy: 'A restaurant order ticket records what should happen so the kitchen can execute it later.',
    structure: [
      { role: 'Command', description: 'Declares execute and optionally undo.' },
      { role: 'ConcreteCommand', description: 'Binds a receiver with the request details.' },
      { role: 'Receiver', description: 'Performs the real work.' },
      { role: 'Invoker', description: 'Stores and triggers commands.' },
      { role: 'Client', description: 'Creates commands and connects them to receivers.' },
    ],
    javaExample: `interface Command {
  void execute();
}

class Light {
  void turnOn() {
    System.out.println("Light on");
  }
}

class TurnOnLightCommand implements Command {
  private final Light light;

  TurnOnLightCommand(Light light) {
    this.light = light;
  }

  public void execute() {
    light.turnOn();
  }
}

class RemoteButton {
  private Command command;

  void setCommand(Command command) {
    this.command = command;
  }

  void press() {
    command.execute();
  }
}`,
    whenToUse: [
      'You need to queue, schedule, or log actions.',
      'Buttons or menu items should trigger different actions uniformly.',
      'Undo or redo is required.',
      'The sender should not know the receiver class.',
    ],
    whenNotToUse: [
      'A direct method call is enough.',
      'Creating a class per action would add noise without benefits.',
    ],
    confusedWith: [
      { pattern: 'Strategy', distinction: 'Strategy chooses an algorithm for a task; Command represents a request to be executed.' },
      { pattern: 'Chain of Responsibility', distinction: 'Chain routes a request among handlers; Command stores the request as an object.' },
    ],
    examSignals: [
      'encapsulate a request',
      'undo redo',
      'queue operations',
      'menu action or button action',
    ],
  },
  {
    slug: 'composite',
    name: 'Composite',
    category: 'Structural',
    oneLiner: 'Treat individual objects and groups of objects the same way.',
    problem: 'Some domains naturally form trees, such as folders with files or UI panels with controls. Client code becomes complicated if it must constantly ask whether it is dealing with a single item or a group. The same operation usually needs to work on both.',
    solution: 'Give leaves and containers a shared interface. Leaf objects do the work directly, while composite objects forward the operation to their children and combine the results. Client code calls the same method on any node.',
    analogy: 'A folder and a file can both be selected, moved, or deleted in a file explorer, even though a folder contains other items.',
    structure: [
      { role: 'Component', description: 'Defines operations common to leaves and groups.' },
      { role: 'Leaf', description: 'Represents an individual object with no children.' },
      { role: 'Composite', description: 'Stores child components and delegates operations to them.' },
      { role: 'Client', description: 'Uses components without checking their concrete type.' },
    ],
    javaExample: `interface MenuItem {
  int price();
}

class Coffee implements MenuItem {
  public int price() {
    return 12;
  }
}

class BreakfastCombo implements MenuItem {
  private final java.util.List<MenuItem> items = new java.util.ArrayList<>();

  void add(MenuItem item) {
    items.add(item);
  }

  public int price() {
    int total = 0;
    for (MenuItem item : items) {
      total += item.price();
    }
    return total;
  }
}`,
    whenToUse: [
      'The domain is a tree or part-whole hierarchy.',
      'Clients should treat single items and groups uniformly.',
      'Operations naturally apply recursively.',
    ],
    whenNotToUse: [
      'The objects do not form a hierarchy.',
      'Leaf and group operations are too different to share a useful interface.',
    ],
    confusedWith: [
      { pattern: 'Decorator', distinction: 'Composite groups many children; Decorator wraps one object to add behavior.' },
      { pattern: 'Iterator', distinction: 'Composite models the tree; Iterator provides traversal over a collection.' },
    ],
    examSignals: [
      'part-whole hierarchy',
      'tree structure',
      'leaf and composite',
      'treat groups and individuals uniformly',
    ],
  },
  {
    slug: 'decorator',
    name: 'Decorator',
    category: 'Structural',
    oneLiner: 'Add behavior by wrapping an object instead of changing its class.',
    problem: 'You may need many optional features that can be combined in different ways. Subclassing for every combination quickly becomes unmanageable. Changing the original class may also break code that already uses it.',
    solution: 'Create wrappers that implement the same interface as the wrapped object. Each decorator adds its behavior before or after delegating to the wrapped object. Decorators can be stacked to combine features at runtime.',
    analogy: 'Adding toppings to coffee changes the final drink without creating a subclass for every topping combination.',
    structure: [
      { role: 'Component', description: 'Defines the interface shared by the base object and decorators.' },
      { role: 'ConcreteComponent', description: 'The original object being enhanced.' },
      { role: 'Decorator', description: 'Stores a component reference and delegates to it.' },
      { role: 'ConcreteDecorator', description: 'Adds one extra responsibility.' },
    ],
    javaExample: `interface ReceiptPrinter {
  String print();
}

class BasicReceiptPrinter implements ReceiptPrinter {
  public String print() {
    return "Items total";
  }
}

class VatReceiptPrinter implements ReceiptPrinter {
  private final ReceiptPrinter printer;

  VatReceiptPrinter(ReceiptPrinter printer) {
    this.printer = printer;
  }

  public String print() {
    return printer.print() + "\\nVAT included";
  }
}`,
    whenToUse: [
      'Features must be combined flexibly at runtime.',
      'Subclass combinations are exploding.',
      'You need to add behavior without editing the original class.',
      'The added behavior should keep the same interface.',
    ],
    whenNotToUse: [
      'The wrapper changes the interface clients need.',
      'A single optional flag would be simpler and clearer.',
    ],
    confusedWith: [
      { pattern: 'Proxy', distinction: 'Decorator adds responsibilities; Proxy controls access while trying to preserve behavior.' },
      { pattern: 'Adapter', distinction: 'Decorator keeps the same interface; Adapter changes an interface.' },
    ],
    examSignals: [
      'add responsibilities dynamically',
      'wrap object',
      'optional features',
      'avoid subclass combinations',
    ],
  },
  {
    slug: 'facade',
    name: 'Facade',
    category: 'Structural',
    oneLiner: 'Provide one simple interface over a complicated subsystem.',
    problem: 'A useful operation may require calling several classes in the right order. Client code that knows all those details becomes hard to read and easy to break. Most callers only need a common, simplified workflow.',
    solution: 'Create a facade class with methods that represent the simple tasks clients need. The facade coordinates the subsystem internally. Advanced code can still use the subsystem directly when it needs finer control.',
    analogy: 'A hotel reception desk hides separate systems for rooms, cleaning, billing, and keys behind one conversation.',
    structure: [
      { role: 'Facade', description: 'Offers simple methods for common subsystem workflows.' },
      { role: 'Subsystem classes', description: 'Perform the detailed work behind the facade.' },
      { role: 'Client', description: 'Calls the facade instead of coordinating many classes.' },
    ],
    javaExample: `class InventoryService {
  boolean hasStock(String sku) {
    return true;
  }
}

class PaymentService {
  void charge(String card) {
    System.out.println("Charged " + card);
  }
}

class ShippingService {
  void ship(String sku) {
    System.out.println("Shipping " + sku);
  }
}

class CheckoutFacade {
  private final InventoryService inventory = new InventoryService();
  private final PaymentService payment = new PaymentService();
  private final ShippingService shipping = new ShippingService();

  void buy(String sku, String card) {
    if (inventory.hasStock(sku)) {
      payment.charge(card);
      shipping.ship(sku);
    }
  }
}`,
    whenToUse: [
      'Clients need a simple entry point to a complex subsystem.',
      'Several calls must happen in a specific order.',
      'You want to reduce coupling to subsystem classes.',
    ],
    whenNotToUse: [
      'The facade becomes a giant class with unrelated responsibilities.',
      'Clients truly need direct access to most subsystem details.',
    ],
    confusedWith: [
      { pattern: 'Adapter', distinction: 'Facade simplifies many classes; Adapter makes one incompatible interface fit another.' },
      { pattern: 'Mediator', distinction: 'Facade simplifies calls from outside a subsystem; Mediator coordinates communication among peer objects.' },
    ],
    examSignals: [
      'simplified interface',
      'complex subsystem',
      'hide sequence of calls',
      'single entry point',
    ],
  },
  {
    slug: 'factory-method',
    name: 'Factory Method',
    category: 'Creational',
    oneLiner: 'Let subclasses decide which product class to create.',
    problem: 'A base class may know when it needs a product but not which concrete product is appropriate. Hard-coding product classes in the base class makes extension difficult. Adding new products should not require changing the base workflow.',
    solution: 'Put object creation in a method that subclasses override. The base class calls that method as part of its workflow. Each subclass supplies the product that fits its context.',
    analogy: 'A logistics company has the same delivery process, but each regional branch chooses whether it uses trucks, ships, or bikes.',
    structure: [
      { role: 'Product', description: 'Defines the interface for created objects.' },
      { role: 'ConcreteProduct', description: 'Implements one product variant.' },
      { role: 'Creator', description: 'Declares the factory method and often contains the main workflow.' },
      { role: 'ConcreteCreator', description: 'Overrides the factory method to create a concrete product.' },
    ],
    javaExample: `interface DocumentExporter {
  void export(String text);
}

class PdfExporter implements DocumentExporter {
  public void export(String text) {
    System.out.println("PDF: " + text);
  }
}

abstract class ExportScreen {
  void exportCurrentDocument() {
    DocumentExporter exporter = createExporter();
    exporter.export("Quarterly report");
  }

  protected abstract DocumentExporter createExporter();
}

class PdfExportScreen extends ExportScreen {
  protected DocumentExporter createExporter() {
    return new PdfExporter();
  }
}`,
    whenToUse: [
      'A superclass defines a workflow but subclasses choose the product.',
      'New product types should be added by adding new creators.',
      'Creation logic belongs near the class that uses the product.',
    ],
    whenNotToUse: [
      'A simple constructor call is stable and clear.',
      'You need to create several related product types together.',
    ],
    confusedWith: [
      { pattern: 'Abstract Factory', distinction: 'Factory Method creates one product through an overridable method; Abstract Factory creates families through a separate object.' },
      { pattern: 'Simple Factory', distinction: 'Simple Factory centralizes creation in one class; Factory Method relies on subclass override.' },
    ],
    examSignals: [
      'subclasses decide what to instantiate',
      'factory method',
      'creator and product',
      'avoid hard-coded concrete product in base class',
    ],
  },
  {
    slug: 'flyweight',
    name: 'Flyweight',
    category: 'Structural',
    oneLiner: 'Share common object data so many small objects use less memory.',
    problem: 'An app may create thousands or millions of similar objects, such as map markers, characters, or particles. Storing the same data in every object wastes memory. Performance can suffer even though most of the data is repeated.',
    solution: 'Split state into intrinsic data that can be shared and extrinsic data that changes per use. Store shared flyweight objects in a factory or cache. Clients pass the changing context when they use the flyweight.',
    analogy: 'A word processor stores one font description and reuses it for many characters, while each character keeps its own position.',
    structure: [
      { role: 'Flyweight', description: 'Defines operations that accept external context.' },
      { role: 'ConcreteFlyweight', description: 'Stores shared intrinsic state.' },
      { role: 'FlyweightFactory', description: 'Reuses existing flyweights or creates new ones.' },
      { role: 'Client', description: 'Stores extrinsic state and uses shared flyweights.' },
    ],
    javaExample: `class TreeType {
  private final String name;
  private final String texture;

  TreeType(String name, String texture) {
    this.name = name;
    this.texture = texture;
  }

  void draw(int x, int y) {
    System.out.println(name + " at " + x + "," + y + " using " + texture);
  }
}

class TreeTypeFactory {
  private final java.util.Map<String, TreeType> cache = new java.util.HashMap<>();

  TreeType get(String name, String texture) {
    return cache.computeIfAbsent(name + texture, key -> new TreeType(name, texture));
  }
}`,
    whenToUse: [
      'There are many similar objects.',
      'Memory usage is a real concern.',
      'Shared state can be separated from per-object state.',
      'Objects are mostly immutable once shared.',
    ],
    whenNotToUse: [
      'The object count is small.',
      'Shared and changing state cannot be separated clearly.',
    ],
    confusedWith: [
      { pattern: 'Singleton', distinction: 'Singleton limits a class to one instance; Flyweight shares many reusable instances based on intrinsic state.' },
      { pattern: 'Prototype', distinction: 'Prototype copies objects; Flyweight avoids copies by sharing common data.' },
    ],
    examSignals: [
      'many small objects',
      'reduce memory',
      'shared intrinsic state',
      'external extrinsic state',
    ],
  },
  {
    slug: 'interpreter',
    name: 'Interpreter',
    category: 'Behavioral',
    oneLiner: 'Represent simple grammar rules as objects that can evaluate sentences.',
    problem: 'Sometimes an app needs to process a small language, such as search filters, rules, or formulas. Hard-coding all possible expressions can become messy. The language needs a structure that mirrors its grammar.',
    solution: 'Create expression classes for grammar rules. Each expression knows how to interpret itself in a context. Complex sentences are built by combining smaller expression objects.',
    analogy: 'A calculator evaluates an expression by understanding numbers, plus signs, and grouped subexpressions.',
    structure: [
      { role: 'AbstractExpression', description: 'Declares the interpret operation.' },
      { role: 'TerminalExpression', description: 'Handles grammar elements that do not contain other expressions.' },
      { role: 'NonterminalExpression', description: 'Combines other expressions according to grammar rules.' },
      { role: 'Context', description: 'Provides input data needed during interpretation.' },
    ],
    javaExample: `interface Rule {
  boolean matches(String text);
}

class ContainsRule implements Rule {
  private final String word;

  ContainsRule(String word) {
    this.word = word;
  }

  public boolean matches(String text) {
    return text.contains(word);
  }
}

class AndRule implements Rule {
  private final Rule left;
  private final Rule right;

  AndRule(Rule left, Rule right) {
    this.left = left;
    this.right = right;
  }

  public boolean matches(String text) {
    return left.matches(text) && right.matches(text);
  }
}`,
    whenToUse: [
      'You have a small, stable grammar.',
      'Rules can be represented as expression objects.',
      'The language is simple enough that a full parser generator is unnecessary.',
    ],
    whenNotToUse: [
      'The grammar is large or changes often.',
      'Performance and error reporting need a real parser framework.',
    ],
    confusedWith: [
      { pattern: 'Composite', distinction: 'Interpreter often uses a composite tree, but its purpose is evaluating grammar expressions.' },
      { pattern: 'Strategy', distinction: 'Strategy swaps algorithms; Interpreter models sentences in a language.' },
    ],
    examSignals: [
      'grammar',
      'language expression',
      'terminal and nonterminal',
      'interpret rules',
    ],
  },
  {
    slug: 'iterator',
    name: 'Iterator',
    category: 'Behavioral',
    oneLiner: 'Traverse a collection without exposing how it stores its items.',
    problem: 'Client code often needs to loop through items, but the collection may use an array, tree, list, or custom storage. Exposing that storage makes clients fragile. Different traversal orders may also be needed.',
    solution: 'Provide an iterator object with methods such as hasNext and next. The iterator knows the collection internals and traversal state. Clients consume items through the iterator interface.',
    analogy: 'A playlist next button lets you move through songs without knowing how the player stores them.',
    structure: [
      { role: 'Iterator', description: 'Defines methods for moving through items.' },
      { role: 'ConcreteIterator', description: 'Tracks traversal state for one collection.' },
      { role: 'Aggregate', description: 'Declares a method for creating an iterator.' },
      { role: 'ConcreteAggregate', description: 'Stores items and creates matching iterators.' },
    ],
    javaExample: `class OrderHistory implements Iterable<String> {
  private final java.util.List<String> orders = new java.util.ArrayList<>();

  void add(String orderId) {
    orders.add(orderId);
  }

  public java.util.Iterator<String> iterator() {
    return orders.iterator();
  }
}

class Report {
  void print(OrderHistory history) {
    for (String orderId : history) {
      System.out.println(orderId);
    }
  }
}`,
    whenToUse: [
      'Clients need traversal without storage details.',
      'A collection needs several traversal orders.',
      'You want a standard loop interface.',
    ],
    whenNotToUse: [
      'The collection is already simple and directly exposed safely.',
      'Traversal requires complex querying better handled by a database or stream pipeline.',
    ],
    confusedWith: [
      { pattern: 'Composite', distinction: 'Composite structures objects as a tree; Iterator traverses items regardless of structure.' },
      { pattern: 'Visitor', distinction: 'Iterator moves through elements; Visitor performs operations on elements by type.' },
    ],
    examSignals: [
      'traverse collection',
      'hide internal representation',
      'hasNext and next',
      'custom traversal order',
    ],
  },
  {
    slug: 'mediator',
    name: 'Mediator',
    category: 'Behavioral',
    oneLiner: 'Centralize communication so objects do not all talk directly to each other.',
    problem: 'When many objects know about and update each other, the relationships become tangled. Changing one object can require changes across many peers. This is common in forms, dialogs, and workflows with many interacting controls.',
    solution: 'Introduce a mediator object that receives events from colleagues and coordinates the response. Colleagues know the mediator, not each other. Communication rules live in one place instead of being scattered.',
    analogy: 'An air traffic controller coordinates planes so pilots do not negotiate directly with every other plane.',
    structure: [
      { role: 'Mediator', description: 'Declares communication methods used by colleagues.' },
      { role: 'ConcreteMediator', description: 'Coordinates colleague interactions.' },
      { role: 'Colleague', description: 'Knows the mediator and reports events to it.' },
    ],
    javaExample: `class CheckoutMediator {
  private PaymentField payment;
  private SubmitButton submit;

  void register(PaymentField payment, SubmitButton submit) {
    this.payment = payment;
    this.submit = submit;
  }

  void paymentChanged() {
    submit.setEnabled(payment.isValid());
  }
}

class PaymentField {
  private final CheckoutMediator mediator;
  private String value = "";

  PaymentField(CheckoutMediator mediator) {
    this.mediator = mediator;
  }

  void setValue(String value) {
    this.value = value;
    mediator.paymentChanged();
  }

  boolean isValid() {
    return value.length() == 16;
  }
}

class SubmitButton {
  void setEnabled(boolean enabled) {
    System.out.println("Submit enabled: " + enabled);
  }
}`,
    whenToUse: [
      'Many objects have tangled communication.',
      'Interaction rules should live in one coordinator.',
      'Colleagues should be reusable without knowing each other.',
    ],
    whenNotToUse: [
      'Only two objects communicate simply.',
      'The mediator would become an unstructured god object.',
    ],
    confusedWith: [
      { pattern: 'Observer', distinction: 'Observer broadcasts changes to subscribers; Mediator contains coordination logic between colleagues.' },
      { pattern: 'Facade', distinction: 'Facade simplifies subsystem access from outside; Mediator manages peer interaction inside a workflow.' },
    ],
    examSignals: [
      'central coordinator',
      'objects should not refer to each other',
      'dialog controls',
      'reduce many-to-many communication',
    ],
  },
  {
    slug: 'memento',
    name: 'Memento',
    category: 'Behavioral',
    oneLiner: 'Save and restore an object state without exposing its internals.',
    problem: 'Users may need undo, rollback, or checkpoints. Saving state directly from outside can expose private fields and break encapsulation. The object itself should decide what state is needed for restoration.',
    solution: 'Let the originator create a memento object containing a snapshot of its state. A caretaker stores mementos but does not inspect them. Later, the originator uses a memento to restore itself.',
    analogy: 'A game save file lets the game restore your progress without you editing the internal memory directly.',
    structure: [
      { role: 'Originator', description: 'Creates snapshots and restores from them.' },
      { role: 'Memento', description: 'Stores captured state privately.' },
      { role: 'Caretaker', description: 'Keeps mementos without modifying their contents.' },
    ],
    javaExample: `class TextEditor {
  private String text = "";

  void type(String words) {
    text += words;
  }

  Snapshot save() {
    return new Snapshot(text);
  }

  void restore(Snapshot snapshot) {
    text = snapshot.text;
  }

  static class Snapshot {
    private final String text;

    private Snapshot(String text) {
      this.text = text;
    }
  }
}`,
    whenToUse: [
      'Undo or rollback is required.',
      'State should be restored without exposing private fields.',
      'Snapshots are easier than reverse operations.',
    ],
    whenNotToUse: [
      'Snapshots are too large to store safely.',
      'The state is simple enough to recompute.',
    ],
    confusedWith: [
      { pattern: 'Command', distinction: 'Command can implement undo by reversing actions; Memento implements undo by restoring saved state.' },
      { pattern: 'Prototype', distinction: 'Prototype clones objects for creation; Memento captures state for later restoration.' },
    ],
    examSignals: [
      'snapshot',
      'restore previous state',
      'undo using saved state',
      'do not expose internals',
    ],
  },
  {
    slug: 'observer',
    name: 'Observer',
    category: 'Behavioral',
    oneLiner: 'Notify interested objects automatically when something changes.',
    problem: 'Several objects may need to react when one object changes, but the changing object should not be tightly coupled to all of them. Hard-coding calls to every dependent object makes adding new reactions difficult. The number of listeners may change at runtime.',
    solution: 'Let observers subscribe to a subject. When the subject changes, it notifies all registered observers through a common interface. New observers can be added without changing the subject logic.',
    analogy: 'Subscribing to a channel means you receive updates when new content appears, without the creator knowing each subscriber personally.',
    structure: [
      { role: 'Subject', description: 'Stores observers and sends notifications.' },
      { role: 'Observer', description: 'Declares the update method.' },
      { role: 'ConcreteSubject', description: 'Maintains state that observers care about.' },
      { role: 'ConcreteObserver', description: 'Reacts to subject notifications.' },
    ],
    javaExample: `interface StockObserver {
  void priceChanged(String symbol, double price);
}

class StockTicker {
  private final java.util.List<StockObserver> observers = new java.util.ArrayList<>();

  void addObserver(StockObserver observer) {
    observers.add(observer);
  }

  void setPrice(String symbol, double price) {
    for (StockObserver observer : observers) {
      observer.priceChanged(symbol, price);
    }
  }
}

class PriceAlert implements StockObserver {
  public void priceChanged(String symbol, double price) {
    System.out.println(symbol + " is now " + price);
  }
}`,
    whenToUse: [
      'Many objects react to one object changing.',
      'Observers should be added or removed at runtime.',
      'The subject should not know concrete observer classes.',
      'Event-style notification fits the domain.',
    ],
    whenNotToUse: [
      'The update order must be tightly controlled.',
      'Too many notifications would make behavior hard to trace.',
    ],
    confusedWith: [
      { pattern: 'Mediator', distinction: 'Observer broadcasts change events; Mediator coordinates detailed interactions among colleagues.' },
      { pattern: 'Chain of Responsibility', distinction: 'Observer notifies all subscribers; Chain passes a request until handled.' },
    ],
    examSignals: [
      'subscribe and notify',
      'publisher subscriber',
      'listeners',
      'one-to-many dependency',
    ],
  },
  {
    slug: 'prototype',
    name: 'Prototype',
    category: 'Creational',
    oneLiner: 'Create new objects by copying an existing example.',
    problem: 'Creating an object from scratch may be expensive or require many configuration steps. Sometimes the best source of setup is an object that already exists. Client code should not need to know the concrete class to make another similar object.',
    solution: 'Give objects a clone or copy method. The client asks an existing prototype to copy itself, then adjusts the copy if needed. A registry can store common prototypes by name.',
    analogy: 'Using a document template copies a prepared document so you can edit the new copy.',
    structure: [
      { role: 'Prototype', description: 'Declares a method for cloning itself.' },
      { role: 'ConcretePrototype', description: 'Copies its own fields into a new object.' },
      { role: 'Client', description: 'Creates objects by cloning prototypes.' },
      { role: 'PrototypeRegistry', description: 'Optionally stores reusable prototype instances.' },
    ],
    javaExample: `class ReportTemplate {
  private final String title;
  private final String footer;

  ReportTemplate(String title, String footer) {
    this.title = title;
    this.footer = footer;
  }

  ReportTemplate copy() {
    return new ReportTemplate(title, footer);
  }

  String render(String body) {
    return title + "\\n" + body + "\\n" + footer;
  }
}`,
    whenToUse: [
      'Object setup is expensive or repetitive.',
      'New objects should copy existing configuration.',
      'Client code should not depend on concrete classes.',
      'Runtime-created examples need to become templates.',
    ],
    whenNotToUse: [
      'Copying object state is unclear or risky.',
      'A constructor or builder is simpler.',
    ],
    confusedWith: [
      { pattern: 'Builder', distinction: 'Builder constructs step by step; Prototype copies an existing configured object.' },
      { pattern: 'Factory Method', distinction: 'Factory Method creates through a creator method; Prototype asks an object to clone itself.' },
    ],
    examSignals: [
      'clone',
      'copy existing object',
      'configured template object',
      'avoid expensive creation',
    ],
  },
  {
    slug: 'proxy',
    name: 'Proxy',
    category: 'Structural',
    oneLiner: 'Control access to another object through a stand-in with the same interface.',
    problem: 'Calling an object directly may be too expensive, unsafe, remote, or unrestricted. Clients still want to use the object as if it were normal. The extra control should not be spread across every client.',
    solution: 'Create a proxy that implements the same interface as the real subject. The proxy checks permissions, delays creation, logs access, caches results, or forwards remote calls before delegating. Clients talk to the proxy through the subject interface.',
    analogy: 'A security desk represents access to an office: you interact with the desk before reaching the actual room.',
    structure: [
      { role: 'Subject', description: 'Defines the interface shared by proxy and real object.' },
      { role: 'RealSubject', description: 'Performs the real work.' },
      { role: 'Proxy', description: 'Controls access and delegates to the real subject.' },
      { role: 'Client', description: 'Uses the subject interface.' },
    ],
    javaExample: `interface DocumentStore {
  String read(String name);
}

class CloudDocumentStore implements DocumentStore {
  public String read(String name) {
    return "contents of " + name;
  }
}

class SecureDocumentStoreProxy implements DocumentStore {
  private final DocumentStore realStore = new CloudDocumentStore();
  private final boolean admin;

  SecureDocumentStoreProxy(boolean admin) {
    this.admin = admin;
  }

  public String read(String name) {
    if (!admin) {
      throw new SecurityException("Access denied");
    }
    return realStore.read(name);
  }
}`,
    whenToUse: [
      'Access needs permission checks or validation.',
      'The real object should be loaded lazily.',
      'Calls should be cached, logged, or routed remotely.',
      'Clients should keep the same interface.',
    ],
    whenNotToUse: [
      'The proxy changes the object interface.',
      'The extra layer adds no access control or lifecycle benefit.',
    ],
    confusedWith: [
      { pattern: 'Decorator', distinction: 'Proxy controls access; Decorator adds new behavior or responsibilities.' },
      { pattern: 'Adapter', distinction: 'Proxy keeps the same interface; Adapter changes one interface into another.' },
    ],
    examSignals: [
      'stand-in object',
      'access control',
      'lazy loading',
      'remote proxy',
      'validation before real call',
    ],
  },
  {
    slug: 'singleton',
    name: 'Singleton',
    category: 'Creational',
    oneLiner: 'Ensure a class has one shared instance and provide a global access point to it.',
    problem: 'Some services should have exactly one coordinated instance, such as a shared configuration holder. Multiple instances could conflict or waste resources. Code also needs a consistent way to access that instance.',
    solution: 'Hide the constructor and expose a static method or field that returns the single instance. The class controls when the instance is created. In modern apps, dependency injection is often a cleaner way to manage shared services.',
    analogy: 'A building has one reception desk that everyone uses for the same central service.',
    structure: [
      { role: 'Singleton', description: 'Stores the single instance and controls construction.' },
      { role: 'Client', description: 'Accesses the instance through the public access point.' },
    ],
    javaExample: `class AppConfig {
  private static final AppConfig INSTANCE = new AppConfig();
  private final java.util.Properties values = new java.util.Properties();

  private AppConfig() {
    values.setProperty("region", "eu");
  }

  static AppConfig getInstance() {
    return INSTANCE;
  }

  String get(String key) {
    return values.getProperty(key);
  }
}`,
    whenToUse: [
      'Exactly one instance must coordinate shared state.',
      'Creating more than one instance would be incorrect.',
      'A single access point is required by the design.',
    ],
    whenNotToUse: [
      'You only want convenient global access.',
      'Testing would suffer because dependencies become hidden.',
      'Dependency injection can manage lifetime more cleanly.',
    ],
    confusedWith: [
      { pattern: 'Flyweight', distinction: 'Singleton has one instance total; Flyweight shares many instances keyed by reusable state.' },
      { pattern: 'Facade', distinction: 'Facade simplifies subsystem access; Singleton controls instance count.' },
    ],
    examSignals: [
      'single instance',
      'global access point',
      'private constructor',
      'only one object allowed',
    ],
  },
  {
    slug: 'state',
    name: 'State',
    category: 'Behavioral',
    oneLiner: 'Let an object change its behavior when its internal state changes.',
    problem: 'Objects with modes often become full of if or switch statements. Each method checks the current state and decides what behavior is allowed. Adding a new state means editing many methods.',
    solution: 'Create a class for each state and give them a common interface. The context delegates state-dependent behavior to the current state object. State objects can also move the context to a different state.',
    analogy: 'A vending machine behaves differently when idle, paid, empty, or dispensing, even though you press the same buttons.',
    structure: [
      { role: 'Context', description: 'Stores the current state and delegates behavior to it.' },
      { role: 'State', description: 'Declares operations that vary by state.' },
      { role: 'ConcreteState', description: 'Implements behavior for one state and may trigger transitions.' },
    ],
    javaExample: `interface OrderState {
  void pay(Order order);
  void ship(Order order);
}

class NewOrderState implements OrderState {
  public void pay(Order order) {
    order.setState(new PaidOrderState());
  }

  public void ship(Order order) {
    throw new IllegalStateException("Pay first");
  }
}

class PaidOrderState implements OrderState {
  public void pay(Order order) {
    throw new IllegalStateException("Already paid");
  }

  public void ship(Order order) {
    System.out.println("Shipping order");
  }
}

class Order {
  private OrderState state = new NewOrderState();

  void setState(OrderState state) {
    this.state = state;
  }

  void pay() {
    state.pay(this);
  }

  void ship() {
    state.ship(this);
  }
}`,
    whenToUse: [
      'Behavior depends heavily on object state.',
      'State checks are repeated across methods.',
      'Adding states should not require editing every method.',
      'State transitions are part of the model.',
    ],
    whenNotToUse: [
      'There are only one or two simple states.',
      'State changes are better represented as data, not behavior.',
    ],
    confusedWith: [
      { pattern: 'Strategy', distinction: 'State changes behavior as internal state changes; Strategy is usually chosen by the client to swap an algorithm.' },
      { pattern: 'Command', distinction: 'State represents modes of an object; Command represents actions to execute.' },
    ],
    examSignals: [
      'behavior changes with state',
      'replace switch on state',
      'state transitions',
      'same method acts differently by mode',
    ],
  },
  {
    slug: 'strategy',
    name: 'Strategy',
    category: 'Behavioral',
    oneLiner: 'Choose an interchangeable algorithm without changing the object that uses it.',
    problem: 'A class may support several ways to do the same task, such as sorting, pricing, or route calculation. Putting all options in if statements makes the class grow and change often. The algorithm should be replaceable independently.',
    solution: 'Define a strategy interface for the algorithm. Put each algorithm in its own class. The context receives a strategy and delegates the variable behavior to it.',
    analogy: 'A navigation app can choose fastest route, cheapest route, or walking route while the app screen stays the same.',
    structure: [
      { role: 'Strategy', description: 'Declares the algorithm interface.' },
      { role: 'ConcreteStrategy', description: 'Implements one algorithm variant.' },
      { role: 'Context', description: 'Uses a strategy to perform the variable behavior.' },
    ],
    javaExample: `interface DiscountStrategy {
  int discount(int subtotal);
}

class StudentDiscount implements DiscountStrategy {
  public int discount(int subtotal) {
    return subtotal / 10;
  }
}

class Checkout {
  private DiscountStrategy discountStrategy;

  Checkout(DiscountStrategy discountStrategy) {
    this.discountStrategy = discountStrategy;
  }

  int total(int subtotal) {
    return subtotal - discountStrategy.discount(subtotal);
  }
}`,
    whenToUse: [
      'Several algorithms solve the same task.',
      'The algorithm should be selected at runtime.',
      'You want to remove large conditionals from the context.',
      'Each algorithm deserves its own test.',
    ],
    whenNotToUse: [
      'There is only one realistic algorithm.',
      'The strategies are tiny and make the code harder to follow.',
    ],
    confusedWith: [
      { pattern: 'State', distinction: 'Strategy is selected to vary an algorithm; State changes behavior because the object changes mode.' },
      { pattern: 'Template Method', distinction: 'Strategy uses composition to swap the whole algorithm; Template Method uses inheritance to customize steps.' },
    ],
    examSignals: [
      'interchangeable algorithms',
      'choose behavior at runtime',
      'remove if else algorithm selection',
      'policy object',
    ],
  },
  {
    slug: 'template-method',
    name: 'Template Method',
    category: 'Behavioral',
    oneLiner: 'Define the fixed steps of an algorithm while letting subclasses customize some steps.',
    problem: 'Several classes may follow the same overall process but differ in a few details. Copying the full algorithm into every class duplicates code and makes the order of steps easy to break. The shared process needs one home.',
    solution: 'Put the algorithm skeleton in a base class method. The base class calls abstract or hook methods for the steps that vary. Subclasses override only those steps while the overall order stays fixed.',
    analogy: 'A recipe format always has prep, cook, and serve steps, but each dish fills those steps differently.',
    structure: [
      { role: 'AbstractClass', description: 'Defines the template method and variable step methods.' },
      { role: 'ConcreteClass', description: 'Implements the steps that vary.' },
      { role: 'Hook', description: 'Optional step with a default implementation.' },
    ],
    javaExample: `abstract class DataImporter {
  final void importFile(String path) {
    String raw = read(path);
    java.util.List<String> rows = parse(raw);
    save(rows);
  }

  private String read(String path) {
    return "a,b,c";
  }

  protected abstract java.util.List<String> parse(String raw);

  private void save(java.util.List<String> rows) {
    System.out.println("Saved " + rows.size() + " rows");
  }
}

class CsvImporter extends DataImporter {
  protected java.util.List<String> parse(String raw) {
    return java.util.Arrays.asList(raw.split(","));
  }
}`,
    whenToUse: [
      'Several classes share the same algorithm structure.',
      'Only some steps vary.',
      'The order of steps must be protected.',
      'Common code should live in one base class.',
    ],
    whenNotToUse: [
      'Composition would avoid an unnecessary inheritance hierarchy.',
      'Subclasses need to change the algorithm order freely.',
    ],
    confusedWith: [
      { pattern: 'Strategy', distinction: 'Template Method customizes steps through inheritance; Strategy swaps algorithms through composition.' },
      { pattern: 'Factory Method', distinction: 'Factory Method is often one step inside a template method, but it specifically creates objects.' },
    ],
    examSignals: [
      'algorithm skeleton',
      'fixed sequence of steps',
      'subclasses override steps',
      'hook method',
    ],
  },
  {
    slug: 'visitor',
    name: 'Visitor',
    category: 'Behavioral',
    oneLiner: 'Add new operations to a set of object types without changing those object classes.',
    problem: 'You may have a stable object structure but need many different operations over it, such as export, validation, and reporting. Adding methods for every operation pollutes the object classes. Type checks in one big operation class are also brittle.',
    solution: 'Create a visitor interface with a visit method for each element type. Elements accept a visitor and call the matching visit method. New operations are added as new visitors.',
    analogy: 'Different inspectors can visit the same building: a fire inspector, energy inspector, and safety inspector each perform a different operation on the same rooms.',
    structure: [
      { role: 'Visitor', description: 'Declares visit methods for each concrete element type.' },
      { role: 'ConcreteVisitor', description: 'Implements one operation across element types.' },
      { role: 'Element', description: 'Declares accept for receiving a visitor.' },
      { role: 'ConcreteElement', description: 'Calls the visitor method for its own type.' },
      { role: 'ObjectStructure', description: 'Stores elements that visitors operate on.' },
    ],
    javaExample: `interface InvoiceElement {
  void accept(InvoiceVisitor visitor);
}

class ProductLine implements InvoiceElement {
  final int amount;

  ProductLine(int amount) {
    this.amount = amount;
  }

  public void accept(InvoiceVisitor visitor) {
    visitor.visitProductLine(this);
  }
}

interface InvoiceVisitor {
  void visitProductLine(ProductLine line);
}

class TaxVisitor implements InvoiceVisitor {
  private int tax;

  public void visitProductLine(ProductLine line) {
    tax += line.amount / 5;
  }

  int tax() {
    return tax;
  }
}`,
    whenToUse: [
      'The element classes are stable.',
      'You need to add many operations over those elements.',
      'Operations depend on concrete element types.',
      'You want operation code grouped by operation.',
    ],
    whenNotToUse: [
      'New element types are added often.',
      'The visitor interface would change constantly.',
    ],
    confusedWith: [
      { pattern: 'Iterator', distinction: 'Iterator traverses elements; Visitor performs type-specific operations on elements.' },
      { pattern: 'Command', distinction: 'Command packages an action; Visitor adds an operation across a structure of element types.' },
    ],
    examSignals: [
      'add operations without changing classes',
      'visit methods',
      'double dispatch',
      'stable object structure',
    ],
  },
  {
    slug: 'simple-factory',
    name: 'Simple Factory',
    category: 'Creational',
    oneLiner: 'Centralize simple object creation behind one method.',
    problem: 'Client code may repeat object creation logic and conditionals in many places. If concrete class names are scattered, changing creation rules becomes painful. The creation logic is useful to centralize even if a full GoF factory pattern would be too much.',
    solution: 'Create one factory class or static method that receives a simple input and returns the matching object. Clients call the factory instead of using constructors directly. The tradeoff is that adding a new type often requires editing the factory.',
    analogy: 'A cafeteria counter takes your order type and gives you the matching meal without exposing the kitchen steps.',
    structure: [
      { role: 'Factory', description: 'Contains the creation method and selection logic.' },
      { role: 'Product', description: 'Defines the common interface or base type returned.' },
      { role: 'ConcreteProduct', description: 'The classes created by the factory.' },
      { role: 'Client', description: 'Requests products from the factory.' },
    ],
    javaExample: `interface Notification {
  void send(String message);
}

class EmailNotification implements Notification {
  public void send(String message) {
    System.out.println("Email: " + message);
  }
}

class SmsNotification implements Notification {
  public void send(String message) {
    System.out.println("SMS: " + message);
  }
}

class NotificationFactory {
  static Notification create(String channel) {
    if ("email".equals(channel)) {
      return new EmailNotification();
    }
    if ("sms".equals(channel)) {
      return new SmsNotification();
    }
    throw new IllegalArgumentException("Unknown channel");
  }
}`,
    whenToUse: [
      'Creation logic is repeated in several clients.',
      'A small set of product types is selected by a simple value.',
      'You want a practical creation helper without inheritance.',
      'Centralized validation of creation input is useful.',
    ],
    whenNotToUse: [
      'New product types are added frequently and OCP matters strongly.',
      'The selection logic becomes a long, fragile conditional chain.',
    ],
    confusedWith: [
      { pattern: 'Factory Method', distinction: 'Simple Factory uses one concrete creator method; Factory Method lets subclasses override creation.' },
      { pattern: 'Abstract Factory', distinction: 'Simple Factory usually creates one product type; Abstract Factory creates related families.' },
    ],
    examSignals: [
      'central creation method',
      'create based on string or enum',
      'factory with if or switch',
      'not one of the GoF patterns',
    ],
  },
];


export default patterns;
