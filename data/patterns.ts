export type Lang = 'en' | 'ro';
export type PatternCategory = 'structural' | 'behavioral';
export type ProgressStatus = 'not-started' | 'studying' | 'done';

export interface LocalizedString {
  en: string;
  ro: string;
}

export interface Participant {
  role: string;
  description: LocalizedString;
  example: string;
}

export interface WalkthroughStep {
  stepNumber: number;
  title: LocalizedString;
  description: LocalizedString;
  highlightLines: number[];
  roleName: string;
  roleColor: string;
}

export interface ComparisonRow {
  property: LocalizedString;
  values: Record<string, LocalizedString>;
}

export interface RoleMapping {
  role: string;
  mappedTo: string;
  explanation: LocalizedString;
}

export interface SolveExample {
  problem: LocalizedString;
  keywords: LocalizedString[];
  reasoning: LocalizedString[];
  roleMappings: RoleMapping[];
  answerOutline: LocalizedString[];
}

export interface SelfTestQuestion {
  id: string;
  question: LocalizedString;
  options: LocalizedString[];
  correctIndex: number;
  explanation: LocalizedString;
}

export interface Pattern {
  id: string;
  slug: string;
  number: number;
  name: LocalizedString;
  category: PatternCategory;
  oneliner: LocalizedString;
  analogy: LocalizedString;
  participants: Participant[];
  structureDiagram: string;
  code: string;
  codeFile: string;
  codeWalkthrough: WalkthroughStep[];
  examKeywords: LocalizedString[];
  commonMistakes: LocalizedString[];
  confusedWith: string[];

  useWhen: LocalizedString[];
  doNotUseWhen: LocalizedString[];
  examPhrases: LocalizedString[];
  solveExample: SolveExample;
  selfTest: SelfTestQuestion[];
}

const structural = 'structural' satisfies PatternCategory;
const behavioral = 'behavioral' satisfies PatternCategory;

export const patterns: Pattern[] = [
  {
    id: 'adapter',
    slug: 'adapter',
    number: 1,
    name: { en: 'Adapter', ro: 'Adapter' },
    category: structural,
    oneliner: {
      en: 'Translate between incompatible interfaces without changing either side.',
      ro: 'Traduce intre interfete incompatibile fara sa modifici clasele existente.',
    },
    analogy: {
      en: 'A travel power adapter lets a device use a wall socket with a different shape.',
      ro: 'Un adaptor de priza permite unui dispozitiv sa foloseasca o priza cu forma diferita.',
    },
    participants: [
      { role: 'Target', description: { en: 'Interface expected by the client.', ro: 'Interfata asteptata de client.' }, example: 'IPrinter' },
      { role: 'Adaptee', description: { en: 'Existing class with the incompatible API.', ro: 'Clasa existenta cu API incompatibil.' }, example: 'LaserPrinter' },
      { role: 'Adapter', description: { en: 'Implements Target and wraps the Adaptee.', ro: 'Implementeaza Target si impacheteaza Adaptee.' }, example: 'Laser2InkAdapter' },
      { role: 'Client', description: { en: 'Uses only the Target interface.', ro: 'Foloseste doar interfata Target.' }, example: 'PrinterClient' },
    ],
    structureDiagram: 'Client -> Target(IPrinter)\n              ^ implements\n       Adapter(Laser2InkAdapter)\n              v wraps\n       Adaptee(LaserPrinter)',
    code: '',
    codeFile: 'AdapterExample.java',
    codeWalkthrough: [
      { stepNumber: 1, title: { en: 'Target interface', ro: 'Interfata Target' }, description: { en: 'The system already knows this interface.', ro: 'Sistemul cunoaste deja aceasta interfata.' }, highlightLines: [9, 10, 11, 12], roleName: 'TARGET', roleColor: 'text-green-400' },
      { stepNumber: 2, title: { en: 'Incompatible class', ro: 'Clasa incompatibila' }, description: { en: 'The adaptee has useful behavior but different method names.', ro: 'Adaptee are comportament util, dar metode diferite.' }, highlightLines: [15, 16, 17, 18, 19, 20, 21, 22], roleName: 'ADAPTEE', roleColor: 'text-orange-400' },
      { stepNumber: 3, title: { en: 'Translate calls', ro: 'Traduce apeluri' }, description: { en: 'The adapter maps IPrinter calls to LaserPrinter calls.', ro: 'Adapterul mapeaza apelurile IPrinter catre LaserPrinter.' }, highlightLines: [38, 39, 41, 42, 46, 47, 48, 51, 52, 54], roleName: 'ADAPTER', roleColor: 'text-blue-400' },
      { stepNumber: 4, title: { en: 'Client stays unaware', ro: 'Clientul nu stie diferenta' }, description: { en: 'The client receives IPrinter and does not know what is wrapped.', ro: 'Clientul primeste IPrinter si nu stie ce este impachetat.' }, highlightLines: [58, 59, 60, 61, 62, 63, 64, 65], roleName: 'CLIENT', roleColor: 'text-purple-400' },
    ],
    examKeywords: [
      { en: 'external library', ro: 'biblioteca externa' },
      { en: 'incompatible interface', ro: 'interfata incompatibila' },
      { en: 'different method names', ro: 'nume de metode diferite' },
    ],
    commonMistakes: [
      { en: 'Modifying the adaptee instead of wrapping it.', ro: 'Modificarea clasei adaptee in loc de impachetare.' },
      { en: 'Forgetting that Adapter changes the interface.', ro: 'Uitarea faptului ca Adapter schimba interfata.' },
    ],
    confusedWith: ['decorator', 'proxy', 'facade'],
    useWhen: [
      { en: 'An existing class has useful behavior but the client expects a different interface.', ro: 'O clasa existenta are comportament util, dar clientul asteapta alta interfata.' },
      { en: 'You cannot modify the external library or third-party class.', ro: 'Nu poti modifica biblioteca externa sau clasa third-party.' },
    ],
    doNotUseWhen: [
      { en: 'The interface is already correct and you only need to add optional behavior; use Decorator instead.', ro: 'Interfata este deja corecta si trebuie doar comportament optional; foloseste Decorator.' },
      { en: 'You want to control access or delay initialization; use Proxy instead.', ro: 'Vrei sa controlezi accesul sau sa intarzii initializarea; foloseste Proxy.' },
    ],
    examPhrases: [
      { en: 'We cannot modify the external library, but we need it to work with our interface.', ro: 'Nu putem modifica biblioteca externa, dar trebuie sa functioneze cu interfata noastra.' },
      { en: 'The client expects IPrinter but the available class exposes a different method.', ro: 'Clientul asteapta IPrinter dar clasa disponibila expune o alta metoda.' },
    ],
    solveExample: {
      problem: {
        en: 'A client expects IPrinter, but the only available class is LaserPrinter which exposes printLaser(). You cannot modify LaserPrinter. Choose and outline a pattern.',
        ro: 'Un client asteapta IPrinter, dar singura clasa disponibila este LaserPrinter care expune printLaser(). Nu poti modifica LaserPrinter. Alege si schiteaza un pattern.',
      },
      keywords: [
        { en: 'client expects IPrinter', ro: 'clientul asteapta IPrinter' },
        { en: 'cannot modify the existing class', ro: 'nu poti modifica clasa existenta' },
        { en: 'available class exposes a different method', ro: 'clasa disponibila expune alta metoda' },
      ],
      reasoning: [
        { en: 'The useful class already exists so we should not rewrite it.', ro: 'Clasa utila exista deja, deci nu trebuie rescrisa.' },
        { en: 'The client expects a specific interface we cannot change.', ro: 'Clientul asteapta o interfata specifica pe care nu o putem schimba.' },
        { en: 'We need a bridge that wraps LaserPrinter and exposes IPrinter.', ro: 'Avem nevoie de un adaptor care impacheteaza LaserPrinter si expune IPrinter.' },
        { en: 'Adapter is the pattern that translates one interface into another.', ro: 'Adapter este pattern-ul care traduce o interfata in alta.' },
      ],
      roleMappings: [
        { role: 'Target', mappedTo: 'IPrinter', explanation: { en: 'The interface the client already knows.', ro: 'Interfata pe care clientul o cunoaste deja.' } },
        { role: 'Adaptee', mappedTo: 'LaserPrinter', explanation: { en: 'The existing class with the incompatible API.', ro: 'Clasa existenta cu API incompatibil.' } },
        { role: 'Adapter', mappedTo: 'Laser2InkAdapter', explanation: { en: 'Implements IPrinter and wraps a LaserPrinter instance.', ro: 'Implementeaza IPrinter si impacheteaza o instanta LaserPrinter.' } },
        { role: 'Client', mappedTo: 'PrinterClient', explanation: { en: 'Uses only IPrinter; unaware of LaserPrinter.', ro: 'Foloseste doar IPrinter; nu stie de LaserPrinter.' } },
      ],
      answerOutline: [
        { en: 'Define Target interface: interface IPrinter { void print(String text); }', ro: 'Defineste interfata Target: interface IPrinter { void print(String text); }' },
        { en: 'Adaptee stays unchanged: class LaserPrinter { void printLaser(String text) { ... } }', ro: 'Adaptee ramane neschimbat: class LaserPrinter { void printLaser(String text) { ... } }' },
        { en: 'Create Adapter: class Laser2InkAdapter implements IPrinter, wraps LaserPrinter, print() calls laser.printLaser()', ro: 'Creeaza Adapter: class Laser2InkAdapter implements IPrinter, impacheteaza LaserPrinter, print() apeleaza laser.printLaser()' },
        { en: 'Client receives IPrinter and calls print() without knowing about LaserPrinter.', ro: 'Clientul primeste IPrinter si apeleaza print() fara sa stie de LaserPrinter.' },
      ],
    },
    selfTest: [
      {
        id: 'adapter-1',
        question: { en: 'What is the strongest clue that Adapter is the right pattern?', ro: 'Care este cel mai puternic indiciu ca Adapter este pattern-ul potrivit?' },
        options: [
          { en: 'Incompatible interfaces between client and existing class', ro: 'Interfete incompatibile intre client si clasa existenta' },
          { en: 'Need to undo operations', ro: 'Necesitatea de a anula operatii' },
          { en: 'Multiple subscribers reacting to an event', ro: 'Multi abonati care reactioneaza la un eveniment' },
        ],
        correctIndex: 0,
        explanation: { en: 'Adapter translates one interface into another. The key clue is that the client and the useful class have incompatible APIs.', ro: 'Adapter traduce o interfata in alta. Indiciul cheie este ca clientul si clasa utila au API incompatibil.' },
      },
      {
        id: 'adapter-2',
        question: { en: 'Which role implements the Target interface and wraps the Adaptee?', ro: 'Care rol implementeaza interfata Target si impacheteaza Adaptee-ul?' },
        options: [
          { en: 'Client', ro: 'Client' },
          { en: 'Adapter', ro: 'Adapter' },
          { en: 'Adaptee', ro: 'Adaptee' },
          { en: 'Facade', ro: 'Facade' },
        ],
        correctIndex: 1,
        explanation: { en: 'The Adapter class implements the Target interface and internally wraps the Adaptee to translate calls.', ro: 'Clasa Adapter implementeaza interfata Target si intern impacheteaza Adaptee pentru a traduce apelurile.' },
      },
    ],
  },
  {
    id: 'decorator',
    slug: 'decorator',
    number: 2,
    name: { en: 'Decorator', ro: 'Decorator' },
    category: structural,
    oneliner: {
      en: 'Add behavior at runtime by wrapping objects with the same interface.',
      ro: 'Adauga comportament la runtime impachetand obiecte cu aceeasi interfata.',
    },
    analogy: {
      en: 'Coffee toppings stack around a simple coffee: milk, sugar, caramel.',
      ro: 'Toppingurile de cafea se adauga peste o cafea simpla: lapte, zahar, caramel.',
    },
    participants: [
      { role: 'Component', description: { en: 'Common interface for base object and decorators.', ro: 'Interfata comuna pentru obiectul de baza si decoratori.' }, example: 'ICoffee' },
      { role: 'ConcreteComponent', description: { en: 'The plain object being enhanced.', ro: 'Obiectul simplu care este imbunatatit.' }, example: 'SimpleCoffee' },
      { role: 'AbstractDecorator', description: { en: 'Implements and wraps Component.', ro: 'Implementeaza si impacheteaza Component.' }, example: 'CoffeeDecorator' },
      { role: 'ConcreteDecorator', description: { en: 'Adds one optional feature.', ro: 'Adauga o functionalitate optionala.' }, example: 'MilkDecorator' },
    ],
    structureDiagram: 'Component(ICoffee) <- SimpleCoffee\nComponent(ICoffee) <- CoffeeDecorator -> wraps ICoffee\nCoffeeDecorator <- MilkDecorator / SugarDecorator / CaramelDecorator',
    code: '',
    codeFile: 'DecoratorExample.java',
    codeWalkthrough: [
      { stepNumber: 1, title: { en: 'Shared component', ro: 'Componenta comuna' }, description: { en: 'Everything implements the same contract.', ro: 'Toate clasele implementeaza acelasi contract.' }, highlightLines: [14, 15, 16, 17], roleName: 'COMPONENT', roleColor: 'text-green-400' },
      { stepNumber: 2, title: { en: 'Base object', ro: 'Obiect de baza' }, description: { en: 'SimpleCoffee is the undecorated object.', ro: 'SimpleCoffee este obiectul fara decorari.' }, highlightLines: [20, 21, 22, 23, 24, 25], roleName: 'BASE', roleColor: 'text-orange-400' },
      { stepNumber: 3, title: { en: 'Decorator wraps same interface', ro: 'Decoratorul impacheteaza aceeasi interfata' }, description: { en: 'The abstract decorator both implements and contains ICoffee.', ro: 'Decoratorul abstract implementeaza si contine ICoffee.' }, highlightLines: [29, 30, 32, 33, 38, 40], roleName: 'DECORATOR', roleColor: 'text-blue-400' },
      { stepNumber: 4, title: { en: 'Stack features', ro: 'Stivuire functionalitati' }, description: { en: 'Concrete decorators add one thing and delegate the rest.', ro: 'Decoratorii concreti adauga un lucru si deleaga restul.' }, highlightLines: [44, 45, 48, 50, 53, 54, 57, 59, 62, 63, 66, 68], roleName: 'ADD-ON', roleColor: 'text-purple-400' },
    ],
    examKeywords: [
      { en: 'dynamically add behavior', ro: 'adauga comportament dinamic' },
      { en: 'avoid class explosion', ro: 'evita explozia de clase' },
      { en: 'optional combinations', ro: 'combinatii optionale' },
    ],
    commonMistakes: [
      { en: 'Using inheritance for every combination.', ro: 'Folosirea mostenirii pentru fiecare combinatie.' },
      { en: 'Decorator not implementing the component interface.', ro: 'Decoratorul nu implementeaza interfata componentei.' },
    ],
    confusedWith: ['adapter', 'proxy', 'composite'],
    useWhen: [
      { en: 'You need to add optional features to objects at runtime without subclassing.', ro: 'Trebuie sa adaugi functionalitati optionale la obiecte la runtime fara mostenire.' },
      { en: 'Multiple independent features can be stacked in any combination.', ro: 'Mai multe functionalitati independente pot fi stivuite in orice combinatie.' },
    ],
    doNotUseWhen: [
      { en: 'The interfaces are incompatible; use Adapter to translate between them.', ro: 'Interfetele sunt incompatibile; foloseste Adapter pentru a le traduce.' },
      { en: 'You need to control access, filter, or delay creation; use Proxy instead.', ro: 'Trebuie sa controlezi accesul, sa filtrezi sau sa intarzii crearea; foloseste Proxy.' },
    ],
    examPhrases: [
      { en: 'Add toppings or features to an object at runtime without changing its type.', ro: 'Adauga toppinguri sau functionalitati unui obiect la runtime fara a schimba tipul.' },
      { en: 'Avoid a class explosion from every combination of optional features.', ro: 'Evita explozia de clase din fiecare combinatie de functionalitati optionale.' },
    ],
    solveExample: {
      problem: {
        en: 'A coffee shop sells SimpleCoffee and needs to support any combination of Milk, Sugar, and Caramel at runtime. Creating a subclass for every combination is not acceptable. Choose a pattern.',
        ro: 'O cafenea vinde SimpleCoffee si trebuie sa suporte orice combinatie de Lapte, Zahar si Caramel la runtime. Crearea unei subclase pentru fiecare combinatie nu este acceptabila. Alege un pattern.',
      },
      keywords: [
        { en: 'optional combinations', ro: 'combinatii optionale' },
        { en: 'add features at runtime', ro: 'adauga functionalitati la runtime' },
        { en: 'avoid class explosion', ro: 'evita explozia de clase' },
      ],
      reasoning: [
        { en: 'Subclassing creates one class per combination, which grows combinatorially.', ro: 'Subclasarea creeaza o clasa per combinatie, care creste combinatorial.' },
        { en: 'We need to add behavior at runtime by wrapping objects that share the same interface.', ro: 'Trebuie sa adaugam comportament la runtime impachetand obiecte cu aceeasi interfata.' },
        { en: 'Each decorator adds one feature and delegates everything else to the wrapped object.', ro: 'Fiecare decorator adauga o functionalitate si deleaga restul obiectului impachetat.' },
        { en: 'Decorator keeps the same interface throughout the wrapping chain.', ro: 'Decorator pastreaza aceeasi interfata pe tot lantul de impachetare.' },
      ],
      roleMappings: [
        { role: 'Component', mappedTo: 'ICoffee', explanation: { en: 'Shared interface for both the base object and all decorators.', ro: 'Interfata comuna pentru obiectul de baza si toti decoratorii.' } },
        { role: 'ConcreteComponent', mappedTo: 'SimpleCoffee', explanation: { en: 'The plain undecorated object.', ro: 'Obiectul simplu fara decorari.' } },
        { role: 'AbstractDecorator', mappedTo: 'CoffeeDecorator', explanation: { en: 'Implements and wraps ICoffee; delegates to the wrapped object.', ro: 'Implementeaza si impacheteaza ICoffee; deleaga obiectului impachetat.' } },
        { role: 'ConcreteDecorator', mappedTo: 'MilkDecorator / SugarDecorator', explanation: { en: 'Each adds one feature and calls the wrapped object for the rest.', ro: 'Fiecare adauga o functionalitate si apeleaza obiectul impachetat pentru rest.' } },
      ],
      answerOutline: [
        { en: 'Define ICoffee with getDescription() and getCost().', ro: 'Defineste ICoffee cu getDescription() si getCost().' },
        { en: 'Implement SimpleCoffee as the base concrete component.', ro: 'Implementeaza SimpleCoffee ca componenta concreta de baza.' },
        { en: 'Create abstract CoffeeDecorator that implements ICoffee and holds an ICoffee reference.', ro: 'Creeaza CoffeeDecorator abstract care implementeaza ICoffee si tine o referinta ICoffee.' },
        { en: 'Each concrete decorator (MilkDecorator, SugarDecorator) overrides getDescription() and getCost(), adding its part and delegating the rest.', ro: 'Fiecare decorator concret (MilkDecorator, SugarDecorator) suprascrie getDescription() si getCost(), adaugand partea sa si delegand restul.' },
      ],
    },
    selfTest: [
      {
        id: 'decorator-1',
        question: { en: 'Decorator differs from Adapter because Decorator...', ro: 'Decorator difera de Adapter deoarece Decorator...' },
        options: [
          { en: 'Keeps the same interface and adds behavior', ro: 'Pastreaza aceeasi interfata si adauga comportament' },
          { en: 'Translates between incompatible interfaces', ro: 'Traduce intre interfete incompatibile' },
          { en: 'Controls access to the wrapped object', ro: 'Controleaza accesul la obiectul impachetat' },
          { en: 'Builds a tree of objects', ro: 'Construieste un arbore de obiecte' },
        ],
        correctIndex: 0,
        explanation: { en: 'Decorator wraps with the same interface to add behavior. Adapter wraps to translate a different interface.', ro: 'Decorator impacheteaza cu aceeasi interfata pentru a adauga comportament. Adapter impacheteaza pentru a traduce o interfata diferita.' },
      },
      {
        id: 'decorator-2',
        question: { en: 'Which pattern should you choose when optional features must be stackable at runtime?', ro: 'Ce pattern alegi cand functionalitati optionale trebuie sa fie stivuibile la runtime?' },
        options: [
          { en: 'Proxy', ro: 'Proxy' },
          { en: 'Chain of Responsibility', ro: 'Chain of Responsibility' },
          { en: 'Decorator', ro: 'Decorator' },
          { en: 'Composite', ro: 'Composite' },
        ],
        correctIndex: 2,
        explanation: { en: 'Decorator is designed for stacking optional behaviors at runtime through wrapping objects with the same interface.', ro: 'Decorator este proiectat pentru stivuirea comportamentelor optionale la runtime prin impachetarea obiectelor cu aceeasi interfata.' },
      },
    ],
  },
  {
    id: 'composite',
    slug: 'composite',
    number: 3,
    name: { en: 'Composite', ro: 'Composite' },
    category: structural,
    oneliner: {
      en: 'Treat individual objects and groups uniformly through a shared interface.',
      ro: 'Trateaza obiecte individuale si grupuri uniform printr-o interfata comuna.',
    },
    analogy: {
      en: 'A file system: files and folders can both report size and print themselves.',
      ro: 'Un sistem de fisiere: fisierele si folderele pot raporta dimensiune si se pot afisa.',
    },
    participants: [
      { role: 'Component', description: { en: 'Interface shared by leaves and containers.', ro: 'Interfata comuna pentru frunze si containere.' }, example: 'FileSystemItem' },
      { role: 'Leaf', description: { en: 'Single item with no children.', ro: 'Element individual fara copii.' }, example: 'File' },
      { role: 'Composite', description: { en: 'Container with a list of Components.', ro: 'Container cu o lista de componente.' }, example: 'Folder' },
      { role: 'Client', description: { en: 'Uses Component without instanceof checks.', ro: 'Foloseste Component fara verificari instanceof.' }, example: 'main()' },
    ],
    structureDiagram: 'FileSystemItem <- File\nFileSystemItem <- Folder\nFolder contains List<FileSystemItem>',
    code: '',
    codeFile: 'CompositeExample.java',
    codeWalkthrough: [
      { stepNumber: 1, title: { en: 'Common contract', ro: 'Contract comun' }, description: { en: 'File and Folder expose the same operations.', ro: 'File si Folder expun aceleasi operatii.' }, highlightLines: [14, 15, 16, 17, 18], roleName: 'COMPONENT', roleColor: 'text-green-400' },
      { stepNumber: 2, title: { en: 'Leaf', ro: 'Frunza' }, description: { en: 'A File has no children.', ro: 'Un File nu are copii.' }, highlightLines: [21, 22, 23, 31, 34, 37, 38, 39], roleName: 'LEAF', roleColor: 'text-orange-400' },
      { stepNumber: 3, title: { en: 'Composite container', ro: 'Container composite' }, description: { en: 'Folder stores children as the shared interface.', ro: 'Folder stocheaza copiii ca interfata comuna.' }, highlightLines: [43, 44, 45, 51, 52, 63, 64, 65, 66, 67, 68, 69, 70], roleName: 'COMPOSITE', roleColor: 'text-blue-400' },
      { stepNumber: 4, title: { en: 'Recursive use', ro: 'Folosire recursiva' }, description: { en: 'The same call works for files, folders, and nested folders.', ro: 'Acelasi apel merge pentru fisiere, foldere si foldere imbricate.' }, highlightLines: [94, 95, 96, 98, 99, 101, 102, 103, 104, 107, 109, 110], roleName: 'CLIENT', roleColor: 'text-purple-400' },
    ],
    examKeywords: [
      { en: 'tree structure', ro: 'structura arborescenta' },
      { en: 'groups contain groups', ro: 'grupuri contin grupuri' },
      { en: 'treat uniformly', ro: 'trateaza uniform' },
    ],
    commonMistakes: [
      { en: 'Folder stores only Folder instead of Component.', ro: 'Folder stocheaza doar Folder in loc de Component.' },
      { en: 'Client uses instanceof instead of polymorphism.', ro: 'Clientul foloseste instanceof in loc de polimorfism.' },
    ],
    confusedWith: ['decorator', 'chain'],
    useWhen: [
      { en: 'You need to represent a part-whole hierarchy where items can be leaves or containers.', ro: 'Trebuie sa reprezinti o ierarhie parte-intreg unde elementele pot fi frunze sau containere.' },
      { en: 'Clients should treat individual objects and groups through the same interface.', ro: 'Clientii trebuie sa trateze obiecte individuale si grupuri prin aceeasi interfata.' },
    ],
    doNotUseWhen: [
      { en: 'Objects are not in a tree; stacking optional features means Decorator is more appropriate.', ro: 'Obiectele nu sunt intr-un arbore; stivuirea functiunilor optionale inseamna ca Decorator este mai potrivit.' },
      { en: 'Requests need to be routed through handlers one by one; use Chain of Responsibility.', ro: 'Cererile trebuie rutate prin handleri unul cate unul; foloseste Chain of Responsibility.' },
    ],
    examPhrases: [
      { en: 'Files and folders should both support printSize() without instanceof checks.', ro: 'Fisierele si folderele trebuie sa suporte printSize() fara verificari instanceof.' },
      { en: 'A menu item can be a leaf entry or a submenu, and both are treated the same way.', ro: 'Un element de meniu poate fi o intrare simpla sau un submeniu, si ambele sunt tratate la fel.' },
    ],
    solveExample: {
      problem: {
        en: 'A file system needs File and Folder to both expose printSize(). A Folder can contain Files or other Folders. The client should call printSize() on any item without instanceof. Choose a pattern.',
        ro: 'Un sistem de fisiere necesita ca File si Folder sa expuna ambele printSize(). Un Folder poate contine File-uri sau alte Foldere. Clientul sa apeleze printSize() pe orice element fara instanceof. Alege un pattern.',
      },
      keywords: [
        { en: 'tree structure', ro: 'structura arborescenta' },
        { en: 'treat uniformly', ro: 'trateaza uniform' },
        { en: 'groups contain groups', ro: 'grupuri contin grupuri' },
      ],
      reasoning: [
        { en: 'We have a part-whole hierarchy: Files are leaves, Folders are containers.', ro: 'Avem o ierarhie parte-intreg: File-urile sunt frunze, Folderele sunt containere.' },
        { en: 'The client should call the same operation on both without instanceof.', ro: 'Clientul trebuie sa apeleze aceeasi operatie pe ambele fara instanceof.' },
        { en: 'Folder stores children as the shared component interface, enabling recursion.', ro: 'Folder stocheaza copiii ca interfata comuna, permitand recursivitate.' },
        { en: 'Composite is the pattern for uniform treatment of individual items and groups.', ro: 'Composite este pattern-ul pentru tratarea uniforma a elementelor individuale si a grupurilor.' },
      ],
      roleMappings: [
        { role: 'Component', mappedTo: 'FileSystemItem', explanation: { en: 'Interface shared by both File and Folder.', ro: 'Interfata comuna pentru File si Folder.' } },
        { role: 'Leaf', mappedTo: 'File', explanation: { en: 'Has no children; implements FileSystemItem directly.', ro: 'Nu are copii; implementeaza direct FileSystemItem.' } },
        { role: 'Composite', mappedTo: 'Folder', explanation: { en: 'Stores List<FileSystemItem> and delegates printSize() to each child.', ro: 'Stocheaza List<FileSystemItem> si deleaga printSize() fiecarui copil.' } },
        { role: 'Client', mappedTo: 'main()', explanation: { en: 'Calls printSize() on any FileSystemItem without knowing if it is a File or Folder.', ro: 'Apeleaza printSize() pe orice FileSystemItem fara sa stie daca e File sau Folder.' } },
      ],
      answerOutline: [
        { en: 'Define FileSystemItem interface with printSize().', ro: 'Defineste interfata FileSystemItem cu printSize().' },
        { en: 'Implement File (leaf): printSize() prints its own size.', ro: 'Implementeaza File (frunza): printSize() afiseaza propria dimensiune.' },
        { en: 'Implement Folder (composite): holds List<FileSystemItem>; printSize() sums and delegates to children.', ro: 'Implementeaza Folder (composite): tine List<FileSystemItem>; printSize() sumeaza si deleaga copiilor.' },
        { en: 'Client calls printSize() uniformly on any FileSystemItem.', ro: 'Clientul apeleaza printSize() uniform pe orice FileSystemItem.' },
      ],
    },
    selfTest: [
      {
        id: 'composite-1',
        question: { en: 'Which clue most strongly suggests Composite?', ro: 'Care indiciu sugereaza cel mai puternic Composite?' },
        options: [
          { en: 'Tree structure where items can be leaves or containers', ro: 'Structura arborescenta unde elementele pot fi frunze sau containere' },
          { en: 'Incompatible interfaces', ro: 'Interfete incompatibile' },
          { en: 'Lazy loading of a heavy object', ro: 'Incarcare lazy a unui obiect greu' },
          { en: 'Queue of operations', ro: 'Coada de operatii' },
        ],
        correctIndex: 0,
        explanation: { en: 'Composite is specifically designed for part-whole hierarchies where leaves and containers are treated through the same interface.', ro: 'Composite este proiectat specific pentru ierarhii parte-intreg unde frunzele si containerele sunt tratate prin aceeasi interfata.' },
      },
      {
        id: 'composite-2',
        question: { en: 'What type should Folder store in its children list?', ro: 'Ce tip trebuie sa stocheze Folder in lista sa de copii?' },
        options: [
          { en: 'File only', ro: 'Doar File' },
          { en: 'Object', ro: 'Object' },
          { en: 'FileSystemItem (the shared interface)', ro: 'FileSystemItem (interfata comuna)' },
          { en: 'Folder only', ro: 'Doar Folder' },
        ],
        correctIndex: 2,
        explanation: { en: 'Folder must store the shared component interface (FileSystemItem) to allow uniform treatment and enable nesting of both leaves and composites.', ro: 'Folder trebuie sa stocheze interfata comuna (FileSystemItem) pentru a permite tratarea uniforma si imbricarea atat a frunzelor cat si a compositelor.' },
      },
    ],
  },
  {
    id: 'flyweight',
    slug: 'flyweight',
    number: 4,
    name: { en: 'Flyweight', ro: 'Flyweight' },
    category: structural,
    oneliner: {
      en: 'Share heavy intrinsic state across many lightweight objects.',
      ro: 'Partajeaza starea intrinseca grea intre multe obiecte usoare.',
    },
    analogy: {
      en: 'Many enemies share one 3D model; each render call passes position and color.',
      ro: 'Multi inamici partajeaza un model 3D; fiecare afisare primeste pozitie si culoare.',
    },
    participants: [
      { role: 'Flyweight', description: { en: 'Interface that receives extrinsic state.', ro: 'Interfata care primeste starea extrinseca.' }, example: 'ISprite' },
      { role: 'ConcreteFlyweight', description: { en: 'Stores shared intrinsic state.', ro: 'Stocheaza starea intrinseca partajata.' }, example: 'Sprite' },
      { role: 'Factory', description: { en: 'Reuses objects from a pool.', ro: 'Reutilizeaza obiecte dintr-un pool.' }, example: 'SpriteFactory' },
      { role: 'Client', description: { en: 'Supplies unique extrinsic state.', ro: 'Furnizeaza starea extrinseca unica.' }, example: 'main()' },
    ],
    structureDiagram: 'SpriteFactory HashMap<type, ISprite>\n  -> Sprite(model data shared)\ndisplay(x, y, color) receives extrinsic state',
    code: '',
    codeFile: 'FlyweightExample.java',
    codeWalkthrough: [
      { stepNumber: 1, title: { en: 'Extrinsic parameters', ro: 'Parametri extrinseci' }, description: { en: 'Position and color are passed in, not stored.', ro: 'Pozitia si culoarea sunt transmise, nu stocate.' }, highlightLines: [16, 17, 18, 19], roleName: 'FLYWEIGHT', roleColor: 'text-green-400' },
      { stepNumber: 2, title: { en: 'Shared model', ro: 'Model partajat' }, description: { en: 'Sprite keeps the heavy state once per type.', ro: 'Sprite pastreaza starea grea o singura data pe tip.' }, highlightLines: [22, 23, 24, 26, 27, 29, 30, 34, 35, 36], roleName: 'INTRINSIC', roleColor: 'text-orange-400' },
      { stepNumber: 3, title: { en: 'Pool lookup', ro: 'Cautare in pool' }, description: { en: 'Factory creates only missing types.', ro: 'Factory creeaza doar tipurile lipsa.' }, highlightLines: [41, 42, 44, 45, 46, 47, 48], roleName: 'FACTORY', roleColor: 'text-blue-400' },
      { stepNumber: 4, title: { en: 'Reuse proof', ro: 'Dovada reutilizarii' }, description: { en: 'Same object, different extrinsic values.', ro: 'Acelasi obiect, valori extrinseci diferite.' }, highlightLines: [60, 61, 62, 63, 68, 69, 75, 76, 78], roleName: 'CLIENT', roleColor: 'text-purple-400' },
    ],
    examKeywords: [
      { en: 'memory efficiency', ro: 'eficienta de memorie' },
      { en: 'many same-type objects', ro: 'multe obiecte de acelasi tip' },
      { en: 'intrinsic vs extrinsic state', ro: 'stare intrinseca vs extrinseca' },
    ],
    commonMistakes: [
      { en: 'Storing extrinsic state inside the flyweight.', ro: 'Stocarea starii extrinseci in flyweight.' },
      { en: 'Creating with new instead of using the factory pool.', ro: 'Crearea cu new in loc de pool-ul factory.' },
    ],
    confusedWith: ['composite', 'proxy'],
    useWhen: [
      { en: 'You need to create thousands of similar objects and memory is a concern.', ro: 'Trebuie sa creezi mii de obiecte similare si memoria este o problema.' },
      { en: 'Objects can share intrinsic state that does not change per instance.', ro: 'Obiectele pot partaja starea intrinseca care nu se schimba per instanta.' },
    ],
    doNotUseWhen: [
      { en: 'Each object is truly unique with no shared state; Flyweight adds unnecessary complexity.', ro: 'Fiecare obiect este unic fara stare partajata; Flyweight adauga complexitate inutila.' },
      { en: 'The number of objects is small; premature optimization is not needed.', ro: 'Numarul de obiecte este mic; optimizarea prematura nu este necesara.' },
    ],
    examPhrases: [
      { en: 'Thousands of enemy sprites share one mesh; only position and color differ per instance.', ro: 'Mii de spriteurs inamice partajeaza un mesh; doar pozitia si culoarea difera per instanta.' },
      { en: 'Memory usage is critical and many objects share the same read-only data.', ro: 'Utilizarea memoriei este critica si multe obiecte partajeaza aceleasi date read-only.' },
    ],
    solveExample: {
      problem: {
        en: 'A game renders 10,000 enemy sprites. Each has a unique position and color, but all share the same 3D model data. Choose a pattern to minimize memory.',
        ro: 'Un joc randeaza 10.000 de sprituri inamice. Fiecare are pozitie si culoare unica, dar toate partajeaza aceleasi date model 3D. Alege un pattern pentru a minimiza memoria.',
      },
      keywords: [
        { en: 'thousands of similar objects', ro: 'mii de obiecte similare' },
        { en: 'shared read-only data (intrinsic state)', ro: 'date partajate read-only (stare intrinseca)' },
        { en: 'memory efficiency', ro: 'eficienta de memorie' },
      ],
      reasoning: [
        { en: 'Storing the 3D model in each instance would waste enormous memory.', ro: 'Stocarea modelului 3D in fiecare instanta ar risipi memorie enorma.' },
        { en: 'The model is intrinsic (shared, read-only); position and color are extrinsic (unique per render call).', ro: 'Modelul este intrinsec (partajat, read-only); pozitia si culoarea sunt extrinseci (unice per apel de randare).' },
        { en: 'A factory pool returns the same Sprite object for the same enemy type.', ro: 'Un pool factory returneaza acelasi obiect Sprite pentru acelasi tip de inamic.' },
        { en: 'Flyweight separates intrinsic state (stored) from extrinsic state (passed in each call).', ro: 'Flyweight separa starea intrinseca (stocata) de starea extrinseca (pasata in fiecare apel).' },
      ],
      roleMappings: [
        { role: 'Flyweight', mappedTo: 'ISprite', explanation: { en: 'Interface that accepts extrinsic state in the display method.', ro: 'Interfata care accepta starea extrinseca in metoda display.' } },
        { role: 'ConcreteFlyweight', mappedTo: 'Sprite', explanation: { en: 'Stores the heavy shared model data; never stores position or color.', ro: 'Stocheaza datele grele ale modelului partajat; nu stocheaza niciodata pozitie sau culoare.' } },
        { role: 'Factory', mappedTo: 'SpriteFactory', explanation: { en: 'HashMap pool; returns existing Sprite for a type or creates one if missing.', ro: 'Pool HashMap; returneaza Sprite-ul existent pentru un tip sau creeaza unul daca lipseste.' } },
        { role: 'Client', mappedTo: 'Render loop', explanation: { en: 'Calls factory.getSprite(type).display(x, y, color) for each enemy.', ro: 'Apeleaza factory.getSprite(type).display(x, y, color) pentru fiecare inamic.' } },
      ],
      answerOutline: [
        { en: 'Define ISprite with display(int x, int y, String color) taking extrinsic state as parameters.', ro: 'Defineste ISprite cu display(int x, int y, String color) primind starea extrinseca ca parametri.' },
        { en: 'Implement Sprite: stores model data once; display() uses the passed-in position and color.', ro: 'Implementeaza Sprite: stocheaza datele modelului o singura data; display() foloseste pozitia si culoarea primite.' },
        { en: 'Implement SpriteFactory with a HashMap<String, ISprite>; getSprite() returns or creates the Sprite.', ro: 'Implementeaza SpriteFactory cu un HashMap<String, ISprite>; getSprite() returneaza sau creeaza Sprite-ul.' },
        { en: 'Client calls factory.getSprite("orc").display(x, y, color) for each enemy render.', ro: 'Clientul apeleaza factory.getSprite("orc").display(x, y, color) pentru fiecare randare a inamicului.' },
      ],
    },
    selfTest: [
      {
        id: 'flyweight-1',
        question: { en: 'Which state goes inside the Flyweight object?', ro: 'Ce stare se pune in interiorul obiectului Flyweight?' },
        options: [
          { en: 'Position per enemy instance', ro: 'Pozitia per instanta de inamic' },
          { en: 'Color per render call', ro: 'Culoarea per apel de randare' },
          { en: 'Shared 3D model data (intrinsic)', ro: 'Datele modelului 3D partajat (intrinsec)' },
          { en: 'Frame counter', ro: 'Contor de cadre' },
        ],
        correctIndex: 2,
        explanation: { en: 'Only intrinsic (shared, constant) state lives inside the Flyweight. Extrinsic state is passed in each method call.', ro: 'Doar starea intrinseca (partajata, constanta) traieste in interiorul Flyweight-ului. Starea extrinseca este pasata in fiecare apel de metoda.' },
      },
      {
        id: 'flyweight-2',
        question: { en: 'What role creates and caches Flyweight instances to avoid duplicates?', ro: 'Ce rol creeaza si stocheaza instante Flyweight pentru a evita duplicatele?' },
        options: [
          { en: 'Client', ro: 'Client' },
          { en: 'Proxy', ro: 'Proxy' },
          { en: 'Factory', ro: 'Factory' },
          { en: 'Decorator', ro: 'Decorator' },
        ],
        correctIndex: 2,
        explanation: { en: 'The Factory (pool) creates a new Flyweight only if one for that type does not exist yet, then returns the cached instance.', ro: 'Factory-ul (pool) creeaza un nou Flyweight doar daca unul pentru acel tip nu exista inca, apoi returneaza instanta stocata in cache.' },
      },
    ],
  },
  {
    id: 'facade',
    slug: 'facade',
    number: 5,
    name: { en: 'Facade', ro: 'Facade' },
    category: structural,
    oneliner: {
      en: 'Expose one simple API over a complex subsystem.',
      ro: 'Expune un API simplu peste un subsistem complex.',
    },
    analogy: {
      en: 'A car ignition key hides the steps needed to start engine subsystems.',
      ro: 'Cheia masinii ascunde pasii necesari pentru pornirea subsistemelor.',
    },
    participants: [
      { role: 'Subsystems', description: { en: 'Detailed classes that do real work.', ro: 'Clase detaliate care fac munca reala.' }, example: 'Window, AlarmSystem' },
      { role: 'Facade', description: { en: 'High-level class that orchestrates calls.', ro: 'Clasa high-level care orchestreaza apeluri.' }, example: 'HomeAutomationFacade' },
      { role: 'Client', description: { en: 'Calls a simple method instead of many subsystem methods.', ro: 'Apeleaza o metoda simpla in loc de multe metode.' }, example: 'main()' },
    ],
    structureDiagram: 'Client -> HomeAutomationFacade.leaveHome()\nFacade -> faucet.turnOff(), washer.stop(), window.close(), alarm.arm()',
    code: '',
    codeFile: 'FacadeExample.java',
    codeWalkthrough: [
      { stepNumber: 1, title: { en: 'Complex subsystem', ro: 'Subsistem complex' }, description: { en: 'Many classes each expose their own operations.', ro: 'Multe clase expun propriile operatii.' }, highlightLines: [11, 12, 13, 14, 17, 18, 19, 22, 23, 24, 26, 29, 30, 31], roleName: 'SUBSYSTEM', roleColor: 'text-orange-400' },
      { stepNumber: 2, title: { en: 'Facade owns subsystems', ro: 'Facade detine subsistemele' }, description: { en: 'The facade creates and holds the subsystem instances.', ro: 'Facade creeaza si pastreaza instantele subsistemului.' }, highlightLines: [37, 38, 39, 40, 41, 43, 44, 45, 46, 47], roleName: 'FACADE', roleColor: 'text-blue-400' },
      { stepNumber: 3, title: { en: 'Simple operations', ro: 'Operatii simple' }, description: { en: 'One method coordinates multiple lower-level calls.', ro: 'O metoda coordoneaza mai multe apeluri low-level.' }, highlightLines: [51, 52, 53, 54, 55, 56, 57, 60, 61, 62, 63, 64, 67, 68, 69], roleName: 'API', roleColor: 'text-green-400' },
      { stepNumber: 4, title: { en: 'Client uses the front door', ro: 'Clientul foloseste intrarea simpla' }, description: { en: 'The client avoids subsystem ordering details.', ro: 'Clientul evita detaliile de ordine ale subsistemelor.' }, highlightLines: [76, 78, 79, 82, 85], roleName: 'CLIENT', roleColor: 'text-purple-400' },
    ],
    examKeywords: [
      { en: 'simplified API', ro: 'API simplificat' },
      { en: 'hide complexity', ro: 'ascunde complexitatea' },
      { en: 'many subsystem classes', ro: 'multe clase de subsistem' },
    ],
    commonMistakes: [
      { en: 'Replacing the subsystem instead of delegating to it.', ro: 'Inlocuirea subsistemului in loc de delegare.' },
      { en: 'Confusing simplification with interface compatibility.', ro: 'Confundarea simplificarii cu compatibilizarea interfetelor.' },
    ],
    confusedWith: ['adapter', 'proxy'],
    useWhen: [
      { en: 'A complex subsystem needs a single simple entry point for common operations.', ro: 'Un subsistem complex necesita un singur punct de intrare simplu pentru operatii comune.' },
      { en: 'You want to decouple client code from the details and ordering of subsystem calls.', ro: 'Vrei sa decuplezi codul clientului de detaliile si ordinea apelurilor subsistemului.' },
    ],
    doNotUseWhen: [
      { en: 'The interfaces are incompatible and need translation; use Adapter instead.', ro: 'Interfetele sunt incompatibile si necesita traducere; foloseste Adapter.' },
      { en: 'You only need to control access or delay initialization; use Proxy instead.', ro: 'Trebuie doar sa controlezi accesul sau sa intarzii initializarea; foloseste Proxy.' },
    ],
    examPhrases: [
      { en: 'The client only needs to call leaveHome() without knowing each subsystem step.', ro: 'Clientul trebuie doar sa apeleze leaveHome() fara sa stie fiecare pas al subsistemului.' },
      { en: 'Expose one simple method that coordinates multiple internal components in sequence.', ro: 'Expune o singura metoda simpla care coordoneaza mai multe componente interne in secventa.' },
    ],
    solveExample: {
      problem: {
        en: 'A smart home app needs the user to call one method to turn off lights, close windows, and arm the alarm. The client should not coordinate these steps manually. Choose a pattern.',
        ro: 'O aplicatie smart home necesita ca utilizatorul sa apeleze o singura metoda pentru a stinge luminile, inchide ferestrele si arma alarma. Clientul nu trebuie sa coordoneze acesti pasi manual. Alege un pattern.',
      },
      keywords: [
        { en: 'simplified API', ro: 'API simplificat' },
        { en: 'hide complexity', ro: 'ascunde complexitatea' },
        { en: 'many subsystem classes', ro: 'multe clase de subsistem' },
      ],
      reasoning: [
        { en: 'The client should not need to know each subsystem or its correct call order.', ro: 'Clientul nu trebuie sa cunoasca fiecare subsistem sau ordinea corecta de apeluri.' },
        { en: 'We wrap the sequence of steps behind one high-level method.', ro: 'Impachetam secventa de pasi in spatele unei singure metode de nivel inalt.' },
        { en: 'Facade does not change interfaces or add new behavior; it only orchestrates.', ro: 'Facade nu schimba interfete si nu adauga comportament nou; doar orchestreaza.' },
      ],
      roleMappings: [
        { role: 'Facade', mappedTo: 'HomeAutomationFacade', explanation: { en: 'Provides leaveHome() and arriveHome() and coordinates the subsystems.', ro: 'Furnizeaza leaveHome() si arriveHome() si coordoneaza subsistemele.' } },
        { role: 'Subsystems', mappedTo: 'AlarmSystem, Window, LightController', explanation: { en: 'Each exposes its own low-level operations.', ro: 'Fiecare expune propriile operatii de nivel scazut.' } },
        { role: 'Client', mappedTo: 'main()', explanation: { en: 'Calls only the Facade methods; unaware of subsystem details.', ro: 'Apeleaza doar metodele Facade; necunoscut detaliilor subsistemului.' } },
      ],
      answerOutline: [
        { en: 'Create HomeAutomationFacade that holds references to AlarmSystem, Window, LightController.', ro: 'Creeaza HomeAutomationFacade care tine referinte la AlarmSystem, Window, LightController.' },
        { en: 'Implement leaveHome(): lights.off(), window.close(), alarm.arm() in the correct order.', ro: 'Implementeaza leaveHome(): lights.off(), window.close(), alarm.arm() in ordinea corecta.' },
        { en: 'Client calls facade.leaveHome() without knowing any subsystem details.', ro: 'Clientul apeleaza facade.leaveHome() fara sa cunoasca detaliile subsistemului.' },
      ],
    },
    selfTest: [
      {
        id: 'facade-1',
        question: { en: 'The key purpose of Facade is to...', ro: 'Scopul principal al Facade este sa...' },
        options: [
          { en: 'Translate between incompatible interfaces', ro: 'Traduca intre interfete incompatibile' },
          { en: 'Add optional behavior at runtime', ro: 'Adauge comportament optional la runtime' },
          { en: 'Provide a simple API over a complex subsystem', ro: 'Furnizeze un API simplu peste un subsistem complex' },
          { en: 'Control access to an object', ro: 'Controleze accesul la un obiect' },
        ],
        correctIndex: 2,
        explanation: { en: 'Facade hides subsystem complexity behind one simple interface. It does not translate, add behavior, or control access.', ro: 'Facade ascunde complexitatea subsistemului in spatele unei interfete simple. Nu traduce, nu adauga comportament si nu controleaza accesul.' },
      },
      {
        id: 'facade-2',
        question: { en: 'Which pattern would you use instead of Facade when the interfaces are incompatible?', ro: 'Ce pattern ai folosi in loc de Facade cand interfetele sunt incompatibile?' },
        options: [
          { en: 'Decorator', ro: 'Decorator' },
          { en: 'Adapter', ro: 'Adapter' },
          { en: 'Observer', ro: 'Observer' },
          { en: 'Command', ro: 'Command' },
        ],
        correctIndex: 1,
        explanation: { en: 'Adapter is the pattern for translating incompatible interfaces. Facade assumes interfaces are already correct; it only simplifies access.', ro: 'Adapter este pattern-ul pentru traducerea interfetelor incompatibile. Facade presupune ca interfetele sunt deja corecte; doar simplifica accesul.' },
      },
    ],
  },
  {
    id: 'proxy',
    slug: 'proxy',
    number: 6,
    name: { en: 'Proxy', ro: 'Proxy' },
    category: structural,
    oneliner: {
      en: 'Stand in front of another object to control access with the same interface.',
      ro: 'Sta in fata altui obiect pentru a controla accesul cu aceeasi interfata.',
    },
    analogy: {
      en: 'A credit card stands in for a bank account and adds security and logging.',
      ro: 'Un card bancar reprezinta contul si adauga securitate si jurnalizare.',
    },
    participants: [
      { role: 'Subject', description: { en: 'Interface shared by proxy and real object.', ro: 'Interfata comuna pentru proxy si obiectul real.' }, example: 'IImage, IChatServer' },
      { role: 'RealSubject', description: { en: 'Object that does the real work.', ro: 'Obiectul care face munca reala.' }, example: 'HighResImage, RealChatServer' },
      { role: 'Proxy', description: { en: 'Wraps the real subject and decides access.', ro: 'Impacheteaza subiectul real si decide accesul.' }, example: 'ImageProxy, ChatFilterProxy' },
    ],
    structureDiagram: 'Client -> Subject\nSubject <- RealSubject\nSubject <- Proxy -> wraps RealSubject',
    code: '',
    codeFile: 'ProxyExample.java',
    codeWalkthrough: [
      { stepNumber: 1, title: { en: 'Same interface', ro: 'Aceeasi interfata' }, description: { en: 'Proxy and real subject are substitutable.', ro: 'Proxy si subiectul real sunt substituibile.' }, highlightLines: [15, 16, 17, 18, 62, 63, 64], roleName: 'SUBJECT', roleColor: 'text-green-400' },
      { stepNumber: 2, title: { en: 'Lazy real object', ro: 'Obiect real lazy' }, description: { en: 'The expensive image loads only when needed.', ro: 'Imaginea costisitoare se incarca doar cand e nevoie.' }, highlightLines: [40, 42, 50, 51, 52, 53, 54], roleName: 'VIRTUAL', roleColor: 'text-blue-400' },
      { stepNumber: 3, title: { en: 'Protection proxy', ro: 'Proxy de protectie' }, description: { en: 'The proxy filters messages before delegating.', ro: 'Proxy-ul filtreaza mesajele inainte de delegare.' }, highlightLines: [74, 75, 76, 83, 84, 85, 86, 88], roleName: 'PROTECTION', roleColor: 'text-orange-400' },
      { stepNumber: 4, title: { en: 'Client is unaware', ro: 'Clientul nu stie' }, description: { en: 'The client uses the interface either way.', ro: 'Clientul foloseste interfata in ambele cazuri.' }, highlightLines: [104, 105, 109, 111, 114, 115, 116], roleName: 'CLIENT', roleColor: 'text-purple-400' },
    ],
    examKeywords: [
      { en: 'control access', ro: 'controleaza accesul' },
      { en: 'lazy loading', ro: 'incarcare la cerere' },
      { en: 'filter or block', ro: 'filtreaza sau blocheaza' },
    ],
    commonMistakes: [
      { en: 'Changing the interface like Adapter.', ro: 'Schimbarea interfetei ca la Adapter.' },
      { en: 'Adding features when the intent is access control.', ro: 'Adaugarea de functionalitati cand intentia este controlul accesului.' },
    ],
    confusedWith: ['adapter', 'decorator'],
    useWhen: [
      { en: 'You need to control access to an object (protection proxy) or delay expensive creation (virtual proxy).', ro: 'Trebuie sa controlezi accesul la un obiect (proxy de protectie) sau sa intarzii crearea costisitoare (proxy virtual).' },
      { en: 'You want to add logging, caching, or filtering transparently using the same interface.', ro: 'Vrei sa adaugi logging, caching sau filtrare transparent folosind aceeasi interfata.' },
    ],
    doNotUseWhen: [
      { en: 'You want to add optional stackable features; use Decorator instead.', ro: 'Vrei sa adaugi functionalitati optionale stivuibile; foloseste Decorator.' },
      { en: 'The interface is incompatible and needs translation; use Adapter instead.', ro: 'Interfata este incompatibila si necesita traducere; foloseste Adapter.' },
    ],
    examPhrases: [
      { en: 'Load the image only when it is first displayed.', ro: 'Incarca imaginea doar cand este afisata pentru prima data.' },
      { en: 'Block messages containing forbidden words before forwarding to the real server.', ro: 'Blocheaza mesajele cu cuvinte interzise inainte de a le trimite serverului real.' },
    ],
    solveExample: {
      problem: {
        en: 'A chat application must filter offensive words before passing messages to the real server. The client uses IChatServer. The filtering should be transparent to the client. Choose a pattern.',
        ro: 'O aplicatie de chat trebuie sa filtreze cuvintele ofensive inainte de a trimite mesaje serverului real. Clientul foloseste IChatServer. Filtrarea trebuie sa fie transparenta clientului. Alege un pattern.',
      },
      keywords: [
        { en: 'filter or block before forwarding', ro: 'filtreaza sau blocheaza inainte de a transmite' },
        { en: 'client uses same interface', ro: 'clientul foloseste aceeasi interfata' },
        { en: 'transparent to client', ro: 'transparent pentru client' },
      ],
      reasoning: [
        { en: 'The client uses IChatServer; we can substitute our own object without changing the client.', ro: 'Clientul foloseste IChatServer; putem substitui propriul nostru obiect fara a schimba clientul.' },
        { en: 'The proxy intercepts calls, applies access control logic, and optionally delegates.', ro: 'Proxy-ul intercepteaza apelurile, aplica logica de control al accesului si optional deleaga.' },
        { en: 'The interface stays the same, so the client is unaware of the proxy.', ro: 'Interfata ramane aceeasi, deci clientul nu stie de proxy.' },
        { en: 'Proxy is the pattern for transparent access control, filtering, and lazy loading.', ro: 'Proxy este pattern-ul pentru controlul transparent al accesului, filtrare si incarcare lazy.' },
      ],
      roleMappings: [
        { role: 'Subject', mappedTo: 'IChatServer', explanation: { en: 'Interface shared by both the real server and the proxy.', ro: 'Interfata comuna pentru serverul real si proxy.' } },
        { role: 'RealSubject', mappedTo: 'RealChatServer', explanation: { en: 'The actual server that sends messages.', ro: 'Serverul real care trimite mesaje.' } },
        { role: 'Proxy', mappedTo: 'ChatFilterProxy', explanation: { en: 'Checks messages for forbidden words; delegates clean messages to RealChatServer.', ro: 'Verifica mesajele pentru cuvinte interzise; deleaga mesajele curate la RealChatServer.' } },
      ],
      answerOutline: [
        { en: 'Define IChatServer with sendMessage(String msg).', ro: 'Defineste IChatServer cu sendMessage(String msg).' },
        { en: 'Implement RealChatServer that sends messages normally.', ro: 'Implementeaza RealChatServer care trimite mesaje normal.' },
        { en: 'Implement ChatFilterProxy: holds a RealChatServer; sendMessage() checks for forbidden words, then delegates if clean.', ro: 'Implementeaza ChatFilterProxy: tine un RealChatServer; sendMessage() verifica cuvintele interzise, apoi deleaga daca e curat.' },
        { en: 'Client uses IChatServer; receives ChatFilterProxy without knowing it.', ro: 'Clientul foloseste IChatServer; primeste ChatFilterProxy fara sa stie.' },
      ],
    },
    selfTest: [
      {
        id: 'proxy-1',
        question: { en: 'Which Proxy variant delays object creation until first use?', ro: 'Ce varianta de Proxy intarzie crearea obiectului pana la prima utilizare?' },
        options: [
          { en: 'Protection proxy', ro: 'Proxy de protectie' },
          { en: 'Remote proxy', ro: 'Proxy remote' },
          { en: 'Virtual proxy', ro: 'Proxy virtual' },
          { en: 'Logging proxy', ro: 'Proxy de logging' },
        ],
        correctIndex: 2,
        explanation: { en: 'A virtual proxy delays expensive object creation until it is actually needed, improving startup performance.', ro: 'Un proxy virtual intarzie crearea costisitoare a obiectului pana cand este de fapt necesar, imbunatatind performanta la pornire.' },
      },
      {
        id: 'proxy-2',
        question: { en: 'Proxy differs from Decorator because Proxy...', ro: 'Proxy difera de Decorator deoarece Proxy...' },
        options: [
          { en: 'Adds optional stackable features', ro: 'Adauga functionalitati optionale stivuibile' },
          { en: 'Controls or gates access to the real object', ro: 'Controleaza sau restrictioneaza accesul la obiectul real' },
          { en: 'Translates between different interfaces', ro: 'Traduce intre interfete diferite' },
          { en: 'Represents a tree of objects', ro: 'Reprezinta un arbore de obiecte' },
        ],
        correctIndex: 1,
        explanation: { en: 'Proxy controls access (protection, virtual, logging). Decorator adds behavior. Both keep the same interface, but their intent differs.', ro: 'Proxy controleaza accesul (protectie, virtual, logging). Decorator adauga comportament. Ambele pastreaza aceeasi interfata, dar intentia lor difera.' },
      },
    ],
  },
  {
    id: 'strategy',
    slug: 'strategy',
    number: 7,
    name: { en: 'Strategy', ro: 'Strategy' },
    category: behavioral,
    oneliner: {
      en: 'Swap algorithms at runtime behind a common interface.',
      ro: 'Schimba algoritmi la runtime in spatele unei interfete comune.',
    },
    analogy: {
      en: 'A maps app switches between car, bicycle, and walking routes.',
      ro: 'O aplicatie de harti comuta intre rute auto, bicicleta si mers pe jos.',
    },
    participants: [
      { role: 'Strategy', description: { en: 'Algorithm contract.', ro: 'Contractul algoritmului.' }, example: 'IPaymentStrategy' },
      { role: 'ConcreteStrategies', description: { en: 'Different algorithms.', ro: 'Algoritmi diferiti.' }, example: 'CardPayment, PayPalPayment' },
      { role: 'Context', description: { en: 'Delegates work to the current strategy.', ro: 'Deleaga munca strategiei curente.' }, example: 'ShoppingCart' },
      { role: 'Client', description: { en: 'Chooses and injects a strategy.', ro: 'Alege si injecteaza strategia.' }, example: 'main()' },
    ],
    structureDiagram: 'ShoppingCart has IPaymentStrategy\nCardPayment / PayPalPayment / CryptoPayment implement IPaymentStrategy\ncheckout() -> strategy.pay(amount)',
    code: '',
    codeFile: 'StrategyExample.java',
    codeWalkthrough: [
      { stepNumber: 1, title: { en: 'Algorithm interface', ro: 'Interfata algoritmului' }, description: { en: 'Every payment method follows the same contract.', ro: 'Fiecare metoda de plata respecta acelasi contract.' }, highlightLines: [11, 12, 13, 14], roleName: 'STRATEGY', roleColor: 'text-green-400' },
      { stepNumber: 2, title: { en: 'Concrete algorithms', ro: 'Algoritmi concreti' }, description: { en: 'Each class implements payment differently.', ro: 'Fiecare clasa implementeaza plata diferit.' }, highlightLines: [17, 18, 25, 26, 27, 34, 42, 43, 47, 50, 58, 59, 63], roleName: 'ALGORITHM', roleColor: 'text-orange-400' },
      { stepNumber: 3, title: { en: 'Context delegates', ro: 'Contextul deleaga' }, description: { en: 'ShoppingCart knows only the strategy interface.', ro: 'ShoppingCart cunoaste doar interfata strategiei.' }, highlightLines: [67, 68, 70, 71, 75, 81], roleName: 'CONTEXT', roleColor: 'text-blue-400' },
      { stepNumber: 4, title: { en: 'Runtime switch', ro: 'Schimbare la runtime' }, description: { en: 'The client changes behavior without editing the context.', ro: 'Clientul schimba comportamentul fara sa editeze contextul.' }, highlightLines: [88, 91, 92, 96, 97, 98, 102, 103, 104], roleName: 'CLIENT', roleColor: 'text-purple-400' },
    ],
    examKeywords: [
      { en: 'different methods', ro: 'metode diferite' },
      { en: 'user preferences', ro: 'preferinte utilizator' },
      { en: 'new methods in future', ro: 'metode noi in viitor' },
    ],
    commonMistakes: [
      { en: 'Hardcoding concrete strategies inside the context.', ro: 'Hardcodarea strategiilor concrete in context.' },
      { en: 'Using if/else instead of polymorphism.', ro: 'Folosirea if/else in loc de polimorfism.' },
    ],
    confusedWith: ['chain', 'command'],
    useWhen: [
      { en: 'You need to switch between interchangeable algorithms at runtime based on user preference or configuration.', ro: 'Trebuie sa comuti intre algoritmi interschimbabili la runtime in functie de preferinta utilizatorului sau configuratie.' },
      { en: 'You want to remove if/else chains that select different behaviors.', ro: 'Vrei sa elimini lanturile if/else care selecteaza comportamente diferite.' },
    ],
    doNotUseWhen: [
      { en: 'Requests need to be routed through multiple handlers; use Chain of Responsibility.', ro: 'Cererile trebuie rutate prin mai multi handleri; foloseste Chain of Responsibility.' },
      { en: 'Actions need to be queued, logged, or undone; use Command instead.', ro: 'Actiunile trebuie puse in coada, jurnalizate sau anulate; foloseste Command.' },
    ],
    examPhrases: [
      { en: 'The user chooses between PayPal, card, or crypto at checkout.', ro: 'Utilizatorul alege intre PayPal, card sau crypto la finalizarea comenzii.' },
      { en: 'The algorithm is selected based on user preference; new methods may be added in future.', ro: 'Algoritmul este selectat pe baza preferintei utilizatorului; metode noi pot fi adaugate in viitor.' },
    ],
    solveExample: {
      problem: {
        en: 'A shopping cart supports PayPal, credit card, and crypto payment. The payment method is chosen by the user at checkout. New payment methods may be added later. Choose a pattern.',
        ro: 'Un cos de cumparaturi suporta plata PayPal, card de credit si crypto. Metoda de plata este aleasa de utilizator la finalizare. Metode noi de plata pot fi adaugate ulterior. Alege un pattern.',
      },
      keywords: [
        { en: 'user chooses between methods', ro: 'utilizatorul alege intre metode' },
        { en: 'interchangeable algorithms', ro: 'algoritmi interschimbabili' },
        { en: 'new methods may be added', ro: 'metode noi pot fi adaugate' },
      ],
      reasoning: [
        { en: 'The payment logic differs per method, but the interface is the same.', ro: 'Logica de plata difera per metoda, dar interfata este aceeasi.' },
        { en: 'The context (ShoppingCart) should not know the concrete algorithm.', ro: 'Contextul (ShoppingCart) nu trebuie sa cunoasca algoritmul concret.' },
        { en: 'Strategy allows injecting any algorithm at runtime without changing the context.', ro: 'Strategy permite injectarea oricarui algoritm la runtime fara a schimba contextul.' },
        { en: 'New strategies can be added without modifying ShoppingCart.', ro: 'Strategii noi pot fi adaugate fara a modifica ShoppingCart.' },
      ],
      roleMappings: [
        { role: 'Strategy', mappedTo: 'IPaymentStrategy', explanation: { en: 'Common interface for all payment algorithms.', ro: 'Interfata comuna pentru toti algoritmii de plata.' } },
        { role: 'ConcreteStrategies', mappedTo: 'CardPayment, PayPalPayment, CryptoPayment', explanation: { en: 'Each implements pay(amount) differently.', ro: 'Fiecare implementeaza pay(amount) diferit.' } },
        { role: 'Context', mappedTo: 'ShoppingCart', explanation: { en: 'Holds an IPaymentStrategy and calls it in checkout().', ro: 'Tine un IPaymentStrategy si il apeleaza in checkout().' } },
        { role: 'Client', mappedTo: 'main()', explanation: { en: 'Injects the chosen strategy: cart.setStrategy(new PayPalPayment()).', ro: 'Injecteaza strategia aleasa: cart.setStrategy(new PayPalPayment()).' } },
      ],
      answerOutline: [
        { en: 'Define IPaymentStrategy with pay(double amount).', ro: 'Defineste IPaymentStrategy cu pay(double amount).' },
        { en: 'Implement CardPayment, PayPalPayment, CryptoPayment each with their own pay() logic.', ro: 'Implementeaza CardPayment, PayPalPayment, CryptoPayment fiecare cu propria logica pay().' },
        { en: 'ShoppingCart holds IPaymentStrategy; checkout() calls strategy.pay(total).', ro: 'ShoppingCart tine IPaymentStrategy; checkout() apeleaza strategy.pay(total).' },
        { en: 'Client injects strategy before checkout: cart.setStrategy(new PayPalPayment()).', ro: 'Clientul injecteaza strategia inainte de checkout: cart.setStrategy(new PayPalPayment()).' },
      ],
    },
    selfTest: [
      {
        id: 'strategy-1',
        question: { en: 'Strategy is best when you need to...', ro: 'Strategy este cel mai bun cand trebuie sa...' },
        options: [
          { en: 'Pass a request through multiple handlers', ro: 'Pasezi o cerere prin mai multi handleri' },
          { en: 'Swap interchangeable algorithms at runtime', ro: 'Schimbi algoritmi interschimbabili la runtime' },
          { en: 'Undo or queue actions', ro: 'Anulezi sau pui in coada actiuni' },
          { en: 'Notify multiple subscribers', ro: 'Notifici mai multi abonati' },
        ],
        correctIndex: 1,
        explanation: { en: 'Strategy encapsulates interchangeable algorithms behind a common interface so the context can swap them at runtime.', ro: 'Strategy incapsuleaza algoritmi interschimbabili in spatele unei interfete comune astfel incat contextul sa ii poata schimba la runtime.' },
      },
      {
        id: 'strategy-2',
        question: { en: 'In Strategy, which role injects the chosen algorithm into the context?', ro: 'In Strategy, ce rol injecteaza algoritmul ales in context?' },
        options: [
          { en: 'ConcreteStrategy', ro: 'ConcreteStrategy' },
          { en: 'Subject', ro: 'Subject' },
          { en: 'Client', ro: 'Client' },
          { en: 'Observer', ro: 'Observer' },
        ],
        correctIndex: 2,
        explanation: { en: 'The Client selects a concrete strategy and injects it into the Context before or during operation.', ro: 'Clientul selecteaza o strategie concreta si o injecteaza in Context inainte sau in timpul operatiei.' },
      },
    ],
  },
  {
    id: 'chain',
    slug: 'chain',
    number: 8,
    name: { en: 'Chain of Responsibility', ro: 'Chain of Responsibility' },
    category: behavioral,
    oneliner: {
      en: 'Pass a request along handlers until one handles it.',
      ro: 'Paseaza o cerere prin handleri pana cand unul o rezolva.',
    },
    analogy: {
      en: 'IT support escalation from junior to senior to manager.',
      ro: 'Escaladare suport IT de la junior la senior la manager.',
    },
    participants: [
      { role: 'Handler', description: { en: 'Defines next handler and request handling.', ro: 'Defineste urmatorul handler si tratarea cererii.' }, example: 'SupportHandler' },
      { role: 'ConcreteHandlers', description: { en: 'Handle what they can or pass along.', ro: 'Rezolva ce pot sau paseaza mai departe.' }, example: 'JuniorDev, SeniorDev' },
      { role: 'Request', description: { en: 'Object traveling through the chain.', ro: 'Obiectul care circula prin lant.' }, example: 'Ticket' },
      { role: 'Client', description: { en: 'Builds the chain and starts at the first handler.', ro: 'Construieste lantul si porneste de la primul handler.' }, example: 'main()' },
    ],
    structureDiagram: 'Client -> JuniorDev -> SeniorDev -> Manager -> end\nEach handler: handle or passToNext()',
    code: '',
    codeFile: 'ChainExample.java',
    codeWalkthrough: [
      { stepNumber: 1, title: { en: 'Request object', ro: 'Obiect cerere' }, description: { en: 'The ticket carries priority and description.', ro: 'Ticketul transporta prioritate si descriere.' }, highlightLines: [10, 11, 12, 14, 15, 16, 19, 20], roleName: 'REQUEST', roleColor: 'text-green-400' },
      { stepNumber: 2, title: { en: 'Handler link', ro: 'Legatura handler' }, description: { en: 'Each handler stores the next handler.', ro: 'Fiecare handler stocheaza urmatorul handler.' }, highlightLines: [29, 30, 32, 33, 36, 39, 40, 41, 42, 43], roleName: 'HANDLER', roleColor: 'text-blue-400' },
      { stepNumber: 3, title: { en: 'Handle or pass', ro: 'Rezolva sau paseaza' }, description: { en: 'Concrete handlers decide locally.', ro: 'Handlerii concreti decid local.' }, highlightLines: [49, 51, 52, 53, 54, 55, 56, 61, 63, 64, 65, 66, 67, 68], roleName: 'CHAIN', roleColor: 'text-orange-400' },
      { stepNumber: 4, title: { en: 'Build chain', ro: 'Construire lant' }, description: { en: 'The client connects handlers and sends requests to the first one.', ro: 'Clientul conecteaza handlerii si trimite cereri primului.' }, highlightLines: [89, 90, 91, 93, 94, 95, 106, 107, 108], roleName: 'CLIENT', roleColor: 'text-purple-400' },
    ],
    examKeywords: [
      { en: 'priority levels', ro: 'niveluri de prioritate' },
      { en: 'pass to next handler', ro: 'paseaza la urmatorul handler' },
      { en: 'escalate', ro: 'escaladeaza' },
    ],
    commonMistakes: [
      { en: 'Forgetting to pass when not handled.', ro: 'Uitarea pasarii mai departe cand nu e rezolvat.' },
      { en: 'Making all handlers process every request.', ro: 'Toti handlerii proceseaza fiecare cerere.' },
    ],
    confusedWith: ['strategy', 'command', 'observer'],
    useWhen: [
      { en: 'Requests have different priority levels and multiple handlers may or may not process them.', ro: 'Cererile au niveluri diferite de prioritate si mai multi handleri pot sau nu sa le proceseze.' },
      { en: 'The handler responsible for a request is not known in advance.', ro: 'Handler-ul responsabil de o cerere nu este cunoscut in avans.' },
    ],
    doNotUseWhen: [
      { en: 'One specific algorithm should handle all requests; use Strategy.', ro: 'Un algoritm specific trebuie sa proceseze toate cererile; foloseste Strategy.' },
      { en: 'Every subscriber must react to the same event; use Observer.', ro: 'Toti abonatii trebuie sa reactioneze la acelasi eveniment; foloseste Observer.' },
    ],
    examPhrases: [
      { en: 'A support ticket escalates from junior to senior to manager based on priority.', ro: 'Un ticket de suport escaladeaza de la junior la senior la manager in functie de prioritate.' },
      { en: 'Pass the request to the next handler if this one cannot process it.', ro: 'Paseaza cererea urmatorului handler daca acesta nu o poate procesa.' },
    ],
    solveExample: {
      problem: {
        en: 'A support ticket system has JuniorDev, SeniorDev, and Manager. JuniorDev handles priority 1-2, SeniorDev handles 3-4, Manager handles 5. Higher-priority tickets escalate upward. Choose a pattern.',
        ro: 'Un sistem de tickete de suport are JuniorDev, SeniorDev si Manager. JuniorDev trateaza prioritatea 1-2, SeniorDev 3-4, Manager 5. Ticketele cu prioritate mai mare escaladeaza in sus. Alege un pattern.',
      },
      keywords: [
        { en: 'priority levels', ro: 'niveluri de prioritate' },
        { en: 'escalate to next handler', ro: 'escaladeaza la urmatorul handler' },
        { en: 'pass if cannot handle', ro: 'paseaza daca nu poate trata' },
      ],
      reasoning: [
        { en: 'Each handler decides locally whether it can handle the ticket based on priority.', ro: 'Fiecare handler decide local daca poate trata ticketul in functie de prioritate.' },
        { en: 'Handlers are linked; unhandled requests move to the next in line.', ro: 'Handlerii sunt conectati; cererile netratate trec la urmatorul din lant.' },
        { en: 'The client sends to the first handler without knowing who will handle it.', ro: 'Clientul trimite la primul handler fara sa stie cine il va trata.' },
        { en: 'Chain of Responsibility is the pattern for ordered escalation through handlers.', ro: 'Chain of Responsibility este pattern-ul pentru escaladarea ordonata prin handleri.' },
      ],
      roleMappings: [
        { role: 'Handler', mappedTo: 'SupportHandler', explanation: { en: 'Abstract class with setNext() and handle(Ticket).', ro: 'Clasa abstracta cu setNext() si handle(Ticket).' } },
        { role: 'ConcreteHandlers', mappedTo: 'JuniorDev, SeniorDev, Manager', explanation: { en: 'Each checks priority; handles if within range, otherwise calls next.handle().', ro: 'Fiecare verifica prioritatea; trateaza daca e in interval, altfel apeleaza next.handle().' } },
        { role: 'Request', mappedTo: 'Ticket', explanation: { en: 'Carries the priority level and description.', ro: 'Transporta nivelul de prioritate si descrierea.' } },
        { role: 'Client', mappedTo: 'main()', explanation: { en: 'Builds the chain and sends tickets to the first handler.', ro: 'Construieste lantul si trimite tickete primului handler.' } },
      ],
      answerOutline: [
        { en: 'Define abstract SupportHandler with setNext(SupportHandler) and abstract handle(Ticket).', ro: 'Defineste SupportHandler abstract cu setNext(SupportHandler) si handle(Ticket) abstract.' },
        { en: 'Each concrete handler checks ticket.priority; if in range, handles; otherwise calls next.handle(ticket).', ro: 'Fiecare handler concret verifica ticket.priority; daca e in interval, trateaza; altfel apeleaza next.handle(ticket).' },
        { en: 'Build chain: junior.setNext(senior); senior.setNext(manager).', ro: 'Construieste lantul: junior.setNext(senior); senior.setNext(manager).' },
        { en: 'Client calls junior.handle(ticket) for any ticket.', ro: 'Clientul apeleaza junior.handle(ticket) pentru orice ticket.' },
      ],
    },
    selfTest: [
      {
        id: 'chain-1',
        question: { en: 'Chain of Responsibility differs from Observer because in Chain...', ro: 'Chain of Responsibility difera de Observer deoarece in Chain...' },
        options: [
          { en: 'All handlers react to every request', ro: 'Toti handlerii reactioneaza la fiecare cerere' },
          { en: 'Typically only one handler processes each request', ro: 'De obicei doar un handler proceseaza fiecare cerere' },
          { en: 'The interface changes between handlers', ro: 'Interfata se schimba intre handleri' },
          { en: 'Objects form a tree structure', ro: 'Obiectele formeaza o structura arborescenta' },
        ],
        correctIndex: 1,
        explanation: { en: 'In Chain of Responsibility the request stops once a handler processes it. In Observer all subscribers are notified.', ro: 'In Chain of Responsibility cererea se opreste odata ce un handler o proceseaza. In Observer toti abonatii sunt notificati.' },
      },
      {
        id: 'chain-2',
        question: { en: 'Which exam phrase most strongly indicates Chain of Responsibility?', ro: 'Care formulare din examen indica cel mai puternic Chain of Responsibility?' },
        options: [
          { en: 'Optional combinations at runtime', ro: 'Combinatii optionale la runtime' },
          { en: 'Subscribe and notify multiple modules', ro: 'Aboneaza si notifica mai multe module' },
          { en: 'Escalate to the next level if unhandled', ro: 'Escaladeaza la nivelul urmator daca nu e tratat' },
          { en: 'Shared memory between many objects', ro: 'Memorie partajata intre multe obiecte' },
        ],
        correctIndex: 2,
        explanation: { en: 'Escalation through ordered handlers is the defining characteristic of Chain of Responsibility.', ro: 'Escaladarea prin handleri ordonati este caracteristica definitorie a Chain of Responsibility.' },
      },
    ],
  },
  {
    id: 'command',
    slug: 'command',
    number: 9,
    name: { en: 'Command', ro: 'Command' },
    category: behavioral,
    oneliner: {
      en: 'Encapsulate a request as an object so it can be queued, logged, or undone.',
      ro: 'Incapsuleaza o cerere ca obiect pentru coada, log sau undo.',
    },
    analogy: {
      en: 'A restaurant order slip decouples the waiter from how the cook prepares food.',
      ro: 'Bonul de comanda decupleaza ospatarul de modul in care bucatarul gateste.',
    },
    participants: [
      { role: 'Command', description: { en: 'Declares execute or prepare.', ro: 'Declara execute sau prepare.' }, example: 'KitchenOrder' },
      { role: 'ConcreteCommand', description: { en: 'Calls one receiver action.', ro: 'Apeleaza o actiune a receiverului.' }, example: 'PizzaOrder' },
      { role: 'Receiver', description: { en: 'Knows how to do the work.', ro: 'Stie cum se face munca.' }, example: 'Cook' },
      { role: 'Invoker', description: { en: 'Stores and triggers commands.', ro: 'Stocheaza si declanseaza comenzi.' }, example: 'Waiter' },
    ],
    structureDiagram: 'Client creates Command(receiver)\nInvoker stores List<Command>\nInvoker.execute() -> Command -> Receiver',
    code: '',
    codeFile: 'CommandExample.java',
    codeWalkthrough: [
      { stepNumber: 1, title: { en: 'Receiver', ro: 'Receiver' }, description: { en: 'Cook knows the real actions.', ro: 'Cook stie actiunile reale.' }, highlightLines: [21, 22, 23, 25, 26, 28, 29, 30], roleName: 'RECEIVER', roleColor: 'text-orange-400' },
      { stepNumber: 2, title: { en: 'Command interface', ro: 'Interfata Command' }, description: { en: 'Invoker can store any KitchenOrder.', ro: 'Invoker poate stoca orice KitchenOrder.' }, highlightLines: [34, 35, 36, 37], roleName: 'COMMAND', roleColor: 'text-green-400' },
      { stepNumber: 3, title: { en: 'Concrete command', ro: 'Comanda concreta' }, description: { en: 'Each order wraps receiver details.', ro: 'Fiecare comanda impacheteaza detaliile receiverului.' }, highlightLines: [40, 41, 42, 50, 56, 57, 58, 66], roleName: 'CONCRETE', roleColor: 'text-blue-400' },
      { stepNumber: 4, title: { en: 'Invoker queue', ro: 'Coada invokerului' }, description: { en: 'Waiter queues commands and executes them later.', ro: 'Waiter pune comenzile in coada si le executa mai tarziu.' }, highlightLines: [89, 90, 92, 93, 94, 97, 99, 100, 101], roleName: 'INVOKER', roleColor: 'text-purple-400' },
    ],
    examKeywords: [
      { en: 'queue commands', ro: 'coada de comenzi' },
      { en: 'undo', ro: 'undo' },
      { en: 'decouple sender and receiver', ro: 'decupleaza expeditor si receiver' },
    ],
    commonMistakes: [
      { en: 'Putting receiver logic in the invoker.', ro: 'Punerea logicii receiverului in invoker.' },
      { en: 'Skipping the Command interface.', ro: 'Omiterea interfetei Command.' },
    ],
    confusedWith: ['strategy', 'chain', 'observer'],
    useWhen: [
      { en: 'You need to queue, schedule, log, or undo operations.', ro: 'Trebuie sa pui in coada, sa programezi, sa jurnalizezi sau sa anulezi operatii.' },
      { en: 'You want to decouple the object that sends a request from the object that handles it.', ro: 'Vrei sa decuplezi obiectul care trimite o cerere de obiectul care o trateaza.' },
    ],
    doNotUseWhen: [
      { en: 'You need to select one interchangeable algorithm; use Strategy.', ro: 'Trebuie sa selectezi un algoritm interschimbabil; foloseste Strategy.' },
      { en: 'You need to notify multiple independent subscribers; use Observer.', ro: 'Trebuie sa notifici mai multi abonati independenti; foloseste Observer.' },
    ],
    examPhrases: [
      { en: 'Support undo for text editor actions that are queued and reversible.', ro: 'Suport undo pentru actiuni ale editorului de text care sunt puse in coada si reversibile.' },
      { en: 'Queue multiple orders and execute them all at once, or replay the log.', ro: 'Pune in coada mai multe comenzi si executa-le pe toate odata, sau reda jurnalul.' },
    ],
    solveExample: {
      problem: {
        en: 'A text editor needs Undo support. Each action (type, delete, format) must be reversible. The editor should queue actions and replay or undo them. Choose a pattern.',
        ro: 'Un editor de text necesita suport Undo. Fiecare actiune (tastare, stergere, formatare) trebuie sa fie reversibila. Editorul trebuie sa puna actiunile in coada si sa le redea sau anuleze. Alege un pattern.',
      },
      keywords: [
        { en: 'undo support', ro: 'suport undo' },
        { en: 'queue of commands', ro: 'coada de comenzi' },
        { en: 'decouple sender and receiver', ro: 'decupleaza expeditorul si receiverul' },
      ],
      reasoning: [
        { en: 'Each action becomes an object with execute() and undo() methods.', ro: 'Fiecare actiune devine un obiect cu metodele execute() si undo().' },
        { en: 'The invoker (editor) stores a history stack of command objects.', ro: 'Invocatorul (editorul) stocheaza o stiva istorica a obiectelor de comanda.' },
        { en: 'Undo pops the last command from history and calls undo() on it.', ro: 'Undo scoate ultima comanda din istoric si apeleaza undo() pe ea.' },
        { en: 'Command decouples the editor from the document manipulation logic.', ro: 'Command decupleaza editorul de logica de manipulare a documentului.' },
      ],
      roleMappings: [
        { role: 'Command', mappedTo: 'IEditorCommand', explanation: { en: 'Interface with execute() and undo().', ro: 'Interfata cu execute() si undo().' } },
        { role: 'ConcreteCommand', mappedTo: 'TypeCommand, DeleteCommand', explanation: { en: 'Each stores enough state to execute and undo its action.', ro: 'Fiecare stocheaza suficienta stare pentru a executa si anula actiunea sa.' } },
        { role: 'Receiver', mappedTo: 'Document', explanation: { en: 'Knows how to insert, delete, and format text.', ro: 'Stie cum sa insereze, stearga si formateze text.' } },
        { role: 'Invoker', mappedTo: 'Editor', explanation: { en: 'Holds a Deque<IEditorCommand> as history; calls execute() and undo().', ro: 'Tine un Deque<IEditorCommand> ca istoric; apeleaza execute() si undo().' } },
      ],
      answerOutline: [
        { en: 'Define IEditorCommand with execute() and undo().', ro: 'Defineste IEditorCommand cu execute() si undo().' },
        { en: 'TypeCommand stores text and cursor position; execute() inserts, undo() removes.', ro: 'TypeCommand stocheaza textul si pozitia cursorului; execute() insereaza, undo() sterge.' },
        { en: 'Editor (invoker) holds Deque<IEditorCommand>; execute pushes to history, undo pops and calls undo().', ro: 'Editor (invoker) tine Deque<IEditorCommand>; execute pune in stiva istoricului, undo scoate si apeleaza undo().' },
        { en: 'Client creates a command with the document as receiver and passes it to the editor.', ro: 'Clientul creeaza o comanda cu documentul ca receiver si o paseaza editorului.' },
      ],
    },
    selfTest: [
      {
        id: 'command-1',
        question: { en: 'The capability that most distinguishes Command from Strategy is...', ro: 'Capacitatea care distinge cel mai mult Command de Strategy este...' },
        options: [
          { en: 'Runtime algorithm selection', ro: 'Selectia algoritmului la runtime' },
          { en: 'Undo support and operation queuing', ro: 'Suport undo si punerea in coada a operatiilor' },
          { en: 'Lazy loading of objects', ro: 'Incarcarea lazy a obiectelor' },
          { en: 'Tree traversal', ro: 'Parcurgerea arborelui' },
        ],
        correctIndex: 1,
        explanation: { en: 'Command turns actions into objects specifically to support queuing, logging, and undo. Strategy is about swapping algorithms, not recording history.', ro: 'Command transforma actiunile in obiecte special pentru a suporta punerea in coada, jurnalizarea si undo. Strategy este despre schimbarea algoritmilor, nu despre inregistrarea istoricului.' },
      },
      {
        id: 'command-2',
        question: { en: 'In the Command pattern, which role stores the history of executed commands?', ro: 'In pattern-ul Command, ce rol stocheaza istoricul comenzilor executate?' },
        options: [
          { en: 'Receiver', ro: 'Receiver' },
          { en: 'Invoker', ro: 'Invoker' },
          { en: 'ConcreteCommand', ro: 'ConcreteCommand' },
          { en: 'Subject', ro: 'Subject' },
        ],
        correctIndex: 1,
        explanation: { en: 'The Invoker holds the list or stack of commands and is responsible for calling execute() and undo().', ro: 'Invoker-ul tine lista sau stiva de comenzi si este responsabil de apelarea execute() si undo().' },
      },
    ],
  },
  {
    id: 'observer',
    slug: 'observer',
    number: 10,
    name: { en: 'Observer', ro: 'Observer' },
    category: behavioral,
    oneliner: {
      en: 'Notify all subscribers automatically when state changes.',
      ro: 'Notifica automat toti abonatii cand starea se schimba.',
    },
    analogy: {
      en: 'Subscribers receive a notification when a YouTube channel posts a video.',
      ro: 'Abonatii primesc notificare cand un canal YouTube posteaza un video.',
    },
    participants: [
      { role: 'Subject', description: { en: 'Maintains observers and notifies them.', ro: 'Pastreaza observatori si ii notifica.' }, example: 'IConnectionSubject' },
      { role: 'ConcreteSubject', description: { en: 'Stores state and fires notifications.', ro: 'Pastreaza starea si declanseaza notificari.' }, example: 'ConnectionMonitor' },
      { role: 'Observer', description: { en: 'Callback interface.', ro: 'Interfata de callback.' }, example: 'IConnectionObserver' },
      { role: 'ConcreteObservers', description: { en: 'React independently to the event.', ro: 'Reactioneaza independent la eveniment.' }, example: 'GameClient, GameUI' },
    ],
    structureDiagram: 'ConnectionMonitor has List<IConnectionObserver>\nnotifyObservers() calls observer.onConnectionLost() for each subscriber',
    code: '',
    codeFile: 'ObserverExample.java',
    codeWalkthrough: [
      { stepNumber: 1, title: { en: 'Observer callback', ro: 'Callback Observer' }, description: { en: 'All subscribers implement the same callback.', ro: 'Toti abonatii implementeaza acelasi callback.' }, highlightLines: [20, 21, 22], roleName: 'OBSERVER', roleColor: 'text-green-400' },
      { stepNumber: 2, title: { en: 'Subject API', ro: 'API Subject' }, description: { en: 'The subject supports subscribe, unsubscribe, and notify.', ro: 'Subject suporta subscribe, unsubscribe si notify.' }, highlightLines: [25, 26, 27, 28, 29], roleName: 'SUBJECT', roleColor: 'text-blue-400' },
      { stepNumber: 3, title: { en: 'Notify everyone', ro: 'Notifica pe toti' }, description: { en: 'The subject only knows the observer interface.', ro: 'Subject cunoaste doar interfata Observer.' }, highlightLines: [32, 33, 37, 38, 49, 50, 51, 52, 53, 57, 59, 60], roleName: 'BROADCAST', roleColor: 'text-orange-400' },
      { stepNumber: 4, title: { en: 'Independent reactions', ro: 'Reactii independente' }, description: { en: 'Each module reacts in its own way.', ro: 'Fiecare modul reactioneaza in felul sau.' }, highlightLines: [65, 67, 68, 72, 74, 75, 79, 81, 82, 86, 88, 89], roleName: 'LISTENER', roleColor: 'text-purple-400' },
    ],
    examKeywords: [
      { en: 'notify multiple modules', ro: 'notifica multiple module' },
      { en: 'subscribe', ro: 'abonare' },
      { en: 'event reaction', ro: 'reactie la eveniment' },
    ],
    commonMistakes: [
      { en: 'Subject knowing concrete observer classes.', ro: 'Subject cunoaste clase concrete de observer.' },
      { en: 'Confusing broadcast with Chain routing.', ro: 'Confundarea broadcast-ului cu rutarea Chain.' },
    ],
    confusedWith: ['chain', 'command'],
    useWhen: [
      { en: 'Multiple independent modules need to react to the same state change.', ro: 'Mai multe module independente trebuie sa reactioneze la aceeasi schimbare de stare.' },
      { en: 'The publisher should not know the concrete subscriber classes.', ro: 'Publisher-ul nu trebuie sa cunoasca clasele concrete ale abonatilor.' },
    ],
    doNotUseWhen: [
      { en: 'The request must be routed to exactly one handler; use Chain of Responsibility.', ro: 'Cererea trebuie rutata la exact un handler; foloseste Chain of Responsibility.' },
      { en: 'Only one specific action should run per event; use Command to queue it instead.', ro: 'O singura actiune specifica trebuie executata per eveniment; foloseste Command pentru a o pune in coada.' },
    ],
    examPhrases: [
      { en: 'Notify all subscribers when the connection is lost.', ro: 'Notifica toti abonatii cand conexiunea este pierduta.' },
      { en: 'Multiple modules react independently to the same event without the source knowing them.', ro: 'Mai multe module reactioneaza independent la acelasi eveniment fara ca sursa sa le cunoasca.' },
    ],
    solveExample: {
      problem: {
        en: 'A game connection monitor must notify GameClient, GameUI, and a Logger whenever the connection drops. The monitor should not reference concrete classes. Choose a pattern.',
        ro: 'Un monitor de conexiune al unui joc trebuie sa notifice GameClient, GameUI si un Logger ori de cate ori conexiunea cade. Monitorul nu trebuie sa referenceze clase concrete. Alege un pattern.',
      },
      keywords: [
        { en: 'notify multiple modules', ro: 'notifica mai multe module' },
        { en: 'subscribe and react independently', ro: 'aboneaza-te si reactioneaza independent' },
        { en: 'source does not know concrete subscribers', ro: 'sursa nu cunoaste abonatii concreti' },
      ],
      reasoning: [
        { en: 'Multiple observers need to react to one event independently.', ro: 'Mai multi observatori trebuie sa reactioneze la un eveniment independent.' },
        { en: 'The subject holds a list of IConnectionObserver, not concrete classes.', ro: 'Subject-ul tine o lista de IConnectionObserver, nu clase concrete.' },
        { en: 'All registered observers are notified automatically when the state changes.', ro: 'Toti observatorii inregistrati sunt notificati automat cand starea se schimba.' },
        { en: 'Observer is the pattern for broadcast notification to independent subscribers.', ro: 'Observer este pattern-ul pentru notificarea broadcast catre abonati independenti.' },
      ],
      roleMappings: [
        { role: 'Observer', mappedTo: 'IConnectionObserver', explanation: { en: 'Callback interface with onConnectionLost().', ro: 'Interfata de callback cu onConnectionLost().' } },
        { role: 'Subject', mappedTo: 'IConnectionSubject', explanation: { en: 'Interface for subscribe, unsubscribe, and notify.', ro: 'Interfata pentru subscribe, unsubscribe si notify.' } },
        { role: 'ConcreteSubject', mappedTo: 'ConnectionMonitor', explanation: { en: 'Stores List<IConnectionObserver> and calls notifyObservers() on state change.', ro: 'Stocheaza List<IConnectionObserver> si apeleaza notifyObservers() la schimbarea starii.' } },
        { role: 'ConcreteObservers', mappedTo: 'GameClient, GameUI, Logger', explanation: { en: 'Each implements onConnectionLost() with its own independent reaction.', ro: 'Fiecare implementeaza onConnectionLost() cu propria reactie independenta.' } },
      ],
      answerOutline: [
        { en: 'Define IConnectionObserver with onConnectionLost().', ro: 'Defineste IConnectionObserver cu onConnectionLost().' },
        { en: 'ConnectionMonitor holds List<IConnectionObserver>; implements subscribe(), unsubscribe(), notifyObservers().', ro: 'ConnectionMonitor tine List<IConnectionObserver>; implementeaza subscribe(), unsubscribe(), notifyObservers().' },
        { en: 'notifyObservers() loops through the list and calls observer.onConnectionLost() on each.', ro: 'notifyObservers() parcurge lista si apeleaza observer.onConnectionLost() pe fiecare.' },
        { en: 'GameClient, GameUI, Logger implement IConnectionObserver each with their own reaction.', ro: 'GameClient, GameUI, Logger implementeaza IConnectionObserver fiecare cu propria reactie.' },
      ],
    },
    selfTest: [
      {
        id: 'observer-1',
        question: { en: 'Observer differs from Chain of Responsibility because in Observer...', ro: 'Observer difera de Chain of Responsibility deoarece in Observer...' },
        options: [
          { en: 'Only one subscriber handles each event', ro: 'Doar un abonat trateaza fiecare eveniment' },
          { en: 'All registered subscribers are notified', ro: 'Toti abonatii inregistrati sunt notificati' },
          { en: 'The interface changes between observers', ro: 'Interfata se schimba intre observatori' },
          { en: 'Objects form a tree structure', ro: 'Obiectele formeaza o structura arborescenta' },
        ],
        correctIndex: 1,
        explanation: { en: 'In Observer every registered subscriber receives the notification. In Chain of Responsibility only one handler typically processes the request.', ro: 'In Observer fiecare abonat inregistrat primeste notificarea. In Chain of Responsibility de obicei doar un handler proceseaza cererea.' },
      },
      {
        id: 'observer-2',
        question: { en: 'Which role in Observer holds the subscriber list and fires notifications?', ro: 'Ce rol in Observer tine lista de abonati si declanseaza notificarile?' },
        options: [
          { en: 'ConcreteObserver', ro: 'ConcreteObserver' },
          { en: 'Proxy', ro: 'Proxy' },
          { en: 'ConcreteSubject', ro: 'ConcreteSubject' },
          { en: 'Decorator', ro: 'Decorator' },
        ],
        correctIndex: 2,
        explanation: { en: 'The ConcreteSubject (e.g. ConnectionMonitor) maintains the subscriber list and calls notifyObservers() when state changes.', ro: 'ConcreteSubject (ex. ConnectionMonitor) mentine lista de abonati si apeleaza notifyObservers() cand starea se schimba.' },
      },
    ],
  },
];

export const patternBySlug = Object.fromEntries(patterns.map((pattern) => [pattern.slug, pattern])) as Record<string, Pattern>;

export function getPattern(slug: string) {
  return patternBySlug[slug];
}

export function categoryPatterns(category: PatternCategory) {
  return patterns.filter((pattern) => pattern.category === category);
}
