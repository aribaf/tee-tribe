import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const USER_ID = "guest_user"; // replace with logged-in user later

interface OrderItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
  shipping: {
    name: string;
    address: string;
    city: string;
    postal: string;
  };
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/${USER_ID}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Loading your orders...</h1>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
        <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven’t placed any orders yet.
        </p>
        <a href="/shop">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Start Shopping
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-10">
        MY <span className="text-primary">ORDERS</span>
      </h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border-4 border-muted p-6 hover:border-primary transition-all"
          >
            <div className="flex justify-between flex-wrap mb-4">
              <div>
                <h2 className="text-2xl font-bold">Order #{order._id.slice(-6)}</h2>
                <p className="text-sm text-muted-foreground">
                  Placed on {format(new Date(order.created_at), "PPP")}
                </p>
              </div>
              <span
                className={`font-bold text-lg ${
                  order.status === "Pending"
                    ? "text-yellow-600"
                    : order.status === "Delivered"
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-4 border-t border-muted pt-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 border-2 border-muted object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-lg font-bold">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-muted mt-4 pt-4 flex justify-between items-center">
              <p className="font-bold text-xl">
                Total: Rs. {order.total.toLocaleString()}
              </p>
              <div className="text-sm text-muted-foreground text-right">
                <p>{order.shipping.name}</p>
                <p>
                  {order.shipping.address}, {order.shipping.city}{" "}
                  {order.shipping.postal}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
