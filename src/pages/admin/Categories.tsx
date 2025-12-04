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
import { Plus, Edit, Trash2, Save, X, Search, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

interface Category {
  _id?: string;
  name: string;
  status: string;
  productCount?: number;
}

export default function AdminCategories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", status: "Active" });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
  try {
    setIsLoading(true);
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();

    if (Array.isArray(data.categories)) {
      setCategories(data.categories);
    } else {
      console.error("Unexpected response:", data);
      toast({
        title: "Error",
        description: "Invalid response format from API.",
        variant: "destructive",
      });
      setCategories([]);
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
    toast({
      title: "Network Error",
      description: "Could not connect to API.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    const category = editingCategory || newCategory;
    if (!category.name.trim()) {
      toast({
        title: "Missing name",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }

    const method = editingCategory ? "PUT" : "POST";
    const url = editingCategory
      ? `${API_BASE}/categories/${editingCategory._id}`
      : `${API_BASE}/categories`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: "✅ Success", description: data.message });
        setEditingCategory(null);
        setNewCategory({ name: "", status: "Active" });
        fetchCategories();
      } else {
        toast({
          title: "Error",
          description: data.detail || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Failed to connect to API",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    const res = await fetch(`${API_BASE}/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Deleted", description: "Category removed successfully" });
      fetchCategories();
    } else {
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    }
  };

const filtered = categories.filter((c) =>
  (c?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className="space-y-6 px-4 md:px-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage product categories</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={() => setEditingCategory(null)}>
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
          <Button onClick={fetchCategories} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Category Name"
            value={editingCategory?.name || newCategory.name}
            onChange={(e) =>
              editingCategory
                ? setEditingCategory({ ...editingCategory, name: e.target.value })
                : setNewCategory({ ...newCategory, name: e.target.value })
            }
          />
          <select
            value={editingCategory?.status || newCategory.status}
            onChange={(e) =>
              editingCategory
                ? setEditingCategory({ ...editingCategory, status: e.target.value })
                : setNewCategory({ ...newCategory, status: e.target.value })
            }
            className="border border-border rounded-md p-2 bg-background text-foreground"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="mt-4 flex gap-3 flex-wrap">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {editingCategory ? "Update" : "Add"}
          </Button>
          {editingCategory && (
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-4 md:p-6 overflow-x-auto">
        <div className="flex justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Total Categories: <span className="font-semibold">{filtered.length}</span>
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c, i) => (
              <TableRow key={c._id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      c.status === "Active"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {c.status}
                  </span>
                </TableCell>
                <TableCell>{c.productCount ?? 0}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCategory(c)}
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
      </Card>
    </div>
  );
}
