// ============================================================
// ADAPTER PATTERN — "Translator between incompatible interfaces"
// ============================================================
// PROBLEM: You have a LaserPrinter but your system expects an IPrinter.
// You cannot change LaserPrinter (external library / no source code).
// SOLUTION: Create an Adapter that wraps LaserPrinter and exposes IPrinter.

// ── TARGET INTERFACE (what your system already uses) ──────────
interface IPrinter {
    void print(String document);
    void printDuplex(String document);
}

// ── ADAPTEE (the existing class with the "wrong" interface) ───
class LaserPrinter {
    public void laserPrint(String doc) {
        System.out.println("[LaserPrinter] Printing: " + doc);
    }
    public void laserPrintBothSides(String doc) {
        System.out.println("[LaserPrinter] Duplex printing: " + doc);
    }
}

// ── CONCRETE TARGET (a "normal" printer — for comparison) ─────
class InkPrinter implements IPrinter {
    @Override
    public void print(String document) {
        System.out.println("[InkPrinter] Printing: " + document);
    }
    @Override
    public void printDuplex(String document) {
        System.out.println("[InkPrinter] Duplex printing: " + document);
    }
}

// ── ADAPTER (object adapter — composition) ────────────────────
// Extends nothing, wraps the Adaptee, implements the Target interface.
class Laser2InkAdapter implements IPrinter {
    private LaserPrinter laserPrinter;   // wraps the incompatible class

    public Laser2InkAdapter(LaserPrinter laserPrinter) {
        this.laserPrinter = laserPrinter;
    }

    @Override
    public void print(String document) {
        // translate: IPrinter.print() → LaserPrinter.laserPrint()
        laserPrinter.laserPrint(document);
    }

    @Override
    public void printDuplex(String document) {
        // translate: IPrinter.printDuplex() → LaserPrinter.laserPrintBothSides()
        laserPrinter.laserPrintBothSides(document);
    }
}

// ── CLIENT (only knows about IPrinter — unaware of LaserPrinter) ──
class PrinterClient {
    public void printReport(IPrinter printer, String report) {
        System.out.println("--- Printing Report ---");
        printer.print(report);
        printer.printDuplex(report + " (page 2)");
    }
}

// ── TEST ──────────────────────────────────────────────────────
public class AdapterExample {
    public static void main(String[] args) {
        PrinterClient client = new PrinterClient();

        System.out.println("=== Using InkPrinter directly ===");
        IPrinter inkPrinter = new InkPrinter();
        client.printReport(inkPrinter, "Q1 Report");

        System.out.println("\n=== Using LaserPrinter via Adapter ===");
        LaserPrinter laser = new LaserPrinter();         // the "foreign" object
        IPrinter adapted = new Laser2InkAdapter(laser);  // wrap it
        client.printReport(adapted, "Q1 Report");        // client can't tell the difference
    }
}
