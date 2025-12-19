import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const USER_ID = "guest_user"; // Replace with actual logged-in user later

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsProcessing(true);

  // Collect form values
  const form = e.target as HTMLFormElement;
  const email = (form.email as HTMLInputElement).value;
  const phone = (form.phone as HTMLInputElement).value;
  const name = (form.name as HTMLInputElement).value;
  const address = (form.address as HTMLInputElement).value;
  const city = (form.city as HTMLInputElement).value;
  const postal = (form.postal as HTMLInputElement).value;

  try {
    const res = await fetch(`${API_BASE}/orders/${USER_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        total: totalPrice,
        contact: { email, phone },
        shipping: { name, address, city, postal },
        payment_method: "Cash on Delivery",
      }),
    });

    if (!res.ok) throw new Error("Failed to place order");

    const data = await res.json();
    toast.success(`Order placed successfully! ID: ${data.order_id}`);

    clearCart(); // 🧹 clear local + backend cart
    navigate("/");
  } catch (err: any) {
    toast.error(`Failed: ${err.message}`);
  } finally {
    setIsProcessing(false);
  }
};


  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">
        <span className="text-primary">CHECKOUT</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="border-4 border-muted p-6">
              <h2 className="text-2xl font-bold mb-6 uppercase">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-lg font-bold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="border-2 h-12"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-lg font-bold">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    className="border-2 h-12"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border-4 border-muted p-6">
              <h2 className="text-2xl font-bold mb-6 uppercase">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-lg font-bold">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    className="border-2 h-12"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-lg font-bold">
                    Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    required
                    className="border-2 h-12"
                    placeholder="Street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-lg font-bold">
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      required
                      className="border-2 h-12"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal" className="text-lg font-bold">
                      Postal Code
                    </Label>
                    <Input
                      id="postal"
                      type="text"
                      required
                      className="border-2 h-12"
                      placeholder="00000"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button
  type="button"
  size="lg"
  className="w-full mt-4 bg-secondary hover:bg-secondary/90"
  onClick={async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/payments/stripe/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          user_id: USER_ID,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Stripe error");

      window.location.href = data.url; // 🔥 redirect to Stripe
    } catch (err: any) {
      toast.error(err.message);
      setIsProcessing(false);
    }
  }}
>
  PAY WITH CARD (STRIPE)
</Button>

            {/* Payment Method */}
            <div className="border-4 border-muted p-6">
              <h2 className="text-2xl font-bold mb-6 uppercase">Payment Method</h2>
              <div className="space-y-4">
                <div className="border-2 border-primary p-4 bg-primary/5">
                  <p className="font-bold text-lg">Cash on Delivery</p>
                  <p className="text-muted-foreground">Pay when you receive your order</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isProcessing}
              className="w-full text-lg bg-primary hover:bg-primary/90 shadow-neon"
            >
              {isProcessing ? 'PROCESSING...' : 'PLACE ORDER'}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border-4 border-muted p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 uppercase">Your Order</h2>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 pb-4 border-b border-muted">
                  <div className="w-16 h-16 border-2 border-muted overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Size: {item.size} × {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-secondary">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-primary">FREE</span>
              </div>
              <div className="border-t-2 border-muted pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-secondary">Rs. {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
