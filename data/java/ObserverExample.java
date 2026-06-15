// ============================================================
// OBSERVER PATTERN — "Subscribe to events, get notified automatically"
// ============================================================
// PROBLEM: When the game loses connection, multiple modules must react:
// save game state, save character, notify the user, retry connection.
// Hard-coding all these calls in one place creates tight coupling.
// SOLUTION: Modules register themselves as observers. The subject (ConnectionMonitor)
// notifies all observers when the event happens — without knowing who they are.
//
// ROLES:
//   Subject   = IConnectionSubject (maintains observer list, fires notifications)
//   Observer  = IConnectionObserver (defines the callback method)
//   ConcreteSubject = ConnectionMonitor
//   ConcreteObservers = GameClient, GameUI, CharacterService

import java.util.ArrayList;
import java.util.List;

// ── OBSERVER INTERFACE ────────────────────────────────────────
interface IConnectionObserver {
    void onConnectionLost(long timestamp);
}

// ── SUBJECT INTERFACE ─────────────────────────────────────────
interface IConnectionSubject {
    void subscribe(IConnectionObserver observer);
    void unsubscribe(IConnectionObserver observer);
    void notifyObservers(long timestamp);
}

// ── CONCRETE SUBJECT ──────────────────────────────────────────
class ConnectionMonitor implements IConnectionSubject {
    private List<IConnectionObserver> observers = new ArrayList<>();
    private boolean connected = true;

    @Override
    public void subscribe(IConnectionObserver observer) {
        observers.add(observer);
        System.out.println("  [Monitor] Subscribed: " + observer.getClass().getSimpleName());
    }

    @Override
    public void unsubscribe(IConnectionObserver observer) {
        observers.remove(observer);
        System.out.println("  [Monitor] Unsubscribed: " + observer.getClass().getSimpleName());
    }

    @Override
    public void notifyObservers(long timestamp) {
        System.out.println("  [Monitor] Notifying " + observers.size() + " observers...");
        for (IConnectionObserver obs : observers) {
            obs.onConnectionLost(timestamp);  // each observer reacts in its own way
        }
    }

    // Simulate losing connection
    public void simulateConnectionLoss() {
        System.out.println("\n!!! Connection lost at server !!!");
        connected = false;
        notifyObservers(System.currentTimeMillis());
    }
}

// ── CONCRETE OBSERVERS ────────────────────────────────────────
class GameClient implements IConnectionObserver {
    @Override
    public void onConnectionLost(long timestamp) {
        System.out.println("  [GameClient] Saving game state to disk...");
    }
}

class GameUI implements IConnectionObserver {
    @Override
    public void onConnectionLost(long timestamp) {
        System.out.println("  [GameUI] Showing 'Connection Lost' dialog to player...");
    }
}

class CharacterService implements IConnectionObserver {
    @Override
    public void onConnectionLost(long timestamp) {
        System.out.println("  [CharacterService] Saving character attributes...");
    }
}

class ReconnectService implements IConnectionObserver {
    @Override
    public void onConnectionLost(long timestamp) {
        System.out.println("  [ReconnectService] Scheduling reconnection attempt...");
    }
}

// ── TEST ──────────────────────────────────────────────────────
public class ObserverExample {
    public static void main(String[] args) {
        ConnectionMonitor monitor = new ConnectionMonitor();

        // Modules register themselves
        GameClient gameClient       = new GameClient();
        GameUI gameUI               = new GameUI();
        CharacterService charSvc    = new CharacterService();
        ReconnectService reconnect  = new ReconnectService();

        System.out.println("=== Subscribing modules ===");
        monitor.subscribe(gameClient);
        monitor.subscribe(gameUI);
        monitor.subscribe(charSvc);
        monitor.subscribe(reconnect);

        // Event fires — all observers are notified automatically
        monitor.simulateConnectionLoss();

        System.out.println("\n=== GameUI is closed, unsubscribing ===");
        monitor.unsubscribe(gameUI);

        monitor.simulateConnectionLoss();  // now only 3 observers notified
    }
}
