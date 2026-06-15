// ============================================================
// STRATEGY PATTERN — "Swap algorithms at runtime without changing the caller"
// ============================================================
// PROBLEM: A shopping cart needs to support multiple payment methods.
// New methods will be added in the future. Using if/else or switch
// makes the code rigid and hard to extend.
// SOLUTION: Extract each algorithm into its own class behind an interface.
// The context (ShoppingCart) only knows the interface, not the concrete class.

// ── STRATEGY INTERFACE ───────────────────────────────────────
interface IPaymentStrategy {
    void pay(double amount);
    String getMethodName();
}

// ── CONCRETE STRATEGIES (each is a different algorithm) ──────
class CardPayment implements IPaymentStrategy {
    private String cardNumber;

    public CardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " via Card ending in "
                + cardNumber.substring(cardNumber.length() - 4));
    }

    @Override
    public String getMethodName() { return "Credit Card"; }
}

class PayPalPayment implements IPaymentStrategy {
    private String email;

    public PayPalPayment(String email) {
        this.email = email;
    }

    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " via PayPal (" + email + ")");
    }

    @Override
    public String getMethodName() { return "PayPal"; }
}

class CryptoPayment implements IPaymentStrategy {
    private String walletAddress;

    public CryptoPayment(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " via Crypto wallet: " + walletAddress);
    }

    @Override
    public String getMethodName() { return "Crypto"; }
}

// ── CONTEXT (uses a strategy — does NOT know which one) ───────
class ShoppingCart {
    private IPaymentStrategy paymentStrategy;  // set from outside

    public void setPaymentStrategy(IPaymentStrategy strategy) {
        this.paymentStrategy = strategy;
        System.out.println("Payment method set to: " + strategy.getMethodName());
    }

    public void checkout(double totalAmount) {
        if (paymentStrategy == null) {
            System.out.println("Error: no payment method selected!");
            return;
        }
        System.out.print("Processing payment... ");
        paymentStrategy.pay(totalAmount);  // delegates to strategy
    }
}

// ── TEST ──────────────────────────────────────────────────────
public class StrategyExample {
    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();

        // User pays monthly subscription via card
        cart.setPaymentStrategy(new CardPayment("4111-1111-1111-9876"));
        cart.checkout(29.99);

        System.out.println();

        // User switches to PayPal next month — no code change in ShoppingCart!
        cart.setPaymentStrategy(new PayPalPayment("user@example.com"));
        cart.checkout(29.99);

        System.out.println();

        // New payment method added in future — just implement IPaymentStrategy
        cart.setPaymentStrategy(new CryptoPayment("0xABC123DEF456"));
        cart.checkout(29.99);
    }
}
