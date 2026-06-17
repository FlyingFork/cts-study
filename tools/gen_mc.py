"""multiple_choice generators: scenario pattern-picks, code-identification,
SOLID violation/fix, coverage & cyclomatic calculation, BVA/EP, JUnit lifecycle,
test doubles/smells/FIRST, definitions and comparisons."""
from genlib import mc, scenario


def build():
    qs = []

    # =====================================================================
    # A) SCENARIO "which pattern(s)" — the professor's favourite style
    # =====================================================================
    S = qs.append
    S(scenario(
        "You are building an e-commerce platform. The system must use a single shared payment-gateway client throughout the whole application, and it must also be able to create whole families of related UI widgets (buttons, checkboxes, menus) styled consistently for either the 'light' or 'dark' storefront theme. Which design patterns best fit? Select 1 or more answers",
        ["Singleton", "Abstract Factory"],
        ["Prototype", "Bridge", "Observer", "Decorator", "Facade", "State"],
        "A single shared instance is Singleton; creating coordinated families of related products (themed widget sets) is Abstract Factory.",
        ["Singleton", "Abstract Factory"]))
    S(scenario(
        "In an online banking app, every dashboard widget must refresh automatically whenever the account balance changes. Separately, each user action (transfer, deposit, withdrawal) must be encapsulated so it can be logged, queued, and undone. Which design patterns best fit? Select 1 or more answers",
        ["Observer", "Command"],
        ["Memento", "Strategy", "Adapter", "Singleton", "Composite", "Proxy"],
        "Auto-refreshing dependents on a state change is Observer; encapsulating each action as a queueable/undoable object is Command.",
        ["Observer", "Command"]))
    S(scenario(
        "A smart-home controller must let users press one 'Good Night' button that turns off lights, locks doors and lowers the thermostat through many different vendor APIs, exposing a single simple call to the app. Each individual device action must also be undoable. Which design patterns best fit? Select 1 or more answers",
        ["Facade", "Command"],
        ["Mediator", "Observer", "Flyweight", "Prototype", "Bridge", "State"],
        "A single simplified entry point over many subsystems is Facade; undoable encapsulated device actions are Command.",
        ["Facade", "Command"]))
    S(scenario(
        "A ride-sharing app must switch its fare-calculation algorithm at runtime (normal, surge, off-peak) without changing the booking code. Which single design pattern is the most appropriate?",
        ["Strategy"],
        ["State", "Template Method", "Observer", "Command", "Decorator"],
        "Interchangeable, runtime-selectable algorithms behind a common interface is the Strategy pattern.",
        ["Strategy"]))
    S(scenario(
        "A hospital records system must check a user's permissions before any access to a sensitive patient file is allowed, returning a local error otherwise. It must also let staff browse departments, sub-departments and individual patients through one uniform tree interface. Which design patterns best fit? Select 1 or more answers",
        ["Proxy", "Composite"],
        ["Decorator", "Adapter", "Observer", "Visitor", "Builder", "Mediator"],
        "An access-control gatekeeper in front of the real object is Proxy; treating individual records and groups of records uniformly in a tree is Composite.",
        ["Proxy", "Composite"]))
    S(scenario(
        "In a forest-rendering game, millions of trees share the same mesh and texture data to save memory, while each tree still has its own position and scale. The studio also wants to spawn new pre-configured enemy types by copying an existing template instance instead of rebuilding them. Which design patterns best fit? Select 1 or more answers",
        ["Flyweight", "Prototype"],
        ["Singleton", "Builder", "Composite", "Bridge", "Observer", "State"],
        "Sharing intrinsic state across many objects while keeping extrinsic state outside is Flyweight; cloning a pre-configured template is Prototype.",
        ["Flyweight", "Prototype"]))
    S(scenario(
        "A social-media backend must notify all of a user's followers when that user posts, and each notification must be deliverable through interchangeable channels (email, SMS, push) chosen at runtime. Which design patterns best fit? Select 1 or more answers",
        ["Observer", "Strategy"],
        ["Command", "Chain of Responsibility", "Adapter", "Prototype", "Facade", "Memento"],
        "Notifying many followers on a change is Observer; swapping the delivery algorithm at runtime is Strategy.",
        ["Observer", "Strategy"]))
    S(scenario(
        "A cloud file system must let users treat files and folders uniformly (a folder's size is the sum of its contents), and must let them dynamically wrap any file with optional features such as encryption and compression, stackable in any order. Which design patterns best fit? Select 1 or more answers",
        ["Composite", "Decorator"],
        ["Proxy", "Bridge", "Flyweight", "Visitor", "Strategy", "Singleton"],
        "Uniform treatment of leaves and containers in a tree is Composite; stacking optional responsibilities by wrapping is Decorator.",
        ["Composite", "Decorator"]))
    S(scenario(
        "A logging framework must guarantee exactly one logger instance application-wide, and must pass each log record through an ordered chain of handlers (console, file, alerting) where each handler decides whether to process and/or forward it. Which design patterns best fit? Select 1 or more answers",
        ["Singleton", "Chain of Responsibility"],
        ["Observer", "Decorator", "Command", "Mediator", "Strategy", "State"],
        "One global instance is Singleton; an ordered set of handlers each forwarding to the next is Chain of Responsibility.",
        ["Singleton", "Chain of Responsibility"]))
    S(scenario(
        "A plugin system loads third-party extensions that all implement a common Plugin interface; the concrete plugin class to instantiate is decided by subclasses of the host application. Each loaded plugin can additionally be wrapped to add logging around its calls without changing the plugin. Which design patterns best fit? Select 1 or more answers",
        ["Factory Method", "Decorator"],
        ["Abstract Factory", "Proxy", "Bridge", "Observer", "Memento", "Composite"],
        "Letting subclasses decide which concrete product to create is Factory Method; transparently wrapping to add behavior is Decorator.",
        ["Factory Method", "Decorator"]))
    S(scenario(
        "A multi-tenant SaaS app must hold exactly one configuration object per running instance, and that configuration must be assembled step by step from many optional settings to avoid a giant telescoping constructor. Which design patterns best fit? Select 1 or more answers",
        ["Singleton", "Builder"],
        ["Prototype", "Factory Method", "Facade", "Adapter", "State", "Flyweight"],
        "One config per instance is Singleton; assembling a complex object via a step-by-step fluent API is Builder.",
        ["Singleton", "Builder"]))
    S(scenario(
        "A report-generation module always follows the same fixed steps — fetch data, format, export — and this order must never change, although the formatting and export steps differ per report type. Optionally, a watermark and a header can be layered on top of any report without altering the core flow. Which design patterns best fit? Select 1 or more answers",
        ["Template Method", "Decorator"],
        ["Strategy", "Builder", "Observer", "Command", "Proxy", "Composite"],
        "A fixed algorithm skeleton with overridable steps is Template Method; optional add-ons layered without touching the core flow are Decorator.",
        ["Template Method", "Decorator"]))
    S(scenario(
        "Your app integrates a third-party payment gateway whose API does not match your internal PaymentService interface, so you must wrap it without changing your existing code. In addition, before any charge is sent you must run a local fraud check that can block the request before it reaches the gateway. Which design patterns best fit? Select 1 or more answers",
        ["Adapter", "Proxy"],
        ["Facade", "Bridge", "Decorator", "Observer", "Command", "Strategy"],
        "Wrapping a mismatched third-party API behind your expected interface is Adapter; intercepting and possibly blocking the call locally is Proxy.",
        ["Adapter", "Proxy"]))
    S(scenario(
        "A document editor must support unlimited undo/redo by capturing snapshots of the document's state and restoring them later, and each editing operation (insert, delete, format) must be encapsulated as an object. Which design patterns best fit? Select 1 or more answers",
        ["Memento", "Command"],
        ["State", "Observer", "Prototype", "Strategy", "Visitor", "Composite"],
        "Capturing and restoring state snapshots is Memento; encapsulating each edit as an object (also enabling undo) is Command.",
        ["Memento", "Command"]))
    S(scenario(
        "A caching layer should sit in front of a slow database, returning cached results when possible and only querying the database on a miss, transparently to the client which still uses the same Repository interface. Which single design pattern is the most appropriate?",
        ["Proxy"],
        ["Decorator", "Adapter", "Facade", "Observer", "Flyweight"],
        "A surrogate that controls access to the real object (here adding caching) while keeping the same interface is Proxy.",
        ["Proxy"]))
    S(scenario(
        "A thermostat in a smart-home app behaves completely differently depending on whether it is in Heating, Cooling or Off mode, and pressing the same button causes different transitions in each mode. Which single design pattern is the most appropriate?",
        ["State"],
        ["Strategy", "Observer", "Command", "Template Method", "Chain of Responsibility"],
        "An object that changes its behavior as its internal mode changes, appearing to change class, is the State pattern.",
        ["State"]))
    S(scenario(
        "A drawing application must render the same shapes on multiple platforms (OpenGL, DirectX, SVG), and you want the shape abstraction and the rendering implementation to evolve independently without a class explosion. Which single design pattern is the most appropriate?",
        ["Bridge"],
        ["Adapter", "Strategy", "Decorator", "Composite", "Facade"],
        "Decoupling an abstraction (shape) from its implementation (renderer) so both vary independently is the Bridge pattern.",
        ["Bridge"]))
    S(scenario(
        "An air-traffic control simulation has many aircraft that must coordinate, but you want to avoid every aircraft holding direct references to every other; instead they communicate through a central control tower. Which single design pattern is the most appropriate?",
        ["Mediator"],
        ["Observer", "Facade", "Chain of Responsibility", "Proxy", "Command"],
        "Centralising many-to-many communication through one coordinator object to reduce coupling is the Mediator pattern.",
        ["Mediator"]))
    S(scenario(
        "A music player must let users iterate through the current playlist (next/previous) without exposing how the tracks are stored internally, and must let users switch the play order algorithm (sequential, shuffle, repeat) at runtime. Which design patterns best fit? Select 1 or more answers",
        ["Iterator", "Strategy"],
        ["Observer", "State", "Composite", "Command", "Memento", "Facade"],
        "Sequential access without exposing internal storage is Iterator; runtime-swappable ordering algorithms are Strategy.",
        ["Iterator", "Strategy"]))
    S(scenario(
        "A reporting tool must add a new export operation (to XML, then later to LaTeX) across an existing hierarchy of document-element classes (paragraph, table, image) WITHOUT modifying those element classes each time a new export format is added. Which single design pattern is the most appropriate?",
        ["Visitor"],
        ["Strategy", "Decorator", "Template Method", "Composite", "Command"],
        "Adding new operations over a fixed set of element classes without changing them is the Visitor pattern (double dispatch).",
        ["Visitor"]))
    S(scenario(
        "A simple calculator app must parse and evaluate arithmetic expressions written in a small custom language such as '3 + 4 * 2'. Which single design pattern is most associated with defining and evaluating such a grammar?",
        ["Interpreter"],
        ["Visitor", "Composite", "Strategy", "Command", "Iterator"],
        "Defining a grammar and an evaluator for sentences in a small language is the Interpreter pattern.",
        ["Interpreter"]))
    S(scenario(
        "An expense-approval workflow escalates a request up a chain: a team lead can approve up to $1,000, a manager up to $10,000, and a director above that; the first level with sufficient authority handles it. Which single design pattern is the most appropriate?",
        ["Chain of Responsibility"],
        ["Command", "Strategy", "State", "Mediator", "Observer"],
        "Passing a request along a chain until a handler with enough authority processes it is Chain of Responsibility.",
        ["Chain of Responsibility"]))
    S(scenario(
        "A travel-booking site must offer one simple bookTrip() call that internally coordinates separate flight, hotel and car-rental subsystems, hiding their complexity from the client. Which single design pattern is the most appropriate?",
        ["Facade"],
        ["Mediator", "Adapter", "Composite", "Proxy", "Bridge"],
        "A single unified interface that hides a complex subsystem is the Facade pattern.",
        ["Facade"]))
    S(scenario(
        "A coffee-shop ordering system starts from a base beverage and lets customers stack any number of optional add-ons (milk, syrup, whipped cream), each adding to the price and description, in any combination. Which single design pattern is the most appropriate?",
        ["Decorator"],
        ["Builder", "Composite", "Strategy", "Factory Method", "Prototype"],
        "Dynamically stacking optional responsibilities onto a base object by wrapping is the Decorator pattern.",
        ["Decorator"]))
    S(scenario(
        "A database access library must ensure that only one connection pool object exists across the entire application, lazily created the first time it is requested. Which single design pattern is the most appropriate?",
        ["Singleton"],
        ["Factory Method", "Prototype", "Builder", "Flyweight", "Facade"],
        "Guaranteeing a single, globally accessible, lazily created instance is the Singleton pattern.",
        ["Singleton"]))
    S(scenario(
        "An IoT platform receives raw readings from many sensor vendors, each with an incompatible SDK, but the analytics engine expects one common SensorReading interface. The platform must also keep exactly one MQTT broker client. Which design patterns best fit? Select 1 or more answers",
        ["Adapter", "Singleton"],
        ["Bridge", "Facade", "Observer", "Decorator", "Prototype", "Composite"],
        "Wrapping each vendor SDK to the common interface is Adapter; the single shared broker client is Singleton.",
        ["Adapter", "Singleton"]))
    S(scenario(
        "A UI theming engine must create coordinated sets of components for several themes (Material, Cupertino, Fluent), and the whole app must obtain its theme objects from a single theme manager that exists only once. Which design patterns best fit? Select 1 or more answers",
        ["Abstract Factory", "Singleton"],
        ["Factory Method", "Builder", "Decorator", "Bridge", "State", "Flyweight"],
        "Coordinated families of theme components are Abstract Factory; one theme manager instance is Singleton.",
        ["Abstract Factory", "Singleton"]))
    S(scenario(
        "In a vending-machine controller, the same coin-insert and button-press events must behave differently depending on whether the machine is Idle, HasMoney, Dispensing or SoldOut, with explicit transitions between these modes. Which single design pattern is the most appropriate?",
        ["State"],
        ["Strategy", "Command", "Chain of Responsibility", "Observer", "Template Method"],
        "Behavior that changes with an explicit internal mode plus defined transitions is the State pattern.",
        ["State"]))
    S(scenario(
        "A game must spawn many enemies that are near-identical to a heavily configured prototype, copying it rather than re-running expensive setup each time. Which single design pattern is the most appropriate?",
        ["Prototype"],
        ["Factory Method", "Builder", "Singleton", "Flyweight", "Abstract Factory"],
        "Creating new objects by cloning a configured instance is the Prototype pattern.",
        ["Prototype"]))
    S(scenario(
        "A shape-drawing tool must create shape objects based on a string type read from a file ('circle', 'square'), centralising the creation logic in one place even though it is not a full GoF creational pattern. Which single approach is described?",
        ["Simple Factory"],
        ["Abstract Factory", "Builder", "Prototype", "Decorator", "Bridge"],
        "Centralising creation in one method/class that switches on a parameter is the Simple Factory idiom.",
        ["Simple Factory"]))
    S(scenario(
        "An order-processing pipeline must run a fixed sequence — validate payment, register order, ship — identical for every order type, but a notification to a courier should optionally be added on top without modifying the pipeline. Which design patterns best fit? Select 1 or more answers",
        ["Template Method", "Decorator"],
        ["Strategy", "Chain of Responsibility", "Observer", "Command", "Adapter", "State"],
        "The fixed step sequence is Template Method; the optional courier add-on layered on top is Decorator.",
        ["Template Method", "Decorator"]))
    S(scenario(
        "A spreadsheet must recalculate and visually update many dependent cells and charts the instant a source cell changes. Which single design pattern is the most appropriate?",
        ["Observer"],
        ["Mediator", "Command", "State", "Strategy", "Chain of Responsibility"],
        "Automatically updating many dependents when one subject changes is the Observer pattern.",
        ["Observer"]))
    S(scenario(
        "A text editor must let the user invoke 'Save', 'Print' and 'Bold' both from menu items and toolbar buttons, decoupling the widget that triggers the action from the object that performs it, and supporting macro recording. Which single design pattern is the most appropriate?",
        ["Command"],
        ["Observer", "Strategy", "Mediator", "State", "Memento"],
        "Encapsulating a request as a first-class object decoupled from its invoker (and enabling macros/undo) is the Command pattern.",
        ["Command"]))
    S(scenario(
        "An image gallery must avoid loading large image files until they actually become visible on screen, substituting a lightweight placeholder that loads the real image on first display. Which single design pattern is the most appropriate?",
        ["Proxy"],
        ["Decorator", "Flyweight", "Adapter", "Facade", "Composite"],
        "A virtual proxy stands in for an expensive object and creates it on demand — the (virtual) Proxy pattern.",
        ["Proxy"]))

    # =====================================================================
    # B) "Which pattern is this code?" (code -> pattern name)
    # =====================================================================
    def codepat(code, correct, distractors, expl, tags):
        opts = [correct] + distractors
        return mc(f"Which design pattern does the following code implement?", opts, [correct], expl, code=code, tags=tags)

    S(codepat(
        "class Config {\n  private static Config instance;\n  private Config() {}\n  public static Config get() {\n    if (instance == null) instance = new Config();\n    return instance;\n  }\n}",
        "Singleton", ["Factory Method", "Prototype", "Builder", "Facade"],
        "Private constructor + static field + static accessor returning the one instance is Singleton.", ["Singleton"]))
    S(codepat(
        "class Burger {\n  private Burger(B b){}\n  static class B {\n    B addCheese(){ return this; }\n    B addBacon(){ return this; }\n    Burger build(){ return new Burger(this); }\n  }\n}",
        "Builder", ["Prototype", "Factory Method", "Decorator", "Singleton"],
        "A nested builder whose methods return this and end in build() is the Builder pattern.", ["Builder"]))
    S(codepat(
        "interface Shape { void draw(); }\nclass RedShapeDecorator implements Shape {\n  private Shape decorated;\n  RedShapeDecorator(Shape s){ decorated = s; }\n  public void draw(){ decorated.draw(); setRedBorder(); }\n  private void setRedBorder(){}\n}",
        "Decorator", ["Adapter", "Proxy", "Composite", "Bridge"],
        "Implementing the same interface, holding a wrapped instance, and adding behavior around the delegated call is Decorator.", ["Decorator"]))
    S(codepat(
        "interface Target { void request(); }\nclass Adaptee { void specificRequest(){} }\nclass Ad implements Target {\n  private Adaptee a = new Adaptee();\n  public void request(){ a.specificRequest(); }\n}",
        "Adapter", ["Decorator", "Proxy", "Facade", "Bridge"],
        "Implementing the target interface while delegating to a wrapped adaptee with a different method name is Adapter.", ["Adapter"]))
    S(codepat(
        "class Subject {\n  private List<Observer> obs = new ArrayList<>();\n  void add(Observer o){ obs.add(o); }\n  void fire(){ for (Observer o : obs) o.update(); }\n}",
        "Observer", ["Mediator", "Command", "Chain of Responsibility", "Visitor"],
        "Maintaining a subscriber list and calling update() on each is the Observer pattern.", ["Observer"]))
    S(codepat(
        "abstract class Game {\n  final void play(){ start(); run(); end(); }\n  abstract void start();\n  abstract void run();\n  abstract void end();\n}",
        "Template Method", ["Strategy", "State", "Builder", "Factory Method"],
        "A final method that calls abstract steps subclasses fill in is Template Method.", ["Template Method"]))
    S(codepat(
        "class Context {\n  private Strategy s;\n  void set(Strategy s){ this.s = s; }\n  int run(int a,int b){ return s.exec(a,b); }\n}",
        "Strategy", ["State", "Command", "Template Method", "Observer"],
        "Holding a replaceable algorithm interface and delegating to it at runtime is Strategy.", ["Strategy"]))
    S(codepat(
        "class Light { void on(){} }\nclass LightOn implements Command {\n  private Light l;\n  LightOn(Light l){ this.l = l; }\n  public void execute(){ l.on(); }\n}",
        "Command", ["Strategy", "Observer", "State", "Adapter"],
        "Wrapping a receiver and its action behind execute() is the Command pattern.", ["Command"]))
    S(codepat(
        "class TreeFactory {\n  static Map<String,TreeType> cache = new HashMap<>();\n  static TreeType get(String k){\n    return cache.computeIfAbsent(k, TreeType::new);\n  }\n}",
        "Flyweight", ["Singleton", "Prototype", "Proxy", "Builder"],
        "Caching and reusing shared immutable objects keyed by intrinsic state is Flyweight.", ["Flyweight"]))
    S(codepat(
        "abstract class Handler {\n  Handler next;\n  void handle(int n){\n    if (n < 10) System.out.println(\"ok\");\n    else if (next != null) next.handle(n);\n  }\n}",
        "Chain of Responsibility", ["Decorator", "Composite", "Command", "Mediator"],
        "Each handler either processes the request or forwards it to the next link — Chain of Responsibility.", ["Chain of Responsibility"]))
    S(codepat(
        "interface Graphic { void draw(); }\nclass Group implements Graphic {\n  private List<Graphic> children = new ArrayList<>();\n  public void draw(){ for (Graphic g : children) g.draw(); }\n}",
        "Composite", ["Decorator", "Iterator", "Visitor", "Bridge"],
        "A container that implements the same interface as its parts and recurses over children is Composite.", ["Composite"]))
    S(codepat(
        "class Editor {\n  String text;\n  Memento save(){ return new Memento(text); }\n  void restore(Memento m){ text = m.get(); }\n}",
        "Memento", ["Command", "State", "Prototype", "Observer"],
        "Snapshotting state into a separate object for later restore is the Memento pattern.", ["Memento"]))
    S(codepat(
        "class ProtoCell implements Cloneable {\n  public ProtoCell copy(){\n    try { return (ProtoCell) super.clone(); }\n    catch (CloneNotSupportedException e){ return null; }\n  }\n}",
        "Prototype", ["Factory Method", "Builder", "Singleton", "Memento"],
        "Producing copies via clone()/super.clone() is the Prototype pattern.", ["Prototype"]))
    S(codepat(
        "class ImageProxy implements Image {\n  private RealImage real;\n  private String file;\n  public void display(){\n    if (real == null) real = new RealImage(file);\n    real.display();\n  }\n}",
        "Proxy", ["Decorator", "Adapter", "Flyweight", "Facade"],
        "A stand-in implementing the same interface that lazily creates and forwards to the real object is a (virtual) Proxy.", ["Proxy"]))
    S(codepat(
        "class Computer {\n  private CPU cpu = new CPU();\n  private Disk disk = new Disk();\n  public void start(){ cpu.boot(); disk.spinUp(); }\n}",
        "Facade", ["Mediator", "Composite", "Adapter", "Bridge"],
        "One class offering a simple method that orchestrates several subsystem objects is a Facade.", ["Facade"]))

    # =====================================================================
    # C) SOLID — identify the violation (code)
    # =====================================================================
    def solidv(code, correct, expl):
        return mc("Which SOLID principle does the following code violate?",
                  ["SRP", "OCP", "LSP", "ISP", "DIP"], [correct], expl, code=code, tags=["SOLID", correct])

    S(solidv(
        "class Invoice {\n  void calculateTotal(){}\n  void saveToDatabase(){}\n  void printInvoice(){}\n}",
        "SRP", "Invoice mixes business calculation, persistence and printing — three separate reasons to change."))
    S(solidv(
        "class AreaCalculator {\n  double area(Object shape){\n    if (shape instanceof Circle) return 3.14;\n    else if (shape instanceof Square) return 1.0;\n    return 0;\n  }\n}",
        "OCP", "Adding a new shape forces editing this method; it is not closed for modification."))
    S(solidv(
        "class Bird { void fly(){} }\nclass Ostrich extends Bird {\n  void fly(){ throw new UnsupportedOperationException(); }\n}",
        "LSP", "An Ostrich cannot be substituted for a Bird because it breaks the inherited fly() contract."))
    S(solidv(
        "interface Worker {\n  void work();\n  void eat();\n}\nclass Robot implements Worker {\n  public void work(){}\n  public void eat(){ /* robots don't eat */ }\n}",
        "ISP", "Robot is forced to implement eat(), a method it does not need — the interface is too fat."))
    S(solidv(
        "class NotificationService {\n  private MySqlDatabase db = new MySqlDatabase();\n  void notifyUser(){ db.save(); }\n}",
        "DIP", "The high-level service depends directly on a concrete MySqlDatabase instead of an abstraction."))
    S(solidv(
        "class User {\n  void changePassword(){}\n  void generateMonthlyReport(){}\n  void sendNewsletter(){}\n}",
        "SRP", "User mixes account management, reporting and marketing — unrelated responsibilities."))
    S(solidv(
        "class Rectangle {\n  int w, h;\n  void setWidth(int w){ this.w = w; }\n  void setHeight(int h){ this.h = h; }\n}\nclass Square extends Rectangle {\n  void setWidth(int w){ this.w = w; this.h = w; }\n  void setHeight(int h){ this.w = h; this.h = h; }\n}",
        "LSP", "Square changes the meaning of setWidth/setHeight, so code relying on Rectangle's behavior breaks."))
    S(solidv(
        "class PaymentProcessor {\n  void process(String type){\n    switch(type){ case \"card\": break; case \"paypal\": break; }\n  }\n}",
        "OCP", "Each new payment method requires modifying the switch instead of extending via new classes."))
    S(solidv(
        "interface MultiFunctionDevice {\n  void print();\n  void scan();\n  void fax();\n  void staple();\n}\nclass BudgetPrinter implements MultiFunctionDevice {\n  public void print(){}\n  public void scan(){}\n  public void fax(){}\n  public void staple(){}\n}",
        "ISP", "A budget printer is forced to depend on scan/fax/staple it cannot perform; split the interface."))
    S(solidv(
        "class ReportGenerator {\n  private FileLogger logger = new FileLogger();\n  void run(){ logger.log(\"done\"); }\n}",
        "DIP", "ReportGenerator is hard-wired to a concrete FileLogger rather than a Logger abstraction."))

    # SOLID — identify the fix
    S(mc("Which change best fixes the Open/Closed violation in a draw() method that uses 'if (shape instanceof Circle) ... else if (shape instanceof Square) ...'? Select 1 or more answers",
         ["Give each shape a draw() method and call shape.draw() polymorphically",
          "Define an abstract Shape with an abstract draw() that each subclass implements",
          "Add another else-if branch for every new shape",
          "Use a giant switch on a shape-type string instead of instanceof",
          "Make the method longer but keep the type checks"],
         ["Give each shape a draw() method and call shape.draw() polymorphically",
          "Define an abstract Shape with an abstract draw() that each subclass implements"],
         "OCP is satisfied by polymorphism: new shapes extend the hierarchy without editing existing code. More branches/switches keep violating it.",
         tags=["SOLID", "OCP"]))
    S(mc("A Service class does 'new MySqlRepository()' internally. Which change best restores the Dependency Inversion Principle?",
         ["Inject a Repository abstraction through the constructor",
          "Make MySqlRepository a singleton",
          "Move the new MySqlRepository() call into a static block",
          "Mark the field as final"],
         ["Inject a Repository abstraction through the constructor"],
         "DIP: depend on an injected abstraction, not a concrete class created internally.",
         tags=["SOLID", "DIP"]))

    # =====================================================================
    # D) Coverage calculation
    # =====================================================================
    cov_opts = ["100% Statement Coverage, 100% Branch Coverage",
                "50% Statement Coverage, 50% Branch Coverage",
                "100% Statement Coverage, 50% Branch Coverage",
                "75% Statement Coverage, 50% Branch Coverage",
                "0% Statement Coverage, 0% Branch Coverage"]
    S(mc("Considering only the test shown, what coverage does it achieve?",
         cov_opts, ["50% Statement Coverage, 50% Branch Coverage"],
         "discount(150) takes only the true branch: the if and 'return 20' run (2 of 4 statements), and 1 of 2 branches.",
         code="public int discount(int qty) {\n  if (qty > 100) {\n    return 20;\n  }\n  System.out.println(\"no discount\");\n  return 0;\n}\n\n@Test\npublic void t() {\n  assertEquals(20, discount(150));\n}",
         tags=["Coverage"]))
    S(mc("Considering only the test shown, what coverage does it achieve?",
         cov_opts, ["100% Statement Coverage, 100% Branch Coverage"],
         "Calling discount(150) and discount(50) executes every statement and both branch outcomes.",
         code="public int discount(int qty) {\n  if (qty > 100) {\n    return 20;\n  }\n  System.out.println(\"no discount\");\n  return 0;\n}\n\n@Test\npublic void t() {\n  assertEquals(20, discount(150));\n  assertEquals(0, discount(50));\n}",
         tags=["Coverage"]))
    S(mc("Considering only the test shown, what coverage does it achieve for greet()?",
         cov_opts, ["100% Statement Coverage, 50% Branch Coverage"],
         "greet(true) runs all three statements (100% statement) but only the true outcome of the if (50% branch).",
         code="public void greet(boolean vip) {\n  System.out.println(\"hello\");\n  if (vip) {\n    System.out.println(\"welcome VIP\");\n  }\n}\n\n@Test\npublic void t() {\n  greet(true);\n}",
         tags=["Coverage"]))
    S(mc("Considering only the test shown, what STATEMENT coverage does it achieve for abs()?",
         ["50%", "100%", "66%", "0%"], ["50%"],
         "abs(-3) executes the if and 'return -x' (2 of 4 statements); 'return x' and the trailing line never run.",
         code="public int abs(int x) {\n  if (x < 0) {\n    return -x;\n  }\n  int y = x;\n  return y;\n}\n\n@Test\npublic void t() {\n  assertEquals(3, abs(-3));\n}",
         tags=["Coverage"]))

    # =====================================================================
    # E) Cyclomatic complexity
    # =====================================================================
    def cyc(code, n, expl):
        opts = ["1", "2", "3", "4", "5"]
        return mc("What is the cyclomatic complexity (McCabe) of the following method?",
                  opts, [str(n)], expl, code=code, tags=["Cyclomatic"])
    S(cyc("public int f(int x) {\n  if (x > 0) {\n    if (x > 10) {\n      return 2;\n    }\n    return 1;\n  }\n  return 0;\n}", 3,
          "Two decision points (two ifs) → V(G) = 2 + 1 = 3."))
    S(cyc("public boolean valid(int a, int b) {\n  if (a > 0 && b > 0) {\n    return true;\n  }\n  return false;\n}", 3,
          "One if plus one && (each predicate counts) → 2 + 1 = 3."))
    S(cyc("public int count(int[] a) {\n  int c = 0;\n  for (int x : a) {\n    if (x % 2 == 0) {\n      c++;\n    }\n  }\n  return c;\n}", 3,
          "One for and one if → 2 decision points + 1 = 3."))
    S(cyc("public int price(int z) {\n  switch (z) {\n    case 1: return 10;\n    case 2: return 20;\n    case 3: return 30;\n    default: return 0;\n  }\n}", 4,
          "Three case labels are three decision points → 3 + 1 = 4."))
    S(cyc("public int add(int a, int b) {\n  return a + b;\n}", 1,
          "No decision points → V(G) = 0 + 1 = 1."))

    # =====================================================================
    # F) Boundary value analysis / equivalence partitioning
    # =====================================================================
    S(mc("A field accepts integer ages from 18 to 65 inclusive. Which values are the correct BOUNDARY values to test? Select 1 or more answers",
         ["17", "18", "65", "66", "40"],
         ["17", "18", "65", "66"],
         "Boundary testing uses the edges and just-outside values: 17/18 at the lower edge and 65/66 at the upper edge. 40 is a mid-range (typical) value.",
         tags=["Boundary"]))
    S(mc("A discount applies only when the cart total is strictly greater than 100. Which are good BOUNDARY test values around the threshold? Select 1 or more answers",
         ["99", "100", "101", "250", "0"],
         ["99", "100", "101"],
         "The interesting edge is 100: test 99 (below), 100 (on the boundary, should NOT discount) and 101 (just above, should discount).",
         tags=["Boundary"]))
    S(mc("Using equivalence partitioning for a function validating a percentage (0–100), which set best represents one value per valid/invalid partition?",
         ["-5, 50, 150", "0, 50, 100", "50, 51, 52", "1, 2, 3"],
         ["-5, 50, 150"],
         "Equivalence partitioning picks one representative per class: an invalid-low (-5), a valid mid (50) and an invalid-high (150).",
         tags=["Equivalence"]))
    S(mc("Which statements about boundary value analysis are TRUE? Select 1 or more answers",
         ["It focuses on values at the edges of input ranges",
          "It typically tests min, min+1, max-1 and max",
          "It replaces the need for any equivalence partitioning",
          "It is a black-box technique",
          "It only applies to string inputs"],
         ["It focuses on values at the edges of input ranges",
          "It typically tests min, min+1, max-1 and max",
          "It is a black-box technique"],
         "BVA is a black-box technique targeting range edges; it complements (does not replace) equivalence partitioning and is not limited to strings.",
         tags=["Boundary"]))
    S(mc("Given getGrade(int score) where score is valid in 0..100, which inputs are BOUNDARY values? Select 1 or more answers",
         ["getGrade(0)", "getGrade(100)", "getGrade(-1)", "getGrade(101)", "getGrade(73)"],
         ["getGrade(0)", "getGrade(100)", "getGrade(-1)", "getGrade(101)"],
         "0 and 100 are the valid edges; -1 and 101 are just outside. 73 is an ordinary interior value.",
         tags=["Boundary"]))

    # =====================================================================
    # G) JUnit lifecycle / annotations
    # =====================================================================
    S(mc("What is the printed output when this JUnit 4 class runs (two test methods, runner order test1 then test2)?",
         ["ACDCDB", "ABCD", "ACCDDB", "CADCDB", "ACDB"],
         ["ACDCDB"],
         "@BeforeClass (A) once; for each test @Before (C) then @After (D); @AfterClass (B) once → A C D C D B.",
         code="@BeforeClass static void a(){ print(\"A\"); }\n@AfterClass  static void b(){ print(\"B\"); }\n@Before      void c(){ print(\"C\"); }\n@After       void d(){ print(\"D\"); }\n@Test void test1(){}\n@Test void test2(){}",
         tags=["JUnit4 lifecycle"]))
    S(mc("In this JUnit 4 class, test2 is annotated @Ignore. What is printed (runner order test1, test2, test3)?",
         ["ACDCDB", "ACDCDCDB", "ACDB", "ABABAB"],
         ["ACDCDB"],
         "@Ignore skips test2 entirely, so only test1 and test3 get their C…D wrapper: A, then C D twice, then B.",
         code="@BeforeClass static void a(){ print(\"A\"); }\n@AfterClass  static void b(){ print(\"B\"); }\n@Before      void c(){ print(\"C\"); }\n@After       void d(){ print(\"D\"); }\n@Test void test1(){}\n@Ignore @Test void test2(){}\n@Test void test3(){}",
         tags=["JUnit4 lifecycle"]))
    S(mc("Which JUnit 4 annotation makes a test pass only if a specific exception is thrown?",
         ["@Test(expected = IllegalArgumentException.class)", "@Test(timeout = 1000)",
          "@Throws(IllegalArgumentException.class)", "@Before", "@Rule"],
         ["@Test(expected = IllegalArgumentException.class)"],
         "@Test(expected=...) declares the exception the test must throw to pass.",
         tags=["JUnit4 lifecycle", "Error condition"]))
    S(mc("In JUnit 5, which annotation replaces JUnit 4's @Before?",
         ["@BeforeEach", "@BeforeAll", "@BeforeClass", "@Setup"],
         ["@BeforeEach"],
         "JUnit 5 renamed @Before to @BeforeEach (run before every test).",
         tags=["JUnit5"]))
    S(mc("Which statements about JUnit 5 are TRUE? Select 1 or more answers",
         ["@BeforeAll and @AfterAll must be static (unless the test instance lifecycle is PER_CLASS)",
          "@DisplayName gives a test a custom readable name",
          "@ParameterizedTest runs a test with multiple argument sets",
          "@Ignore is the standard way to skip a test in JUnit 5",
          "@Test must declare an expected exception via expected="],
         ["@BeforeAll and @AfterAll must be static (unless the test instance lifecycle is PER_CLASS)",
          "@DisplayName gives a test a custom readable name",
          "@ParameterizedTest runs a test with multiple argument sets"],
         "JUnit 5 uses @Disabled (not @Ignore) and assertThrows (not expected=); the other three statements are correct.",
         tags=["JUnit5"]))
    S(mc("You must open one expensive database connection shared by all tests in a JUnit 4 class. Which annotation is optimal?",
         ["@BeforeClass", "@Before", "@Test", "@AfterClass"],
         ["@BeforeClass"],
         "@BeforeClass runs once before all tests (static), ideal for a shared expensive setup; @Before would reconnect per test.",
         tags=["JUnit4 lifecycle"]))
    S(mc("Which JUnit 5 assertion is the idiomatic way to verify that code throws an exception?",
         ["assertThrows(IllegalStateException.class, () -> svc.run())",
          "@Test(expected = IllegalStateException.class)",
          "assertEquals(IllegalStateException.class, svc.run())",
          "assertTrue(svc.run() throws)"],
         ["assertThrows(IllegalStateException.class, () -> svc.run())"],
         "JUnit 5 uses assertThrows with a lambda; expected= is the older JUnit 4 mechanism.",
         tags=["JUnit5", "Assertions", "Error condition"]))

    # =====================================================================
    # H) Test doubles / smells / FIRST / cardinality / assertions
    # =====================================================================
    S(mc("Which test double returns canned, predefined values but performs no verification of the calls made to it?",
         ["Stub", "Mock", "Spy", "Dummy", "Fake"],
         ["Stub"],
         "A stub supplies predefined answers; a mock additionally verifies interactions.",
         tags=["Test doubles"]))
    S(mc("Which statement best distinguishes a Mock from a Stub?",
         ["A mock verifies the interactions/expectations; a stub only returns canned data",
          "A stub verifies expectations; a mock only returns canned data",
          "They are identical",
          "A mock is always a real object; a stub is always fake"],
         ["A mock verifies the interactions/expectations; a stub only returns canned data"],
         "The key difference is behavior verification: mocks assert how they were called, stubs do not.",
         tags=["Test doubles"]))
    S(mc("Which is a lightweight working implementation (e.g., an in-memory database) used in place of a real dependency?",
         ["Fake", "Dummy", "Stub", "Mock"],
         ["Fake"],
         "A fake is a real but simplified implementation, such as an in-memory DB.",
         tags=["Test doubles"]))
    S(mc("According to the FIRST principles, which statement is FALSE?",
         ["Unit tests may depend on the execution order of other tests",
          "Unit tests should be fast",
          "Unit tests should be repeatable with the same result",
          "Unit tests should be self-validating (auto pass/fail)",
          "Unit tests should be independent of one another"],
         ["Unit tests may depend on the execution order of other tests"],
         "FIRST requires Independent tests: order must not affect the result, so that statement is false.",
         tags=["FIRST"]))
    S(mc("A test calls push() then pop() then asserts the popped value, then also asserts the stack is empty, then resizes it and asserts again — all in one method. Which test smell is this?",
         ["The test asserts multiple unrelated behaviors in one test (eager/obscure test)",
          "It is a boundary test",
          "It is a perfect single-responsibility test",
          "It is a parameterized test"],
         ["The test asserts multiple unrelated behaviors in one test (eager/obscure test)"],
         "Bundling many unrelated assertions/behaviors into one test is a classic test smell (eager test) that hurts clarity and isolation.",
         tags=["Test smells"]))
    S(mc("A unit test reads its expected values from a live production database. Which FIRST principles does this most directly threaten? Select 1 or more answers",
         ["Repeatable", "Fast", "Independent", "Self-validating", "Timely"],
         ["Repeatable", "Fast", "Independent"],
         "External live data makes the test slow, non-repeatable, and dependent on outside state; it can still auto-assert (self-validating).",
         tags=["FIRST"]))
    S(mc("A method computeAverage() divides the sum of grades by their count. Which test exercises the most important CARDINALITY edge case?",
         ["Calling it on a student with zero grades (count == 0)",
          "Calling it with 1000 grades",
          "Calling it twice in a row",
          "Calling it on another thread"],
         ["Calling it on a student with zero grades (count == 0)"],
         "Cardinality testing checks the 0/1/many cases; the 0-element case (division by zero) is the critical edge.",
         tags=["Cardinality"]))
    S(mc("Which JUnit assertion correctly checks that two double values are equal within a tolerance?",
         ["assertEquals(expected, actual, 0.0001)",
          "assertEquals(expected, actual)",
          "assertTrue(expected == actual)",
          "assertSame(expected, actual)"],
         ["assertEquals(expected, actual, 0.0001)"],
         "Floating-point equality needs the delta/tolerance overload of assertEquals.",
         tags=["Assertions"]))
    S(mc("Which assertions check object identity vs. logical equality respectively?",
         ["assertSame checks identity; assertEquals checks logical equality",
          "assertEquals checks identity; assertSame checks logical equality",
          "Both check identity",
          "Both check logical equality"],
         ["assertSame checks identity; assertEquals checks logical equality"],
         "assertSame compares references (==); assertEquals uses equals() for logical equality.",
         tags=["Assertions"]))
    S(mc("Which case is a typical ERROR-CONDITION test rather than a normal-path test?",
         ["Passing null to a method and asserting it throws NullPointerException",
          "Passing valid data and asserting the correct result",
          "Measuring how fast the method runs",
          "Checking the value at the middle of a range"],
         ["Passing null to a method and asserting it throws NullPointerException"],
         "Error-condition testing deliberately supplies invalid input and verifies the failure behavior.",
         tags=["Error condition"]))

    # =====================================================================
    # I) Definitions / recall / comparison
    # =====================================================================
    S(mc("Which GoF category does the Decorator pattern belong to?",
         ["Structural", "Behavioral", "Creational", "Architectural"],
         ["Structural"],
         "Decorator is a structural pattern (it composes objects to add behavior).",
         tags=["Decorator"]))
    S(mc("Which of these are Creational design patterns? Select 1 or more answers",
         ["Singleton", "Factory Method", "Builder", "Observer", "Adapter", "Prototype"],
         ["Singleton", "Factory Method", "Builder", "Prototype"],
         "Singleton, Factory Method, Builder and Prototype are creational; Observer is behavioral and Adapter is structural.",
         tags=["Singleton", "Factory Method", "Builder", "Prototype"]))
    S(mc("Which of these are Behavioral design patterns? Select 1 or more answers",
         ["Observer", "Strategy", "Command", "Composite", "Facade", "Visitor"],
         ["Observer", "Strategy", "Command", "Visitor"],
         "Observer, Strategy, Command and Visitor are behavioral; Composite and Facade are structural.",
         tags=["Observer", "Strategy", "Command", "Visitor"]))
    S(mc("Strategy vs State: which statement is TRUE of the difference?",
         ["State usually triggers transitions between states; Strategy is just a swappable algorithm chosen by the client",
          "They are the same pattern",
          "Strategy objects always change each other; State never does",
          "State is a creational pattern; Strategy is structural"],
         ["State usually triggers transitions between states; Strategy is just a swappable algorithm chosen by the client"],
         "Structurally similar, but State models transitions between behaviors while Strategy is an interchangeable algorithm selected externally.",
         tags=["State", "Strategy"]))
    S(mc("Adapter vs Decorator: which statement is TRUE?",
         ["Adapter changes an object's interface; Decorator keeps the same interface and adds behavior",
          "Both change the interface",
          "Decorator changes the interface; Adapter keeps it the same",
          "Both are creational patterns"],
         ["Adapter changes an object's interface; Decorator keeps the same interface and adds behavior"],
         "Adapter converts an interface to a different expected one; Decorator preserves the interface and augments behavior.",
         tags=["Adapter", "Decorator"]))
    S(mc("Proxy vs Decorator: which statement is TRUE?",
         ["Proxy controls access to an object; Decorator adds responsibilities to it",
          "They are identical in intent",
          "Decorator controls access; Proxy adds responsibilities",
          "Both are behavioral patterns"],
         ["Proxy controls access to an object; Decorator adds responsibilities to it"],
         "Same wrapping structure, different intent: Proxy is about access control/laziness, Decorator about adding behavior.",
         tags=["Proxy", "Decorator"]))
    S(mc("Which problems can affect the Simple Factory shown? Select 1 or more answers",
         ["Adding a new product type requires modifying the factory (OCP)",
          "An unknown type string can silently return null",
          "Passing raw strings is not type-safe",
          "It guarantees a single instance of each product",
          "The if/switch chain grows unwieldy"],
         ["Adding a new product type requires modifying the factory (OCP)",
          "An unknown type string can silently return null",
          "Passing raw strings is not type-safe",
          "The if/switch chain grows unwieldy"],
         "Simple Factory centralises creation but couples new types to edits, risks null, is string-unsafe, and grows messy. It says nothing about single instances.",
         code="class ShapeFactory {\n  public Shape create(String type) {\n    if (type.equals(\"CIRCLE\")) return new Circle();\n    if (type.equals(\"SQUARE\")) return new Square();\n    return null;\n  }\n}",
         tags=["Simple Factory", "OCP"]))
    S(mc("Why is the template method commonly declared final in the Template Method pattern?",
         ["To stop subclasses from changing the algorithm's step order",
          "To improve runtime performance",
          "To allow subclasses to override the whole algorithm",
          "To make the class a singleton"],
         ["To stop subclasses from changing the algorithm's step order"],
         "final locks the skeleton; subclasses may only fill in the individual abstract steps.",
         tags=["Template Method"]))
    S(mc("What is the main problem with this lazy Singleton in a multithreaded program?",
         ["It is not thread-safe: two threads can both create an instance",
          "It violates the Liskov Substitution Principle",
          "It breaks encapsulation by exposing the field",
          "It cannot have a private constructor"],
         ["It is not thread-safe: two threads can both create an instance"],
         "The check-then-create is a race condition; without synchronization two threads can each create an instance.",
         code="public class Cfg {\n  private static Cfg instance;\n  private Cfg() {}\n  public static Cfg get() {\n    if (instance == null) instance = new Cfg();\n    return instance;\n  }\n}",
         tags=["Singleton"]))
    S(mc("Which technique makes the lazy Singleton getInstance() thread-safe while avoiding locking on every call? Select 1 or more answers",
         ["Double-checked locking with a volatile instance field",
          "Eager initialization of the static instance",
          "Using an enum singleton",
          "Removing the null check entirely",
          "Making the constructor public"],
         ["Double-checked locking with a volatile instance field",
          "Eager initialization of the static instance",
          "Using an enum singleton"],
         "Volatile double-checked locking, eager init, and enum singletons are all valid thread-safe approaches; removing the check or a public constructor break the pattern.",
         tags=["Singleton"]))
    S(mc("In a Flyweight, where should the extrinsic (context-specific) state be kept?",
         ["Outside the shared object, supplied by the client per call",
          "Inside the shared object as immutable fields",
          "In a global singleton",
          "It should be duplicated into every flyweight"],
         ["Outside the shared object, supplied by the client per call"],
         "Flyweight stores only shared intrinsic state internally and pushes extrinsic state out to the caller.",
         tags=["Flyweight"]))
    S(mc("Which GoF category is NOT one of the three defined in the Gang of Four book?",
         ["Architectural", "Creational", "Structural", "Behavioral"],
         ["Architectural"],
         "GoF defines Creational, Structural and Behavioral; Architectural is a separate, broader concept.",
         tags=["reference"]))
    S(mc("Which single principle states that high-level modules and low-level modules should both depend on abstractions?",
         ["Dependency Inversion Principle (DIP)", "Interface Segregation Principle (ISP)",
          "Open/Closed Principle (OCP)", "Liskov Substitution Principle (LSP)"],
         ["Dependency Inversion Principle (DIP)"],
         "That is the definition of the Dependency Inversion Principle.",
         tags=["SOLID", "DIP"]))
    S(mc("Path coverage is generally stronger (harder to fully achieve) than which of the following? Select 1 or more answers",
         ["Statement coverage", "Branch coverage", "100% test pass rate", "Code formatting"],
         ["Statement coverage", "Branch coverage"],
         "Path coverage subsumes branch coverage, which subsumes statement coverage; the others are unrelated.",
         tags=["Coverage"]))

    return qs


if __name__ == "__main__":
    print(len(build()))
