// ============================================================
// COMMAND PATTERN — "Turn a request into an object you can queue or undo"
// ============================================================
// PROBLEM: A restaurant waiter takes orders and passes them to the kitchen.
// The waiter should not know HOW each dish is prepared.
// The cook should not need to know WHO ordered what.
// SOLUTION: Each order is a Command object. Waiter (Invoker) collects commands.
// Cook (Receiver) knows how to prepare things. Command bridges them.
//
// ROLES:
//   Command   = KitchenOrder (interface)
//   Receiver  = Cook (knows HOW to do the work)
//   ConcreteCommand = PizzaOrder, SoupOrder (calls the right cook method)
//   Invoker   = Waiter (stores and executes commands)
//   Client    = main() (creates and connects everything)

import java.util.ArrayList;
import java.util.List;

// ── RECEIVER (the one who actually does the work) ─────────────
class Cook {
    public void preparePizza(String type) {
        System.out.println("  [Cook] Preparing " + type + " pizza");
    }
    public void prepareSoup(String flavour) {
        System.out.println("  [Cook] Preparing " + flavour + " soup");
    }
    public void prepareSalad(String size) {
        System.out.println("  [Cook] Preparing " + size + " salad");
    }
}

// ── COMMAND INTERFACE ─────────────────────────────────────────
interface KitchenOrder {
    void prepare();      // execute
    String getItem();    // for display / logging
}

// ── CONCRETE COMMANDS (each wraps a specific receiver action) ──
class PizzaOrder implements KitchenOrder {
    private Cook cook;
    private String pizzaType;

    public PizzaOrder(Cook cook, String pizzaType) {
        this.cook = cook;
        this.pizzaType = pizzaType;
    }

    @Override
    public void prepare() { cook.preparePizza(pizzaType); }

    @Override
    public String getItem() { return "Pizza (" + pizzaType + ")"; }
}

class SoupOrder implements KitchenOrder {
    private Cook cook;
    private String flavour;

    public SoupOrder(Cook cook, String flavour) {
        this.cook = cook;
        this.flavour = flavour;
    }

    @Override
    public void prepare() { cook.prepareSoup(flavour); }

    @Override
    public String getItem() { return "Soup (" + flavour + ")"; }
}

class SaladOrder implements KitchenOrder {
    private Cook cook;
    private String size;

    public SaladOrder(Cook cook, String size) {
        this.cook = cook;
        this.size = size;
    }

    @Override
    public void prepare() { cook.prepareSalad(size); }

    @Override
    public String getItem() { return "Salad (" + size + ")"; }
}

// ── INVOKER (stores commands, executes them all at once) ──────
class Waiter {
    private List<KitchenOrder> orders = new ArrayList<>();

    public void takeOrder(KitchenOrder order) {
        System.out.println("  [Waiter] Took order: " + order.getItem());
        orders.add(order);
    }

    public void serveOrders() {
        System.out.println("  [Waiter] Sending all orders to kitchen...");
        for (KitchenOrder order : orders) {
            order.prepare();  // invoker doesn't know HOW — just calls prepare()
        }
        orders.clear();
    }
}

// ── TEST ──────────────────────────────────────────────────────
public class CommandExample {
    public static void main(String[] args) {
        Cook cook = new Cook();          // receiver
        Waiter waiter = new Waiter();    // invoker

        // Client creates commands, linking receiver to invoker
        waiter.takeOrder(new PizzaOrder(cook, "Margherita"));
        waiter.takeOrder(new SoupOrder(cook, "Tomato"));
        waiter.takeOrder(new SaladOrder(cook, "Large"));
        waiter.takeOrder(new PizzaOrder(cook, "Pepperoni"));

        System.out.println();
        waiter.serveOrders();  // waiter sends all orders at once

        System.out.println("\n--- New table ---");
        waiter.takeOrder(new SoupOrder(cook, "Chicken"));
        waiter.serveOrders();
    }
}
