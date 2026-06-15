// ============================================================
// PROXY PATTERN — "A stand-in that controls access to the real thing"
// ============================================================
// Two types shown here:
//   1. VIRTUAL PROXY    — delays expensive object creation until needed
//   2. PROTECTION PROXY — filters/controls access based on rules
//
// KEY: Proxy and RealObject implement the SAME interface.
// The client can't tell whether it's talking to the proxy or the real thing.

// ════════════════════════════════════════════════════════════
// TYPE 1: VIRTUAL PROXY (lazy loading)
// ════════════════════════════════════════════════════════════

// ── SUBJECT INTERFACE ─────────────────────────────────────────
interface IImage {
    void display();
}

// ── REAL SUBJECT (expensive to create) ───────────────────────
class HighResImage implements IImage {
    private String filename;

    public HighResImage(String filename) {
        this.filename = filename;
        loadFromDisk();  // slow! happens at construction
    }

    private void loadFromDisk() {
        System.out.println("  [HighResImage] Loading " + filename + " from disk... (slow)");
    }

    @Override
    public void display() {
        System.out.println("  [HighResImage] Displaying " + filename);
    }
}

// ── VIRTUAL PROXY (delays loading until display() is called) ──
class ImageProxy implements IImage {
    private String filename;
    private HighResImage realImage = null;  // null until first use

    public ImageProxy(String filename) {
        this.filename = filename;
        System.out.println("  [ImageProxy] Proxy created for " + filename + " (not loaded yet)");
    }

    @Override
    public void display() {
        if (realImage == null) {
            realImage = new HighResImage(filename);  // load only on first call
        }
        realImage.display();
    }
}

// ════════════════════════════════════════════════════════════
// TYPE 2: PROTECTION PROXY (access control / filtering)
// ════════════════════════════════════════════════════════════

interface IChatServer {
    void sendMessage(String user, String message);
}

class RealChatServer implements IChatServer {
    @Override
    public void sendMessage(String user, String message) {
        System.out.println("  [ChatServer] " + user + ": " + message);
    }
}

// ── PROTECTION PROXY (we don't own ChatServer — it's external) ──
class ChatFilterProxy implements IChatServer {
    private IChatServer realServer;
    private static final String[] BANNED = {"spam", "offensive"};

    public ChatFilterProxy(IChatServer server) {
        this.realServer = server;
    }

    @Override
    public void sendMessage(String user, String message) {
        if (containsBannedWord(message)) {
            System.out.println("  [Proxy] Message BLOCKED for: " + user);
            return;
        }
        realServer.sendMessage(user, message);  // pass through if clean
    }

    private boolean containsBannedWord(String message) {
        String lower = message.toLowerCase();
        for (String word : BANNED) {
            if (lower.contains(word)) return true;
        }
        return false;
    }
}

// ── TEST ──────────────────────────────────────────────────────
public class ProxyExample {
    public static void main(String[] args) {
        System.out.println("=== Virtual Proxy (lazy loading) ===");
        IImage img1 = new ImageProxy("holiday.jpg");
        IImage img2 = new ImageProxy("profile.jpg");
        System.out.println("-- Images created, but not loaded yet --");

        System.out.println("\nCalling display() on img1:");
        img1.display();   // loads now
        System.out.println("\nCalling display() on img1 again:");
        img1.display();   // already loaded, no reload

        System.out.println("\n=== Protection Proxy (filtering) ===");
        IChatServer server = new ChatFilterProxy(new RealChatServer());
        server.sendMessage("Alice", "Hello everyone!");
        server.sendMessage("Bob",   "This is spam content");
        server.sendMessage("Carol", "Great game today");
        server.sendMessage("Dave",  "Some offensive language here");
    }
}
