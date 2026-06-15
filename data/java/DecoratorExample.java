// ============================================================
// DECORATOR PATTERN — "Add toppings to a pizza at runtime"
// ============================================================
// PROBLEM: You want to add optional features to objects dynamically.
// Creating a subclass for every combination (MilkCoffee, SugarMilkCoffee...)
// leads to a class explosion.
// SOLUTION: Wrap the object in a Decorator that adds new behaviour.
// You can stack multiple decorators: sugar(milk(simpleCoffee))

import java.util.ArrayList;
import java.util.List;

// ── COMPONENT INTERFACE (what decorators and real objects share) ──
interface ICoffee {
    String getDescription();
    double getCost();
}

// ── CONCRETE COMPONENT (the base object you start with) ──────
class SimpleCoffee implements ICoffee {
    @Override
    public String getDescription() { return "Simple coffee"; }
    @Override
    public double getCost() { return 1.00; }
}

// ── ABSTRACT DECORATOR (key: implements AND wraps ICoffee) ────
// This is the structural heart of the pattern.
abstract class CoffeeDecorator implements ICoffee {
    protected ICoffee decoratedCoffee;   // the thing being wrapped

    public CoffeeDecorator(ICoffee coffee) {
        this.decoratedCoffee = coffee;
    }

    // default: delegate to the wrapped object
    @Override
    public String getDescription() { return decoratedCoffee.getDescription(); }
    @Override
    public double getCost() { return decoratedCoffee.getCost(); }
}

// ── CONCRETE DECORATORS (each adds one thing) ─────────────────
class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(ICoffee coffee) { super(coffee); }

    @Override
    public String getDescription() { return decoratedCoffee.getDescription() + ", Milk"; }
    @Override
    public double getCost() { return decoratedCoffee.getCost() + 0.25; }
}

class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(ICoffee coffee) { super(coffee); }

    @Override
    public String getDescription() { return decoratedCoffee.getDescription() + ", Sugar"; }
    @Override
    public double getCost() { return decoratedCoffee.getCost() + 0.10; }
}

class CaramelDecorator extends CoffeeDecorator {
    public CaramelDecorator(ICoffee coffee) { super(coffee); }

    @Override
    public String getDescription() { return decoratedCoffee.getDescription() + ", Caramel"; }
    @Override
    public double getCost() { return decoratedCoffee.getCost() + 0.50; }
}

// ── TEST ──────────────────────────────────────────────────────
public class DecoratorExample {
    public static void main(String[] args) {
        // Start with a simple coffee
        ICoffee coffee = new SimpleCoffee();
        System.out.println(coffee.getDescription() + " => $" + coffee.getCost());

        // Add milk
        coffee = new MilkDecorator(coffee);
        System.out.println(coffee.getDescription() + " => $" + coffee.getCost());

        // Add sugar on top of that
        coffee = new SugarDecorator(coffee);
        System.out.println(coffee.getDescription() + " => $" + coffee.getCost());

        // Add caramel too
        coffee = new CaramelDecorator(coffee);
        System.out.println(coffee.getDescription() + " => $" + coffee.getCost());

        System.out.println("\n--- Another order: double sugar ---");
        ICoffee order2 = new SugarDecorator(new SugarDecorator(new SimpleCoffee()));
        System.out.println(order2.getDescription() + " => $" + order2.getCost());
    }
}
