import type { LocalizedString } from './patterns';

export interface QuizQuestion {
  id: string;
  type: 'identify-pattern' | 'identify-from-code';
  prompt: LocalizedString;
  codeSnippet?: string;
  correctAnswer: string;
  explanation: LocalizedString;
  distractors: string[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q01-adapter',
    type: 'identify-pattern',
    prompt: {
      en: 'A system expects IPrinter, but an external LaserPrinter has laserPrint() and laserPrintBothSides(). You cannot modify LaserPrinter.',
      ro: 'Un sistem asteapta IPrinter, dar o clasa externa LaserPrinter are laserPrint() si laserPrintBothSides(). Nu poti modifica LaserPrinter.',
    },
    correctAnswer: 'adapter',
    distractors: ['proxy', 'decorator', 'facade'],
    explanation: {
      en: 'The problem is incompatible method names from an external class, so an Adapter translates calls.',
      ro: 'Problema este incompatibilitatea numelor de metode dintr-o clasa externa, deci Adapter traduce apelurile.',
    },
  },
  {
    id: 'q02-decorator',
    type: 'identify-pattern',
    prompt: {
      en: 'A coffee order can receive milk, sugar, and caramel in any combination at runtime without creating a subclass for every combination.',
      ro: 'O cafea poate primi lapte, zahar si caramel in orice combinatie la runtime fara cate o subclasa pentru fiecare combinatie.',
    },
    correctAnswer: 'decorator',
    distractors: ['adapter', 'composite', 'proxy'],
    explanation: {
      en: 'Optional stackable behavior with the same interface is Decorator.',
      ro: 'Comportamentul optional si stivuibil cu aceeasi interfata este Decorator.',
    },
  },
  {
    id: 'q03-composite',
    type: 'identify-pattern',
    prompt: {
      en: 'Files and folders should both answer getSize(), and folders can contain files or other folders.',
      ro: 'Fisierele si folderele trebuie sa raspunda la getSize(), iar folderele pot contine fisiere sau alte foldere.',
    },
    correctAnswer: 'composite',
    distractors: ['decorator', 'chain', 'flyweight'],
    explanation: {
      en: 'A tree where leaves and containers share one interface is Composite.',
      ro: 'Un arbore in care frunzele si containerele au aceeasi interfata este Composite.',
    },
  },
  {
    id: 'q04-flyweight',
    type: 'identify-pattern',
    prompt: {
      en: 'A game renders thousands of enemies. Same-type enemies should share one heavy 3D model while each render passes unique position and color.',
      ro: 'Un joc randeaza mii de inamici. Inamicii de acelasi tip trebuie sa partajeze un model 3D greu, iar pozitia si culoarea sunt unice.',
    },
    correctAnswer: 'flyweight',
    distractors: ['singleton', 'composite', 'proxy'],
    explanation: {
      en: 'Shared intrinsic state plus external extrinsic state is Flyweight.',
      ro: 'Stare intrinseca partajata plus stare extrinseca externa inseamna Flyweight.',
    },
  },
  {
    id: 'q05-facade',
    type: 'identify-pattern',
    prompt: {
      en: 'External developers should call leaveHome() instead of learning Window, Faucet, WashingMachine, and Alarm APIs.',
      ro: 'Dezvoltatorii externi trebuie sa apeleze leaveHome() in loc sa invete API-urile Window, Faucet, WashingMachine si Alarm.',
    },
    correctAnswer: 'facade',
    distractors: ['adapter', 'proxy', 'command'],
    explanation: {
      en: 'One simple front door over many subsystem classes is Facade.',
      ro: 'O intrare simpla peste multe clase de subsistem este Facade.',
    },
  },
  {
    id: 'q06-proxy',
    type: 'identify-pattern',
    prompt: {
      en: 'A chat server is external. You need to keep the same interface but drop inappropriate messages before they reach the server.',
      ro: 'Serverul de chat este extern. Trebuie sa pastrezi aceeasi interfata, dar sa blochezi mesajele nepotrivite inainte sa ajunga la server.',
    },
    correctAnswer: 'proxy',
    distractors: ['adapter', 'decorator', 'chain'],
    explanation: {
      en: 'Same interface plus filtering/access control is Protection Proxy.',
      ro: 'Aceeasi interfata plus filtrare/control de acces inseamna Protection Proxy.',
    },
  },
  {
    id: 'q07-strategy',
    type: 'identify-pattern',
    prompt: {
      en: 'Users can pay by card, PayPal, or crypto. The checkout code should not change when future payment methods are added.',
      ro: 'Utilizatorii pot plati cu cardul, PayPal sau crypto. Codul de checkout nu trebuie schimbat cand apar metode noi.',
    },
    correctAnswer: 'strategy',
    distractors: ['command', 'chain', 'observer'],
    explanation: {
      en: 'Interchangeable payment algorithms selected by preference are Strategy.',
      ro: 'Algoritmii de plata interschimbabili alesi dupa preferinte sunt Strategy.',
    },
  },
  {
    id: 'q08-chain',
    type: 'identify-pattern',
    prompt: {
      en: 'Messages have priority levels. Each processor handles what it can, otherwise it passes the message to the next processor.',
      ro: 'Mesajele au niveluri de prioritate. Fiecare procesor trateaza ce poate, altfel paseaza mesajul urmatorului procesor.',
    },
    correctAnswer: 'chain',
    distractors: ['strategy', 'observer', 'command'],
    explanation: {
      en: 'Pass-to-next handlers are Chain of Responsibility.',
      ro: 'Handlerii care paseaza mai departe indica Chain of Responsibility.',
    },
  },
  {
    id: 'q09-command',
    type: 'identify-pattern',
    prompt: {
      en: 'A remote control must queue device actions and support undo while the sender does not know receiver internals.',
      ro: 'O telecomanda trebuie sa puna actiuni in coada si sa suporte undo, fara ca expeditorul sa stie detaliile receiverului.',
    },
    correctAnswer: 'command',
    distractors: ['strategy', 'observer', 'chain'],
    explanation: {
      en: 'Queue, undo, and sender/receiver decoupling are Command signals.',
      ro: 'Coada, undo si decuplarea expeditor/receiver sunt semnale de Command.',
    },
  },
  {
    id: 'q10-observer',
    type: 'identify-pattern',
    prompt: {
      en: 'When a connection drops, the game client, UI, character service, and reconnect service must all react independently.',
      ro: 'Cand conexiunea cade, clientul jocului, UI-ul, serviciul de caractere si reconnect trebuie sa reactioneze independent.',
    },
    correctAnswer: 'observer',
    distractors: ['chain', 'command', 'strategy'],
    explanation: {
      en: 'Multiple independent subscribers reacting to one event is Observer.',
      ro: 'Mai multi abonati independenti care reactioneaza la un eveniment inseamna Observer.',
    },
  },
  {
    id: 'q11-code-decorator',
    type: 'identify-from-code',
    prompt: { en: 'What pattern does this class structure implement?', ro: 'Ce pattern implementeaza aceasta structura?' },
    codeSnippet: 'abstract class CoffeeDecorator implements ICoffee {\n  protected ICoffee decorated;\n  public String getDescription() { return decorated.getDescription(); }\n}',
    correctAnswer: 'decorator',
    distractors: ['adapter', 'proxy', 'composite'],
    explanation: { en: 'It implements and wraps the same interface.', ro: 'Implementeaza si impacheteaza aceeasi interfata.' },
  },
  {
    id: 'q12-code-observer',
    type: 'identify-from-code',
    prompt: { en: 'What pattern uses this subscription structure?', ro: 'Ce pattern foloseste aceasta structura de abonare?' },
    codeSnippet: 'private List<IConnectionObserver> observers;\nvoid subscribe(IConnectionObserver o) { observers.add(o); }\nvoid notifyObservers() { for (var o : observers) o.onConnectionLost(); }',
    correctAnswer: 'observer',
    distractors: ['chain', 'command', 'strategy'],
    explanation: { en: 'A subject notifies all registered observers.', ro: 'Un subject notifica toti observerii inregistrati.' },
  },
  {
    id: 'q13-code-flyweight',
    type: 'identify-from-code',
    prompt: { en: 'What pattern is this factory implementing?', ro: 'Ce pattern implementeaza acest factory?' },
    codeSnippet: 'private static Map<String, ISprite> pool = new HashMap<>();\nif (!pool.containsKey(type)) pool.put(type, new Sprite(type));\nreturn pool.get(type);',
    correctAnswer: 'flyweight',
    distractors: ['singleton', 'prototype', 'composite'],
    explanation: { en: 'It reuses shared objects from a pool by key.', ro: 'Reutilizeaza obiecte partajate dintr-un pool dupa cheie.' },
  },
  {
    id: 'q14-code-command',
    type: 'identify-from-code',
    prompt: { en: 'What role does Waiter play?', ro: 'Ce rol are Waiter?' },
    codeSnippet: 'class Waiter {\n  private List<KitchenOrder> orders;\n  void serveOrders() { for (KitchenOrder o : orders) o.prepare(); }\n}',
    correctAnswer: 'command',
    distractors: ['strategy', 'chain', 'observer'],
    explanation: { en: 'Waiter is an invoker that stores and executes command objects.', ro: 'Waiter este invokerul care stocheaza si executa comenzi.' },
  },
  {
    id: 'q15-code-proxy',
    type: 'identify-from-code',
    prompt: { en: 'This delays expensive creation until first use. What is it?', ro: 'Aceasta structura intarzie crearea pana la prima folosire. Ce este?' },
    codeSnippet: 'private HighResImage real = null;\npublic void display() {\n  if (real == null) real = new HighResImage(filename);\n  real.display();\n}',
    correctAnswer: 'proxy',
    distractors: ['decorator', 'adapter', 'facade'],
    explanation: { en: 'A virtual proxy lazy-loads the real subject.', ro: 'Un proxy virtual incarca lazy subiectul real.' },
  },
  {
    id: 'q16-code-chain',
    type: 'identify-from-code',
    prompt: { en: 'What pattern uses this abstract handler?', ro: 'Ce pattern foloseste acest handler abstract?' },
    codeSnippet: 'abstract class Handler {\n  protected Handler next;\n  void setNextHandler(Handler next) { this.next = next; }\n  abstract void handleRequest(Request r);\n}',
    correctAnswer: 'chain',
    distractors: ['strategy', 'observer', 'composite'],
    explanation: { en: 'The next pointer and pass-along request define a chain.', ro: 'Pointerul next si pasarea cererii definesc un lant.' },
  },
  {
    id: 'q17-code-composite',
    type: 'identify-from-code',
    prompt: { en: 'What pattern lets Folder contain both files and folders?', ro: 'Ce pattern permite Folder sa contina fisiere si foldere?' },
    codeSnippet: 'class Folder implements FileSystemItem {\n  private List<FileSystemItem> children = new ArrayList<>();\n  void add(FileSystemItem item) { children.add(item); }\n}',
    correctAnswer: 'composite',
    distractors: ['decorator', 'flyweight', 'chain'],
    explanation: { en: 'The composite stores children as the component interface.', ro: 'Composite stocheaza copiii ca interfata componenta.' },
  },
  {
    id: 'q18-code-strategy',
    type: 'identify-from-code',
    prompt: { en: 'The context delegates the algorithm to a swappable object. What pattern?', ro: 'Contextul deleaga algoritmul catre un obiect interschimbabil. Ce pattern?' },
    codeSnippet: 'cart.setPaymentStrategy(new CardPayment());\ncart.checkout(amount);',
    correctAnswer: 'strategy',
    distractors: ['command', 'chain', 'observer'],
    explanation: { en: 'The selected strategy determines how checkout pays.', ro: 'Strategia selectata determina cum plateste checkout-ul.' },
  },
  {
    id: 'q19-code-adapter',
    type: 'identify-from-code',
    prompt: { en: 'This makes an incompatible class work with an existing interface. What pattern?', ro: 'Aceasta clasa face compatibila o clasa incompatibila cu interfata existenta. Ce pattern?' },
    codeSnippet: 'class Laser2InkAdapter implements IPrinter {\n  private LaserPrinter laser;\n  public void print(String doc) { laser.laserPrint(doc); }\n}',
    correctAnswer: 'adapter',
    distractors: ['proxy', 'decorator', 'facade'],
    explanation: { en: 'It translates IPrinter calls to LaserPrinter calls.', ro: 'Traduce apelurile IPrinter catre LaserPrinter.' },
  },
  {
    id: 'q20-code-facade',
    type: 'identify-from-code',
    prompt: { en: 'This class orchestrates multiple subsystems behind one method. What pattern?', ro: 'Aceasta clasa orchestreaza multiple subsisteme in spatele unei metode. Ce pattern?' },
    codeSnippet: 'void leaveHome() {\n  faucet.turnOff();\n  window.lock();\n  alarm.arm();\n}',
    correctAnswer: 'facade',
    distractors: ['adapter', 'proxy', 'command'],
    explanation: { en: 'A simple method hides subsystem details.', ro: 'O metoda simpla ascunde detaliile subsistemelor.' },
  },
];
