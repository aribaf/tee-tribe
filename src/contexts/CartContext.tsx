import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const USER_ID = "guest_user"; // later: replace with logged-in user ID

// Helper function to validate and sanitize cart items from external sources
const sanitizeCartItems = (items: any[]): CartItem[] => {
    return (items || []).map((item: any) => {
        const price = parseFloat(item.price) || 0; // CRITICAL: Ensure price is a number
        const quantity = parseInt(item.quantity) || 1; // CRITICAL: Ensure quantity is an integer
        
        return {
            id: String(item.id),
            name: String(item.name || 'Unknown Item'),
            price: price, 
            image: String(item.image || ''),
            size: String(item.size || 'S'),
            quantity: quantity,
        } as CartItem;
    }).filter(item => item.price >= 0 && item.quantity >= 1); // Filter out invalid items
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // 🟢 Load cart from Mongo on mount
  useEffect(() => {
    const fetchCart = async () => {
      let loadedItems: CartItem[] = [];
      try {
        const res = await fetch(`${API_BASE}/cart/${USER_ID}`);
        if (!res.ok) throw new Error("Backend fetch failed");
        
        const data = await res.json();
        loadedItems = sanitizeCartItems(data.items);
        
      } catch (err) {
        console.warn("⚠️ Failed to fetch cart, using local data");
        // Fallback to Local Storage
        const saved = localStorage.getItem("tee-tribe-cart");
        if (saved) {
             try {
                const parsed = JSON.parse(saved);
                loadedItems = sanitizeCartItems(parsed);
             } catch (e) {
                 console.error("Failed to parse local storage cart:", e);
             }
        }
      }
      setItems(loadedItems);
    };
    fetchCart();
  }, []);

  // 🟡 Always store in local storage for offline persistence
  useEffect(() => {
    localStorage.setItem("tee-tribe-cart", JSON.stringify(items));
  }, [items]);

  // 🟢 Sync cart with backend
  const syncCart = async (newItems: CartItem[]) => {
    try {
      await fetch(`${API_BASE}/cart/${USER_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newItems }),
      });
    } catch (err) {
      console.warn("⚠️ Failed to sync cart with backend");
    }
  };

  // 🟢 Add item
  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      let updated;
      if (existing) {
        toast.success("Quantity updated");
        updated = prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        toast.success("Added to cart");
        // Ensure price is stored as a number when adding a new item
        const priceNum = parseFloat(String(item.price)) || 0;
        updated = [...prev, { ...item, quantity: 1, price: priceNum }];
      }
      syncCart(updated);
      return updated;
    });
  };

  // 🟢 Remove item
  const removeItem = (id: string, size: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => !(i.id === id && i.size === size));
      toast.success("Removed from cart");
      syncCart(updated);
      return updated;
    });
  };

  // 🟢 Update quantity
  const updateQuantity = (id: string, size: string, quantity: number) => {
    // We already filter invalid quantity in sanitize, but ensure we handle input quantity being non-numeric
    const validatedQuantity = parseInt(String(quantity)) || 1;
    
    if (validatedQuantity < 1) return removeItem(id, size);
    setItems((prev) => {
      const updated = prev.map((i) =>
        i.id === id && i.size === size ? { ...i, quantity: validatedQuantity } : i
      );
      syncCart(updated);
      return updated;
    });
  };

  // 🟢 Clear cart
  const clearCart = async () => {
    setItems([]);
    toast.success("Cart cleared");
    try {
      await fetch(`${API_BASE}/cart/${USER_ID}`, { method: "DELETE" });
    } catch (err) {
      console.warn("⚠️ Failed to clear backend cart");
    }
  };

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  // Use price or 0 for safety in calculation
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
