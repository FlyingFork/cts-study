"""drag_and_drop generators: real Java pattern skeletons with [[ZONE_n]] holes.
Each family is parameterised over domains; every zone has the correct token plus
plausible distractors. correctAnswers tokens are drawn from the same lists."""
from genlib import dnd


def fill(tpl, **kw):
    for k, v in kw.items():
        tpl = tpl.replace("{" + k + "}", v)
    return tpl


def build():
    qs = []

    # ---- Singleton -------------------------------------------------------
    SING = ["DatabaseConnection", "ConfigManager", "Logger", "CachePool",
            "AuditTrail", "IdGenerator", "ThreadPool"]
    tpl = ("public class {C} {\n"
           "  private static {C} instance;\n"
           "  [[ZONE_1]] {C}() {}\n"
           "  public [[ZONE_2]] {C} getInstance() {\n"
           "    if (instance == null) {\n"
           "      [[ZONE_3]] = new {C}();\n"
           "    }\n"
           "    return instance;\n"
           "  }\n"
           "}")
    for c in SING:
        qs.append(dnd(
            f"Fill in the blanks so that {c} is a correct (lazy) Singleton.",
            fill(tpl, C=c),
            {"ZONE_1": ["private", "public", "protected"],
             "ZONE_2": ["static", "final", "abstract"],
             "ZONE_3": ["instance", "this", c]},
            {"ZONE_1": "private", "ZONE_2": "static", "ZONE_3": "instance"},
            "Private constructor blocks outside instantiation, a static accessor lazily creates and returns the single instance.",
            tags=["Singleton"]))

    # ---- Adapter (object adapter) ---------------------------------------
    ADAPT = [("PaymentProcessor", "pay", "LegacyBank", "makePayment", "double", "amount"),
             ("MediaPlayer", "play", "Mp4Library", "decodeAndPlay", "String", "file"),
             ("Printer", "print", "OldPrinter", "printText", "String", "text"),
             ("Notifier", "send", "EmailLib", "deliverMail", "String", "msg"),
             ("Logger", "log", "Log4jLib", "writeLog", "String", "message"),
             ("DataExporter", "export", "CsvWriterOld", "writeCsv", "String", "data")]
    tpl = ("interface {NI} {\n"
           "  void {nm}({argT} {arg});\n"
           "}\n\n"
           "class {OC} {\n"
           "  void {om}({argT} value) { }\n"
           "}\n\n"
           "class {AD} implements [[ZONE_1]] {\n"
           "  private {OC} adaptee = new {OC}();\n"
           "  public void {nm}({argT} {arg}) {\n"
           "    [[ZONE_2]];\n"
           "  }\n"
           "}")
    for ni, nm, oc, om, at, an in ADAPT:
        ad = ni + "Adapter"
        qs.append(dnd(
            f"Complete the object Adapter so {ad} exposes {oc} through the {ni} interface.",
            fill(tpl, NI=ni, nm=nm, OC=oc, om=om, argT=at, arg=an, AD=ad),
            {"ZONE_1": [ni, oc, ad],
             "ZONE_2": [f"adaptee.{om}({an})", f"adaptee.{nm}({an})", f"this.{nm}({an})"]},
            {"ZONE_1": ni, "ZONE_2": f"adaptee.{om}({an})"},
            "The adapter implements the target interface and delegates to the adaptee's real method.",
            tags=["Adapter"]))

    # ---- Factory Method --------------------------------------------------
    FM = [("Dialog", "Button", "WindowsDialog", "WindowsButton"),
          ("Logistics", "Transport", "RoadLogistics", "Truck"),
          ("Cafe", "Beverage", "EspressoBar", "Espresso"),
          ("LevelFactory", "Enemy", "ForestLevel", "Goblin"),
          ("DocumentApp", "Document", "PdfApp", "PdfDocument"),
          ("NotificationCreator", "Notification", "SmsCreator", "SmsNotification")]
    tpl = ("abstract class {Cr} {\n"
           "  public [[ZONE_1]] {Pr} createProduct();\n"
           "  public void process() {\n"
           "    {Pr} p = createProduct();\n"
           "  }\n"
           "}\n\n"
           "class {CC} extends [[ZONE_2]] {\n"
           "  public {Pr} createProduct() {\n"
           "    return new [[ZONE_3]]();\n"
           "  }\n"
           "}")
    for cr, pr, cc, cp in FM:
        qs.append(dnd(
            f"Complete the Factory Method: {cc} must override the creator of {cr}.",
            fill(tpl, Cr=cr, Pr=pr, CC=cc, CP=cp),
            {"ZONE_1": ["abstract", "static", "final"],
             "ZONE_2": [cr, pr, cc],
             "ZONE_3": [cp, pr, cc]},
            {"ZONE_1": "abstract", "ZONE_2": cr, "ZONE_3": cp},
            "The creator declares an abstract factory method; the concrete creator extends it and returns the concrete product.",
            tags=["Factory Method"]))

    # ---- Observer --------------------------------------------------------
    OBS = [("Investor", "Stock"), ("Subscriber", "NewsAgency"), ("Display", "WeatherStation"),
           ("Listener", "Button"), ("Player", "GameServer")]
    tpl = ("interface {Ob} {\n"
           "  void update(String event);\n"
           "}\n\n"
           "class {Su} {\n"
           "  private List<[[ZONE_1]]> observers = new ArrayList<>();\n"
           "  public void subscribe({Ob} o) {\n"
           "    observers.add(o);\n"
           "  }\n"
           "  public void notifyObservers(String event) {\n"
           "    for ({Ob} o : observers) {\n"
           "      o.[[ZONE_2]];\n"
           "    }\n"
           "  }\n"
           "}")
    for ob, su in OBS:
        qs.append(dnd(
            f"Complete the Observer pattern where {su} notifies its {ob} objects.",
            fill(tpl, Ob=ob, Su=su),
            {"ZONE_1": [ob, su, "String"],
             "ZONE_2": ["update(event)", "subscribe(event)", "notifyObservers(event)"]},
            {"ZONE_1": ob, "ZONE_2": "update(event)"},
            "The subject keeps a list of observers and calls update() on each one when it changes.",
            tags=["Observer"]))

    # ---- Strategy --------------------------------------------------------
    STR = [("PaymentStrategy", "Checkout"), ("SortStrategy", "Sorter"),
           ("CompressionStrategy", "Compressor"), ("RouteStrategy", "Navigator"),
           ("DiscountStrategy", "Cart")]
    tpl = ("interface {St} {\n"
           "  int execute(int a, int b);\n"
           "}\n\n"
           "class {Ct} {\n"
           "  private {St} strategy;\n"
           "  public void setStrategy([[ZONE_1]] strategy) {\n"
           "    this.strategy = strategy;\n"
           "  }\n"
           "  public int run(int a, int b) {\n"
           "    return strategy.[[ZONE_2]];\n"
           "  }\n"
           "}")
    for st, ct in STR:
        qs.append(dnd(
            f"Complete the Strategy pattern: {ct} delegates to a swappable {st}.",
            fill(tpl, St=st, Ct=ct),
            {"ZONE_1": [st, ct, "int"],
             "ZONE_2": ["execute(a, b)", "run(a, b)", "setStrategy(a, b)"]},
            {"ZONE_1": st, "ZONE_2": "execute(a, b)"},
            "The context holds a strategy reference, lets it be replaced, and delegates the algorithm to it.",
            tags=["Strategy"]))

    # ---- Decorator -------------------------------------------------------
    DEC = [("Coffee", "SimpleCoffee", "CoffeeDecorator", "MilkDecorator", "Milk"),
           ("Beverage", "Tea", "BeverageDecorator", "HoneyDecorator", "Honey"),
           ("TextView", "PlainText", "TextDecorator", "BoldDecorator", "Bold"),
           ("Notifier", "BaseNotifier", "NotifierDecorator", "SlackDecorator", "Slack"),
           ("DataSource", "FileSource", "SourceDecorator", "EncryptDecorator", "Encrypted")]
    tpl = ("interface {Cmp} {\n"
           "  String describe();\n"
           "}\n\n"
           "abstract class {Dec} implements [[ZONE_1]] {\n"
           "  protected {Cmp} wrappee;\n"
           "  public {Dec}({Cmp} c) { this.wrappee = c; }\n"
           "}\n\n"
           "class {Conc} extends {Dec} {\n"
           "  public {Conc}({Cmp} c) { super(c); }\n"
           "  public String describe() {\n"
           "    return wrappee.[[ZONE_2]] + \" + {extra}\";\n"
           "  }\n"
           "}")
    for cmp, base, dec, conc, extra in DEC:
        qs.append(dnd(
            f"Complete the Decorator: {conc} wraps a {cmp} and adds {extra}.",
            fill(tpl, Cmp=cmp, Dec=dec, Conc=conc, extra=extra),
            {"ZONE_1": [cmp, base, dec],
             "ZONE_2": ["describe()", "wrappee()", "describe"]},
            {"ZONE_1": cmp, "ZONE_2": "describe()"},
            "A decorator implements the same component interface, holds a wrappee, and adds behavior around the delegated call.",
            tags=["Decorator"]))

    # ---- Command ---------------------------------------------------------
    CMD = [("Light", "turnOn", "LightOnCommand"), ("Door", "open", "OpenDoorCommand"),
           ("Television", "mute", "MuteCommand"), ("Document", "save", "SaveCommand"),
           ("Robot", "moveForward", "MoveCommand")]
    tpl = ("interface Command {\n"
           "  void execute();\n"
           "}\n\n"
           "class {Rc} {\n"
           "  public void {ac}() {\n"
           "    System.out.println(\"{ac}\");\n"
           "  }\n"
           "}\n\n"
           "class {Cmd} implements [[ZONE_1]] {\n"
           "  private {Rc} receiver;\n"
           "  public {Cmd}([[ZONE_2]] receiver) {\n"
           "    this.receiver = receiver;\n"
           "  }\n"
           "  public void execute() {\n"
           "    receiver.[[ZONE_3]];\n"
           "  }\n"
           "}")
    for rc, ac, cmd in CMD:
        qs.append(dnd(
            f"Complete the Command pattern wrapping {rc}.{ac}().",
            fill(tpl, Rc=rc, ac=ac, Cmd=cmd),
            {"ZONE_1": ["Command", rc, cmd],
             "ZONE_2": [rc, "Command", cmd],
             "ZONE_3": [f"{ac}()", "execute()", "this()"]},
            {"ZONE_1": "Command", "ZONE_2": rc, "ZONE_3": f"{ac}()"},
            "The command implements Command, stores the receiver, and calls the receiver's real method inside execute().",
            tags=["Command"]))

    # ---- Template Method -------------------------------------------------
    TM = [("DataProcessor", "load", "transform", "save"),
          ("Game", "initialize", "play", "end"),
          ("ReportGenerator", "fetch", "format", "export"),
          ("BuildPipeline", "compile", "test", "pack"),
          ("Beverage", "boilWater", "brew", "pour")]
    tpl = ("abstract class {B} {\n"
           "  public [[ZONE_1]] void run() {\n"
           "    {s1}();\n"
           "    {s2}();\n"
           "    {s3}();\n"
           "  }\n"
           "  protected [[ZONE_2]] void {s1}();\n"
           "  protected abstract void {s2}();\n"
           "  protected abstract void {s3}();\n"
           "}")
    for b, s1, s2, s3 in TM:
        qs.append(dnd(
            f"Complete the Template Method skeleton in {b}.",
            fill(tpl, B=b, s1=s1, s2=s2, s3=s3),
            {"ZONE_1": ["final", "static", "abstract"],
             "ZONE_2": ["abstract", "final", "default"]},
            {"ZONE_1": "final", "ZONE_2": "abstract"},
            "The template method is final so subclasses cannot change the step order; the steps are abstract for subclasses to implement.",
            tags=["Template Method"]))

    # ---- State -----------------------------------------------------------
    STA = [("TrafficLightState", "TrafficLight"), ("OrderState", "Order"),
           ("DoorState", "Door"), ("PlaybackState", "MediaPlayer"),
           ("ConnectionState", "Connection")]
    tpl = ("interface {S} {\n"
           "  void handle({C} ctx);\n"
           "}\n\n"
           "class {C} {\n"
           "  private {S} state;\n"
           "  public void setState([[ZONE_1]] state) {\n"
           "    this.state = state;\n"
           "  }\n"
           "  public void request() {\n"
           "    state.[[ZONE_2]];\n"
           "  }\n"
           "}")
    for s, c in STA:
        qs.append(dnd(
            f"Complete the State pattern: {c} delegates behavior to its current {s}.",
            fill(tpl, S=s, C=c),
            {"ZONE_1": [s, c, "void"],
             "ZONE_2": ["handle(this)", "request()", "setState(this)"]},
            {"ZONE_1": s, "ZONE_2": "handle(this)"},
            "The context holds a state object, can replace it, and forwards requests to it (passing itself for transitions).",
            tags=["State"]))

    # ---- Composite -------------------------------------------------------
    COMP = [("Graphic", "Circle", "Group"), ("FsNode", "FileLeaf", "Folder"),
            ("MenuComponent", "MenuItem", "Menu"), ("Shape", "Dot", "Drawing"),
            ("Employee", "Worker", "Manager")]
    tpl = ("interface {Cmp} {\n"
           "  int getSize();\n"
           "}\n\n"
           "class {Leaf} implements {Cmp} {\n"
           "  public int getSize() { return 1; }\n"
           "}\n\n"
           "class {Comp} implements {Cmp} {\n"
           "  private List<[[ZONE_1]]> children = new ArrayList<>();\n"
           "  public void add({Cmp} c) { children.add(c); }\n"
           "  public int getSize() {\n"
           "    int total = 0;\n"
           "    for ({Cmp} c : children) {\n"
           "      total += c.[[ZONE_2]];\n"
           "    }\n"
           "    return total;\n"
           "  }\n"
           "}")
    for cmp, leaf, comp in COMP:
        qs.append(dnd(
            f"Complete the Composite where {comp} holds children uniformly with {leaf}.",
            fill(tpl, Cmp=cmp, Leaf=leaf, Comp=comp),
            {"ZONE_1": [cmp, leaf, comp],
             "ZONE_2": ["getSize()", "add()", "size()"]},
            {"ZONE_1": cmp, "ZONE_2": "getSize()"},
            "Both leaf and composite implement the component type; the composite recurses the same operation over its children.",
            tags=["Composite"]))

    # ---- Builder ---------------------------------------------------------
    BLD = ["Pizza", "Burger", "HttpRequest", "Car", "UserProfile", "Report"]
    tpl = ("class {P} {\n"
           "  private final String a;\n"
           "  private final String b;\n"
           "  private {P}(Builder builder) {\n"
           "    this.a = builder.a;\n"
           "    this.b = builder.b;\n"
           "  }\n"
           "  static class Builder {\n"
           "    private String a;\n"
           "    private String b;\n"
           "    public Builder setA(String a) {\n"
           "      this.a = a;\n"
           "      return [[ZONE_1]];\n"
           "    }\n"
           "    public {P} build() {\n"
           "      return new [[ZONE_2]](this);\n"
           "    }\n"
           "  }\n"
           "}")
    for p in BLD:
        qs.append(dnd(
            f"Complete the Builder for {p} so setters chain and build() returns the product.",
            fill(tpl, P=p),
            {"ZONE_1": ["this", "Builder", "a"],
             "ZONE_2": [p, "Builder", "this"]},
            {"ZONE_1": "this", "ZONE_2": p},
            "Each setter returns this for chaining; build() constructs the enclosing product from the builder.",
            tags=["Builder"]))

    # ---- Proxy -----------------------------------------------------------
    PRX = ["Image", "BankAccount", "FileReader", "Database", "VideoStream"]
    tpl = ("interface {S} {\n"
           "  void request();\n"
           "}\n\n"
           "class Real{S} implements {S} {\n"
           "  public void request() { System.out.println(\"real\"); }\n"
           "}\n\n"
           "class {S}Proxy implements [[ZONE_1]] {\n"
           "  private Real{S} real = new Real{S}();\n"
           "  public void request() {\n"
           "    if (hasAccess()) {\n"
           "      real.[[ZONE_2]];\n"
           "    }\n"
           "  }\n"
           "  private boolean hasAccess() { return true; }\n"
           "}")
    for s in PRX:
        qs.append(dnd(
            f"Complete the Proxy that guards access to Real{s}.",
            fill(tpl, S=s),
            {"ZONE_1": [s, "Real" + s, s + "Proxy"],
             "ZONE_2": ["request()", "hasAccess()", "request"]},
            {"ZONE_1": s, "ZONE_2": "request()"},
            "The proxy implements the same interface as the real subject and forwards to it only after its access check.",
            tags=["Proxy"]))

    # ---- DIP (dependency injection of an abstraction) --------------------
    DIP = [("Logger", "FileLogger", "Service", "log"),
           ("Repository", "SqlRepository", "Controller", "save"),
           ("MessageSender", "EmailSender", "Notifier", "send"),
           ("PaymentGateway", "StripeGateway", "Checkout", "charge")]
    tpl = ("interface {A} {\n"
           "  void {m}(String msg);\n"
           "}\n\n"
           "class {Impl} implements [[ZONE_1]] {\n"
           "  public void {m}([[ZONE_2]] msg) { }\n"
           "}\n\n"
           "class {Cl} {\n"
           "  private [[ZONE_3]] dep;\n"
           "  {Cl}({A} dep) { this.dep = dep; }\n"
           "}")
    for a, impl, cl, m in DIP:
        qs.append(dnd(
            f"Place the terms so the Dependency Inversion Principle is respected ({cl} depends on {a}).",
            fill(tpl, A=a, Impl=impl, Cl=cl, m=m),
            {"ZONE_1": [a, impl, cl],
             "ZONE_2": ["String", a, "void"],
             "ZONE_3": [a, impl, "String"]},
            {"ZONE_1": a, "ZONE_2": "String", "ZONE_3": a},
            "The implementation realises the abstraction, the method signature matches the interface, and the client field is typed to the abstraction, not the concrete class.",
            tags=["DIP"]))

    # ---- Prototype -------------------------------------------------------
    PROTO = ["ShapePrototype", "DocumentTemplate", "GameCharacter", "Configuration", "Cell"]
    tpl = ("class {C} implements [[ZONE_1]] {\n"
           "  private String data;\n"
           "  public {C}(String data) { this.data = data; }\n"
           "  public {C} copy() {\n"
           "    try {\n"
           "      return ({C}) [[ZONE_2]];\n"
           "    } catch (CloneNotSupportedException e) {\n"
           "      return null;\n"
           "    }\n"
           "  }\n"
           "}")
    for c in PROTO:
        qs.append(dnd(
            f"Complete the Prototype so {c} can clone itself.",
            fill(tpl, C=c),
            {"ZONE_1": ["Cloneable", "Prototype", "Serializable"],
             "ZONE_2": ["super.clone()", "this.copy()", "new " + c + "(data)"]},
            {"ZONE_1": "Cloneable", "ZONE_2": "super.clone()"},
            "Prototype relies on Cloneable and delegates to Object.clone() via super.clone() to duplicate the instance.",
            tags=["Prototype"]))

    # ---- Iterator --------------------------------------------------------
    ITER = ["NameRepository", "Playlist", "Menu", "BookShelf", "NumberRange"]
    tpl = ("class {C} implements Iterable<String> {\n"
           "  private String[] items;\n"
           "  public Iterator<String> iterator() {\n"
           "    return new Iterator<String>() {\n"
           "      private int index = 0;\n"
           "      public boolean [[ZONE_1]] {\n"
           "        return index < items.length;\n"
           "      }\n"
           "      public String next() {\n"
           "        return items[[[ZONE_2]]];\n"
           "      }\n"
           "    };\n"
           "  }\n"
           "}")
    for c in ITER:
        qs.append(dnd(
            f"Complete the Iterator implementation in {c}.",
            fill(tpl, C=c),
            {"ZONE_1": ["hasNext()", "next()", "remove()"],
             "ZONE_2": ["index++", "index", "--index"]},
            {"ZONE_1": "hasNext()", "ZONE_2": "index++"},
            "An iterator exposes hasNext()/next(); next() returns the current element and advances the cursor (index++).",
            tags=["Iterator"]))

    # ---- Chain of Responsibility ----------------------------------------
    COR = ["Handler", "Approver", "LogHandler", "SupportTier", "Middleware"]
    tpl = ("abstract class {H} {\n"
           "  protected {H} next;\n"
           "  public void setNext([[ZONE_1]] next) {\n"
           "    this.next = next;\n"
           "  }\n"
           "  public void handle(int level) {\n"
           "    if (canHandle(level)) {\n"
           "      process(level);\n"
           "    } else if (next != null) {\n"
           "      next.[[ZONE_2]];\n"
           "    }\n"
           "  }\n"
           "  protected abstract boolean canHandle(int level);\n"
           "  protected abstract void process(int level);\n"
           "}")
    for h in COR:
        qs.append(dnd(
            f"Complete the Chain of Responsibility base class {h}.",
            fill(tpl, H=h),
            {"ZONE_1": [h, "int", "void"],
             "ZONE_2": ["handle(level)", "setNext(level)", "process(level)"]},
            {"ZONE_1": h, "ZONE_2": "handle(level)"},
            "Each handler references the next handler and forwards the request down the chain when it cannot handle it.",
            tags=["Chain of Responsibility"]))

    # ---- Facade ----------------------------------------------------------
    FAC = [("CPU", "freeze", "Memory", "load", "ComputerFacade"),
           ("Amplifier", "on", "Projector", "wideScreen", "HomeTheaterFacade"),
           ("InventoryService", "reserve", "PaymentService", "charge", "OrderFacade"),
           ("Engine", "start", "FuelPump", "prime", "CarFacade")]
    tpl = ("class {A} { public void {oa}() {} }\n"
           "class {B} { public void {ob}() {} }\n\n"
           "class {F} {\n"
           "  private {A} a = new {A}();\n"
           "  private {B} b = new {B}();\n"
           "  public void doWork() {\n"
           "    a.[[ZONE_1]];\n"
           "    b.[[ZONE_2]];\n"
           "  }\n"
           "}")
    for a, oa, b, ob, f in FAC:
        qs.append(dnd(
            f"Complete the Facade {f} that hides the {a}/{b} subsystem.",
            fill(tpl, A=a, oa=oa, B=b, ob=ob, F=f),
            {"ZONE_1": [f"{oa}()", f"{ob}()", "doWork()"],
             "ZONE_2": [f"{ob}()", f"{oa}()", "doWork()"]},
            {"ZONE_1": f"{oa}()", "ZONE_2": f"{ob}()"},
            "The facade exposes one simple method that delegates to the right calls on each subsystem object.",
            tags=["Facade"]))

    # ---- Abstract Factory ------------------------------------------------
    AF = [("GUIFactory", "Button", "Checkbox", "WinFactory", "WinButton", "WinCheckbox"),
          ("FurnitureFactory", "Chair", "Sofa", "ModernFactory", "ModernChair", "ModernSofa"),
          ("DbFactory", "Connection", "Command", "MySqlFactory", "MySqlConnection", "MySqlCommand")]
    tpl = ("interface {AF} {\n"
           "  {P1} create{P1}();\n"
           "  {P2} create{P2}();\n"
           "}\n\n"
           "class {CF} implements [[ZONE_1]] {\n"
           "  public {P1} create{P1}() {\n"
           "    return new [[ZONE_2]]();\n"
           "  }\n"
           "  public {P2} create{P2}() {\n"
           "    return new {CP2}();\n"
           "  }\n"
           "}")
    for af, p1, p2, cf, cp1, cp2 in AF:
        qs.append(dnd(
            f"Complete the Abstract Factory: {cf} produces a related family of products.",
            fill(tpl, AF=af, P1=p1, P2=p2, CF=cf, CP1=cp1, CP2=cp2),
            {"ZONE_1": [af, cf, p1],
             "ZONE_2": [cp1, p1, cf]},
            {"ZONE_1": af, "ZONE_2": cp1},
            "A concrete factory implements the abstract factory interface and returns the concrete members of one product family.",
            tags=["Abstract Factory"]))

    # ---- Memento ---------------------------------------------------------
    MEM = ["TextEditor", "GameSession", "Calculator", "Canvas"]
    tpl = ("class {O} {\n"
           "  private String state;\n"
           "  public Memento save() {\n"
           "    return new Memento([[ZONE_1]]);\n"
           "  }\n"
           "  public void restore(Memento m) {\n"
           "    this.state = m.[[ZONE_2]];\n"
           "  }\n"
           "  static class Memento {\n"
           "    private final String state;\n"
           "    Memento(String state) { this.state = state; }\n"
           "    String getState() { return state; }\n"
           "  }\n"
           "}")
    for o in MEM:
        qs.append(dnd(
            f"Complete the Memento pattern in {o} (save and restore state).",
            fill(tpl, O=o),
            {"ZONE_1": ["state", "this", "getState()"],
             "ZONE_2": ["getState()", "state", "save()"]},
            {"ZONE_1": "state", "ZONE_2": "getState()"},
            "save() snapshots the originator's state into a memento; restore() reads it back via the memento's accessor.",
            tags=["Memento"]))

    # ---- Flyweight -------------------------------------------------------
    FLY = [("TreeType", "TreeFactory"), ("Glyph", "GlyphFactory"),
           ("Particle", "ParticleFactory"), ("Icon", "IconFactory")]
    tpl = ("class {T} {\n"
           "  private final String name;\n"
           "  private final String texture;\n"
           "  {T}(String name, String texture) {\n"
           "    this.name = name;\n"
           "    this.texture = texture;\n"
           "  }\n"
           "}\n\n"
           "class {F} {\n"
           "  private static Map<String, {T}> cache = new HashMap<>();\n"
           "  public static {T} get(String name, String texture) {\n"
           "    {T} t = cache.get(name);\n"
           "    if (t == null) {\n"
           "      t = new {T}(name, texture);\n"
           "      cache.[[ZONE_1]];\n"
           "    }\n"
           "    return [[ZONE_2]];\n"
           "  }\n"
           "}")
    for t, f in FLY:
        qs.append(dnd(
            f"Complete the Flyweight factory {f} that caches shared {t} objects.",
            fill(tpl, T=t, F=f),
            {"ZONE_1": ["put(name, t)", "get(name)", "add(t)"],
             "ZONE_2": ["t", "cache", "name"]},
            {"ZONE_1": "put(name, t)", "ZONE_2": "t"},
            "The factory reuses cached flyweights, only creating and storing a new shared object when none exists for the key.",
            tags=["Flyweight"]))

    # ---- Bridge ----------------------------------------------------------
    BRG = [("Renderer", "Shape"), ("Device", "Remote"), ("Color", "Shape2")]
    tpl = ("interface {I} {\n"
           "  void renderCircle();\n"
           "}\n\n"
           "abstract class {Ab} {\n"
           "  protected {I} impl;\n"
           "  protected {Ab}([[ZONE_1]] impl) {\n"
           "    this.impl = impl;\n"
           "  }\n"
           "  public abstract void draw();\n"
           "}\n\n"
           "class Refined{Ab} extends {Ab} {\n"
           "  public Refined{Ab}({I} impl) { super(impl); }\n"
           "  public void draw() {\n"
           "    impl.[[ZONE_2]];\n"
           "  }\n"
           "}")
    for i, ab in BRG:
        qs.append(dnd(
            f"Complete the Bridge: the {ab} abstraction delegates drawing to the {i} implementation.",
            fill(tpl, I=i, Ab=ab),
            {"ZONE_1": [i, ab, "void"],
             "ZONE_2": ["renderCircle()", "draw()", "renderCircle"]},
            {"ZONE_1": i, "ZONE_2": "renderCircle()"},
            "Bridge holds a reference to a separate implementor hierarchy and forwards the work to it, so both sides vary independently.",
            tags=["Bridge"]))

    # ---- Mediator --------------------------------------------------------
    MED = [("ChatMediator", "User"), ("Tower", "Aircraft"), ("DialogMediator", "Widget")]
    tpl = ("interface {M} {\n"
           "  void notify({Col} sender, String event);\n"
           "}\n\n"
           "class {Col} {\n"
           "  protected {M} mediator;\n"
           "  public {Col}({M} mediator) { this.mediator = mediator; }\n"
           "  public void changed() {\n"
           "    mediator.[[ZONE_1]];\n"
           "  }\n"
           "}")
    for m, col in MED:
        qs.append(dnd(
            f"Complete the Mediator pattern: {col} reports events to the {m}.",
            fill(tpl, M=m, Col=col),
            {"ZONE_1": ["notify(this, \"changed\")", "changed()", "notify()"]},
            {"ZONE_1": "notify(this, \"changed\")"},
            "Colleagues send their events to the central mediator instead of talking to each other directly.",
            tags=["Mediator"]))

    # ---- Visitor ---------------------------------------------------------
    VIS = [("ShapeVisitor", "Circle", "Square"), ("NodeVisitor", "FileNode", "DirNode")]
    tpl = ("interface {V} {\n"
           "  void visit({A} a);\n"
           "  void visit({B} b);\n"
           "}\n\n"
           "interface Element {\n"
           "  void accept({V} v);\n"
           "}\n\n"
           "class {A} implements Element {\n"
           "  public void accept([[ZONE_1]] v) {\n"
           "    v.[[ZONE_2]];\n"
           "  }\n"
           "}")
    for v, a, b in VIS:
        qs.append(dnd(
            f"Complete the Visitor double-dispatch in {a}.accept().",
            fill(tpl, V=v, A=a, B=b),
            {"ZONE_1": [v, a, "Element"],
             "ZONE_2": ["visit(this)", "accept(this)", "visit()"]},
            {"ZONE_1": v, "ZONE_2": "visit(this)"},
            "accept() takes the visitor and calls back visit(this); the argument type selects the right overload (double dispatch).",
            tags=["Visitor"]))

    return qs


if __name__ == "__main__":
    print(len(build()))
