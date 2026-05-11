// ============================================================
// FLYWEIGHT PATTERN — "Share the heavy stuff, keep only what's unique"
// ============================================================
// PROBLEM: A game needs to render 1000 enemy sprites. Each has a massive
// 3D model. Storing 1000 separate 3D models would crash the client.
// SOLUTION: Store ONE shared 3D model per type (intrinsic = shared state).
// Each sprite only stores its own position and color (extrinsic = unique state).
//
// INTRINSIC  = stored inside the flyweight (shared, heavy, immutable)
// EXTRINSIC  = passed in at runtime (unique per instance, lightweight)

import java.util.HashMap;
import java.util.Map;

// ── FLYWEIGHT INTERFACE ───────────────────────────────────────
interface ISprite {
    // extrinsic state is passed in (x, y, color) — NOT stored in flyweight
    void display(int x, int y, String color);
}

// ── CONCRETE FLYWEIGHT (stores intrinsic state — the 3D model) ──
class Sprite implements ISprite {
    private String modelType;       // intrinsic: shared by all sprites of this type
    private String model3DData;     // intrinsic: heavy data, loaded once

    public Sprite(String modelType) {
        this.modelType = modelType;
        // Simulate expensive loading
        this.model3DData = "[3D mesh data for " + modelType + "]";
        System.out.println("  >> Loading 3D model for: " + modelType + " (expensive!)");
    }

    @Override
    public void display(int x, int y, String color) {
        // extrinsic state (x, y, color) comes from outside
        System.out.println("Displaying " + modelType + " at (" + x + "," + y + ") color=" + color);
    }
}

// ── FLYWEIGHT FACTORY (ensures we reuse existing flyweights) ──
class SpriteFactory {
    private static Map<String, ISprite> pool = new HashMap<>();

    public static ISprite getSprite(String modelType) {
        if (!pool.containsKey(modelType)) {
            pool.put(modelType, new Sprite(modelType));  // create only once
        }
        return pool.get(modelType);  // return the shared instance
    }

    public static int getPoolSize() { return pool.size(); }
}

// ── TEST ──────────────────────────────────────────────────────
public class FlyweightExample {
    public static void main(String[] args) {
        System.out.println("=== Spawning 6 enemies (3 types, 2 of each) ===\n");

        // Each call to getSprite() with the same type reuses the same object
        ISprite orc1  = SpriteFactory.getSprite("Orc");
        ISprite orc2  = SpriteFactory.getSprite("Orc");   // reused — no reload!
        ISprite troll1 = SpriteFactory.getSprite("Troll");
        ISprite troll2 = SpriteFactory.getSprite("Troll"); // reused
        ISprite dragon = SpriteFactory.getSprite("Dragon");
        ISprite dragon2 = SpriteFactory.getSprite("Dragon"); // reused

        System.out.println("\n=== Displaying enemies (extrinsic state passed in) ===");
        orc1.display(10, 20, "green");
        orc2.display(50, 80, "dark-green");   // SAME flyweight, DIFFERENT position/color
        troll1.display(100, 150, "grey");
        troll2.display(200, 300, "brown");
        dragon.display(500, 500, "red");
        dragon2.display(600, 400, "black");

        System.out.println("\n3D models loaded: " + SpriteFactory.getPoolSize()
                + " (instead of 6)");

        System.out.println("\norc1 == orc2? " + (orc1 == orc2)); // true — same object!
    }
}
