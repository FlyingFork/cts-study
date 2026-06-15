export const PATTERN_DIAGRAMS: Record<string, string> = {
  adapter: `classDiagram
  class Adapter {
    <<interface>>
    +operation()
  }
  class ConcreteAdapter {
    -adaptee
    +operation()
  }
  class Adaptee {
    +adaptedOperation()
  }
  class Client
  Client --> Adapter
  ConcreteAdapter ..|> Adapter
  ConcreteAdapter --> Adaptee`,

  chain: `classDiagram
  class Handler {
    <<interface>>
    +handleRequest()
  }
  class ConcreteHandler1 {
    +handleRequest()
  }
  class ConcreteHandler2 {
    +handleRequest()
  }
  Handler --> Handler : successor
  ConcreteHandler1 ..|> Handler
  ConcreteHandler2 ..|> Handler`,

  command: `classDiagram
  class Command {
    <<interface>>
    +execute()
  }
  class ConcreteCommand {
    +execute()
  }
  class Invoker
  class Receiver {
    +action()
  }
  class Client
  Client --> Invoker
  Client ..> ConcreteCommand
  ConcreteCommand ..|> Command
  ConcreteCommand --> Receiver
  Invoker --> Command`,

  composite: `classDiagram
  class Component {
    <<interface>>
    +operation()
    +add(in c: Composite)
    +remove(in c: Composite)
    +getChild(in i: int)
  }
  class Leaf {
    +operation()
  }
  class Composite {
    +operation()
    +add(in c: Composite)
    +remove(in c: Composite)
    +getChild(in i: int)
  }
  Leaf ..|> Component
  Composite ..|> Component
  Composite *-- Component : children`,

  decorator: `classDiagram
  class Component {
    <<interface>>
    +operation()
  }
  class ConcreteComponent {
    +operation()
  }
  class Decorator {
    +operation()
  }
  class ConcreteDecorator {
    -addedState
    +operation()
    +addedBehavior()
  }
  ConcreteComponent ..|> Component
  Decorator ..|> Component
  Decorator --> Component : component
  ConcreteDecorator --|> Decorator`,

  facade: `classDiagram
  class Facade
  class SubsystemA
  class SubsystemB
  class SubsystemC
  class Client
  Client --> Facade
  Facade --> SubsystemA
  Facade --> SubsystemB
  Facade --> SubsystemC`,

  flyweight: `classDiagram
  class Flyweight {
    <<interface>>
    +operation(extrinsicState)
  }
  class ConcreteFlyweight {
    -intrinsicState
    +operation(extrinsicState)
  }
  class UnsharedConcreteFlyweight {
    -allState
    +operation(extrinsicState)
  }
  class FlyweightFactory {
    +getFlyweight(key)
  }
  class Client
  ConcreteFlyweight ..|> Flyweight
  UnsharedConcreteFlyweight ..|> Flyweight
  FlyweightFactory --> Flyweight
  Client --> FlyweightFactory
  Client --> ConcreteFlyweight`,

  observer: `classDiagram
  class Subject {
    <<interface>>
    +attach(in o: Observer)
    +detach(in o: Observer)
    +notify()
  }
  class Observer {
    <<interface>>
    +update()
  }
  class ConcreteSubject {
    -subjectState
  }
  class ConcreteObserver {
    -observerState
    +update()
  }
  Subject --> Observer : notifies
  ConcreteSubject ..|> Subject
  ConcreteObserver ..|> Observer
  ConcreteObserver --> ConcreteSubject : observes`,

  proxy: `classDiagram
  class Subject {
    <<interface>>
    +request()
  }
  class RealSubject {
    +request()
  }
  class Proxy {
    +request()
  }
  class Client
  RealSubject ..|> Subject
  Proxy ..|> Subject
  Client --> Subject
  Proxy --> RealSubject : represents`,

  strategy: `classDiagram
  class Strategy {
    <<interface>>
    +execute()
  }
  class ConcreteStrategyA {
    +execute()
  }
  class ConcreteStrategyB {
    +execute()
  }
  class Context
  ConcreteStrategyA ..|> Strategy
  ConcreteStrategyB ..|> Strategy
  Context --> Strategy`,
};
