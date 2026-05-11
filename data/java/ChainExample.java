// ============================================================
// CHAIN OF RESPONSIBILITY — "Pass the request up the chain until someone handles it"
// ============================================================
// PROBLEM: An IT support system has tickets of different priority.
// Priority 1 → Junior Dev. Priority 2 → Senior Dev. Priority 3 → Manager.
// You don't want the caller to know which handler will process the request.
// SOLUTION: Each handler either handles the request or passes it to the next handler.

// ── REQUEST (the thing being passed along the chain) ──────────
class Ticket {
    private int priority;
    private String description;

    public Ticket(int priority, String description) {
        this.priority = priority;
        this.description = description;
    }

    public int getPriority() { return priority; }
    public String getDescription() { return description; }

    @Override
    public String toString() {
        return "[P" + priority + "] " + description;
    }
}

// ── ABSTRACT HANDLER (defines the chain structure) ────────────
abstract class SupportHandler {
    protected SupportHandler nextHandler;  // the next in chain

    public void setNextHandler(SupportHandler next) {
        this.nextHandler = next;
    }

    public abstract void handleRequest(Ticket ticket);

    // Helper: pass to next, or drop if no next
    protected void passToNext(Ticket ticket) {
        if (nextHandler != null) {
            nextHandler.handleRequest(ticket);
        } else {
            System.out.println("  [Chain end] No handler for: " + ticket);
        }
    }
}

// ── CONCRETE HANDLERS ─────────────────────────────────────────
class JuniorDev extends SupportHandler {
    @Override
    public void handleRequest(Ticket ticket) {
        if (ticket.getPriority() == 1) {
            System.out.println("JuniorDev handles: " + ticket);
        } else {
            System.out.println("JuniorDev passes up: " + ticket);
            passToNext(ticket);
        }
    }
}

class SeniorDev extends SupportHandler {
    @Override
    public void handleRequest(Ticket ticket) {
        if (ticket.getPriority() == 2) {
            System.out.println("SeniorDev handles: " + ticket);
        } else {
            System.out.println("SeniorDev passes up: " + ticket);
            passToNext(ticket);
        }
    }
}

class Manager extends SupportHandler {
    @Override
    public void handleRequest(Ticket ticket) {
        if (ticket.getPriority() == 3) {
            System.out.println("Manager handles: " + ticket);
        } else {
            System.out.println("Manager passes up: " + ticket);
            passToNext(ticket);
        }
    }
}

// ── TEST ──────────────────────────────────────────────────────
public class ChainExample {
    public static void main(String[] args) {
        // Build the chain: Junior → Senior → Manager
        JuniorDev junior   = new JuniorDev();
        SeniorDev senior   = new SeniorDev();
        Manager   manager  = new Manager();

        junior.setNextHandler(senior);    // junior passes to senior
        senior.setNextHandler(manager);   // senior passes to manager
        // manager has no next → end of chain

        System.out.println("=== Incoming tickets ===");
        Ticket[] tickets = {
            new Ticket(1, "Keyboard not working"),
            new Ticket(2, "Build pipeline broken"),
            new Ticket(3, "Security breach detected"),
            new Ticket(1, "Monitor flickering"),
            new Ticket(4, "Unknown priority")  // nobody handles this
        };

        for (Ticket t : tickets) {
            System.out.println("\nNew ticket: " + t);
            junior.handleRequest(t);  // always starts at the beginning of chain
        }
    }
}
