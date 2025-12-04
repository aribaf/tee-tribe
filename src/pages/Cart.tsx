import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-4xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some bold designs to your collection!</p>
          <Link to="/shop">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              SHOP NOW
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">
        YOUR <span className="text-primary">CART</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="border-4 border-muted p-4 flex gap-4 hover:border-primary transition-all"
            >
              <div className="w-24 h-24 border-2 border-muted overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">Size: {item.size}</p>
                <p className="text-xl font-bold text-secondary">
                  Rs. {item.price.toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeItem(item.id, item.size)}
                  className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    className="h-8 w-8 border-2"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    className="h-8 w-8 border-2"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border-4 border-primary p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 uppercase">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg">
                <span>Items ({totalItems})</span>
                <span className="font-bold">Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Shipping</span>
                <span className="font-bold text-primary">FREE</span>
              </div>
              <div className="border-t-2 border-muted pt-4">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-secondary">Rs. {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link to="/checkout">
              <Button size="lg" className="w-full text-lg bg-primary hover:bg-primary/90 shadow-neon mb-4">
                CHECKOUT
              </Button>
            </Link>

            <Link to="/shop">
              <Button variant="outline" size="lg" className="w-full border-2">
                CONTINUE SHOPPING
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
