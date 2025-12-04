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
import { Plus, Edit, Trash2, Save, X, RefreshCw, Search } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

interface Customer {
  _id?: string;
  full_name: string;
  email: string;
  created_at: string;
  total_orders: number;
}

export default function Customers() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    full_name: "",
    email: "",
    total_orders: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/customers`);
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch customers.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingCustomer)
      setEditingCustomer({ ...editingCustomer, [name]: value });
    else setNewCustomer({ ...newCustomer, [name]: value });
  };

  // Save handler (Add/Edit)
  const handleSave = async () => {
    const customer = editingCustomer || newCustomer;
    if (!customer.email.trim()) {
      toast({
        title: "Missing email",
        description: "Email is required.",
        variant: "destructive",
      });
      return;
    }

    const method = editingCustomer ? "PUT" : "POST";
    const url = editingCustomer
      ? `${API_BASE}/customers/${editingCustomer._id}`
      : `${API_BASE}/customers`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "✅ Success", description: data.message });
        setEditingCustomer(null);
        setNewCustomer({ full_name: "", email: "", total_orders: 0 });
        fetchCustomers();
      } else {
        toast({
          title: "Error",
          description: data.detail || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network Error",
        description: "Could not connect to the API.",
        variant: "destructive",
      });
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    const res = await fetch(`${API_BASE}/customers/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Deleted", description: "Customer removed successfully" });
      fetchCustomers();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete customer.",
        variant: "destructive",
      });
    }
  };

  // Search & Pagination logic
  const filtered = customers.filter(
    (c) =>
      (c.full_name || "Unknown")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / customersPerPage);
  const startIdx = (currentPage - 1) * customersPerPage;
  const currentCustomers = filtered.slice(startIdx, startIdx + customersPerPage);

  return (
    <div className="space-y-6 px-4 md:px-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage and view your customer list
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setEditingCustomer(null)}>
            <Plus className="h-4 w-4 mr-2" /> Add Customer
          </Button>
          <Button onClick={fetchCustomers} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Add/Edit Form */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">
          {editingCustomer ? "Edit Customer" : "Add New Customer"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            name="full_name"
            placeholder="Full Name"
            value={editingCustomer?.full_name || newCustomer.full_name}
            onChange={handleInputChange}
          />
          <Input
            name="email"
            placeholder="Email Address"
            value={editingCustomer?.email || newCustomer.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-4 flex gap-3 flex-wrap">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {editingCustomer ? "Update" : "Add"}
          </Button>
          {editingCustomer && (
            <Button variant="outline" onClick={() => setEditingCustomer(null)}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          )}
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="p-4 md:p-6 overflow-x-auto">
        <div className="flex justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Total Customers: <span className="font-semibold">{filtered.length}</span>
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCustomers.map((c, i) => (
              <TableRow key={c._id}>
                <TableCell>{startIdx + i + 1}</TableCell>
                <TableCell>{c.full_name || "Unknown"}</TableCell>
                <TableCell>{c.email || "N/A"}</TableCell>
                <TableCell>
                  {c.created_at ? format(new Date(c.created_at), "PPP") : "N/A"}
                </TableCell>
                <TableCell>{c.total_orders ?? 0}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCustomer(c)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(c._id!)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
