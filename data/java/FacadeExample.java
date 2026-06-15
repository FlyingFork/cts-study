// ============================================================
// FACADE PATTERN — "One simple button for a complex system"
// ============================================================
// PROBLEM: A smart home has many subsystems (Window, Faucet, Alarm, etc.)
// each with their own complex API. External developers or end users
// shouldn't need to know all the details.
// SOLUTION: A Facade provides a simple high-level interface that delegates
// to the subsystems internally.

// ── SUBSYSTEM CLASSES (complex, many methods) ─────────────────
class Window {
    public void open()  { System.out.println("Window: opening"); }
    public void close() { System.out.println("Window: closing"); }
    public void lock()  { System.out.println("Window: locking"); }
}

class WaterFaucet {
    public void turnOn()  { System.out.println("Faucet: turning on"); }
    public void turnOff() { System.out.println("Faucet: turning off"); }
}

class WashingMachine {
    public void startProgram(int program) {
        System.out.println("WashingMachine: starting program " + program);
    }
    public void stop() { System.out.println("WashingMachine: stopping"); }
}

class AlarmSystem {
    public void arm()   { System.out.println("Alarm: armed"); }
    public void disarm(String pin) {
        System.out.println("Alarm: disarmed with PIN " + pin);
    }
}

// ── FACADE (the simple interface — client only talks to this) ──
class HomeAutomationFacade {
    private Window window;
    private WaterFaucet faucet;
    private WashingMachine washer;
    private AlarmSystem alarm;

    public HomeAutomationFacade() {
        this.window  = new Window();
        this.faucet  = new WaterFaucet();
        this.washer  = new WashingMachine();
        this.alarm   = new AlarmSystem();
    }

    // ── SIMPLIFIED OPERATIONS (hide the complexity) ───────────
    public void leaveHome() {
        System.out.println("--- Leaving home ---");
        faucet.turnOff();
        washer.stop();
        window.close();
        window.lock();
        alarm.arm();
    }

    public void arriveHome(String pin) {
        System.out.println("--- Arriving home ---");
        alarm.disarm(pin);
        window.open();
        faucet.turnOn();
    }

    public void startLaundry() {
        System.out.println("--- Starting laundry ---");
        washer.startProgram(3);
    }
}

// ── TEST ──────────────────────────────────────────────────────
public class FacadeExample {
    public static void main(String[] args) {
        HomeAutomationFacade home = new HomeAutomationFacade();

        // Client calls ONE method, facade handles ALL the subsystem calls
        home.leaveHome();

        System.out.println();
        home.arriveHome("1234");

        System.out.println();
        home.startLaundry();

        System.out.println("\n--- Without facade, client would need to: ---");
        System.out.println("new Window(), new WaterFaucet(), new WashingMachine()...");
        System.out.println("...call each method in the right order manually.");
    }
}
