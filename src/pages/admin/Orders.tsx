import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Download,
  Trash2,
  Edit,
  Search,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

interface Order {
  _id: string;
  user_id: string;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
  contact?: { email?: string; phone?: string };
  shipping?: { name?: string; address?: string; city?: string; postal?: string };
  items?: { name: string; price: number; quantity: number }[];
}

export default function AdminOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/admin/orders`);
      const data = await res.json();
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch orders.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchQuery.trim()) {
        setFilteredOrders(orders);
      } else {
        setFilteredOrders(
          orders.filter(
            (o) =>
              o.shipping?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              o.contact?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              o.status?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, orders]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast({ title: "Deleted", description: "Order deleted successfully" });
      fetchOrders();
    } else {
      toast({ title: "Error", description: "Failed to delete order", variant: "destructive" });
    }
  };

  const handleStatusUpdate = async () => {
    if (!editingOrder) return;
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${editingOrder._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editingOrder.status }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "✅ Success", description: data.message });
        setEditingOrder(null);
        fetchOrders();
      } else {
        toast({
          title: "Error",
          description: data.detail || "Failed to update order",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Network Error", description: "Failed to connect", variant: "destructive" });
    }
  };

  const exportToCSV = () => {
    const csvRows = [
      ["Order ID", "Customer", "Total", "Payment", "Status", "Date"].join(","),
      ...orders.map(
        (o) =>
          [
            o._id,
            o.shipping?.name || "N/A",
            o.total,
            o.payment_method,
            o.status,
            new Date(o.created_at).toLocaleDateString(),
          ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
  };

  return (
    <div className="space-y-6 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">
            Manage, track, and update all customer orders
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={fetchOrders} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer, email, or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Orders Table */}
      <Card className="p-4 md:p-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order, i) => (
              <TableRow key={order._id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{order.shipping?.name || "N/A"}</TableCell>
                <TableCell>Rs. {order.total?.toLocaleString()}</TableCell>
                <TableCell>{order.payment_method}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "Delivered"
                        ? "bg-green-500/20 text-green-500"
                        : order.status === "Shipped"
                        ? "bg-blue-500/20 text-blue-500"
                        : order.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingOrder(order)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(order._id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Order Status Modal */}
      {editingOrder && (
        <Card className="p-4 md:p-6 space-y-4 border border-border">
          <h2 className="text-xl font-bold">Update Order Status</h2>
          <p>Order ID: {editingOrder._id}</p>

          <Select
            value={editingOrder.status}
            onValueChange={(v) =>
              setEditingOrder({ ...editingOrder, status: v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {["Pending", "Shipped", "Delivered", "Cancelled"].map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleStatusUpdate} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditingOrder(null)}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
