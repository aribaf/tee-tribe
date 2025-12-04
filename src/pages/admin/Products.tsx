import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Save, X, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

interface Product {
  _id?: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  image: string;
  sizes: string[];
  colors: string[];
  meta_keywords?: string[]; // <-- added
}

const CATEGORY_OPTIONS = ["Abstract", "Tribal", "Typography", "Tech", "Graphic", "Accessories"];
const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];
const COLOR_OPTIONS = ["Black", "White", "Gray", "Red", "Blue", "Purple", "Green"];

export default function AdminProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [aiLoading, setAiLoading] = useState(false);
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);

  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    slug: "",
    category: "",
    price: 0,
    description: "",
    image: "",
    sizes: [],
    colors: [],
    meta_keywords: [],
  });

  // Call secure server endpoint that runs OpenAI on the backend
  const handleEnhanceWithAI = async (product: Product | null = null) => {
    // product === null => use newProduct, otherwise editingProduct or passed product
    const target = product || editingProduct || newProduct;
    if (!target) return;

    const payload = {
      name: target.name,
      category: target.category,
      description: target.description || "",
      price: target.price || 0,
      sizes: target.sizes || [],
      colors: target.colors || [],
    };

    try {
      setAiLoading(true);
      const res = await fetch(`${API_BASE}/ai/enhance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(err.message || "AI service error");
      }

      const data = await res.json();
      // expected: { enhanced_description: string, meta_keywords: string[] }
      const enhanced = data.enhanced_description ?? data.enhancedDescription ?? "";
      const keywords: string[] = data.meta_keywords ?? data.metaKeywords ?? [];

      const enhancedPayload: Product = {
        ...target,
        description: enhanced,
        meta_keywords: keywords,
      };

      // Set into editing/new depending on scenario
      if (editingProduct || product) {
        setEditingProduct(enhancedPayload);
      } else {
        setNewProduct(enhancedPayload);
      }

      setMetaKeywords(keywords);
      toast({ title: "AI Enhancement Ready", description: "Review and save the changes." });
    } catch (err: any) {
      console.error("AI enhance error:", err);
      toast({ title: "AI Error", description: err?.message || "Failed to enhance product", variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  // --- Fetch products
  const fetchProducts = async (query = "") => {
    try {
      const params = new URLSearchParams({ q: query, page: "1", limit: "100" });
      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.items || []);
      setTotalCount(data.total ?? (data.items ? data.items.length : 0));
    } catch (err) {
      console.error("Error fetching products:", err);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchProducts(searchQuery), 400);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts("");
  }, []);

  // --- Input handlers
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const target = editingProduct || newProduct;
    const updated =
      name === "price"
        ? { ...target, price: isNaN(parseFloat(value)) ? 0 : parseFloat(value) }
        : { ...target, [name]: value };
    editingProduct ? setEditingProduct(updated) : setNewProduct(updated);
  };

  const handleSelect = (name: string, value: string) => {
    editingProduct
      ? setEditingProduct({ ...editingProduct, [name]: value })
      : setNewProduct({ ...newProduct, [name]: value });
  };

  const toggleMultiSelect = (name: "sizes" | "colors", value: string) => {
    const target = editingProduct || newProduct;
    const arr = target[name];
    const updated = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    editingProduct
      ? setEditingProduct({ ...editingProduct, [name]: updated })
      : setNewProduct({ ...newProduct, [name]: updated });
  };

  // --- Save Product
  const handleSave = async () => {
    const product = editingProduct || newProduct;
    if (!product.name || !product.slug || !product.category) {
      toast({
        title: "Missing Fields",
        description: "Name, slug, and category are required.",
        variant: "destructive",
      });
      return;
    }

    const productPayload = {
      ...product,
      meta_keywords:
        (editingProduct?.meta_keywords && editingProduct.meta_keywords.length)
          ? editingProduct.meta_keywords
          : metaKeywords,
    };

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? `${API_BASE}/products/${editingProduct._id}` : `${API_BASE}/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });
      const data = await res.json();
      if (res.ok && (data.success ?? true)) {
        toast({ title: "✅ Success", description: data.message ?? "Product saved" });
        setEditingProduct(null);
        setNewProduct({
          name: "",
          slug: "",
          category: "",
          price: 0,
          description: "",
          image: "",
          sizes: [],
          colors: [],
          meta_keywords: [],
        });
        setMetaKeywords([]);
        fetchProducts(searchQuery);
      } else {
        toast({
          title: "Error",
          description: data.detail || data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Save error:", err);
      toast({
        title: "Network Error",
        description: "Failed to connect to API",
        variant: "destructive",
      });
    }
  };

  // --- Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Deleted", description: "Product removed successfully" });
      fetchProducts(searchQuery);
    } else {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  // --- Sorting
  const handleSort = (field: keyof Product) => {
    const order = field === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const sortedProducts = [...products].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "string" && typeof valB === "string")
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    if (typeof valA === "number" && typeof valB === "number")
      return sortOrder === "asc" ? valA - valB : valB - valA;
    return 0;
  });

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">Products Management</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Total Products: <span className="font-bold">{totalCount}</span>
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Add/Edit Product Form */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold mb-4">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="name" placeholder="Product Name" value={editingProduct?.name || newProduct.name} onChange={handleInput} />
          <Input name="slug" placeholder="Slug (unique)" value={editingProduct?.slug || newProduct.slug} onChange={handleInput} />

          {/* Category */}
          <Select
            value={editingProduct?.category || newProduct.category}
            onValueChange={(v) => handleSelect("category", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input name="price" type="number" placeholder="Price" value={editingProduct?.price ?? newProduct.price} onChange={handleInput} />
          <Input name="image" placeholder="Image URL" value={editingProduct?.image || newProduct.image} onChange={handleInput} />
        </div>

        {/* Sizes & Colors */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold mb-2 text-sm md:text-base">Sizes</p>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <Button
                  key={size}
                  size="sm"
                  className="text-xs md:text-sm"
                  variant={(editingProduct?.sizes || newProduct.sizes).includes(size) ? "default" : "outline"}
                  onClick={() => toggleMultiSelect("sizes", size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold mb-2 text-sm md:text-base">Colors</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <Button
                  key={color}
                  size="sm"
                  className="text-xs md:text-sm"
                  variant={(editingProduct?.colors || newProduct.colors).includes(color) ? "default" : "outline"}
                  onClick={() => toggleMultiSelect("colors", color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-start gap-3">
            <Textarea
              name="description"
              placeholder="Product Description"
              value={editingProduct?.description || newProduct.description}
              onChange={handleInput}
              className="flex-1"
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => handleEnhanceWithAI()}
                size="sm"
                disabled={aiLoading}
                className="whitespace-nowrap"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Enhance with AI
              </Button>
              {editingProduct && (
                <Button variant="ghost" size="sm" onClick={() => handleEnhanceWithAI(editingProduct)} disabled={aiLoading}>
                  Enhance current
                </Button>
              )}
            </div>
          </div>

          {/* Show generated meta keywords preview */}
          {((metaKeywords && metaKeywords.length > 0) || (editingProduct?.meta_keywords?.length ?? 0) > 0) && (
            <div className="mt-2 text-sm">
              <p className="font-medium">AI generated meta keywords:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {(editingProduct?.meta_keywords || metaKeywords).map((k) => (
                  <span key={k} className="px-2 py-1 bg-muted/50 rounded-md text-xs">{k}</span>
                ))}
              </div>

              {/* Editable comma-separated input */}
              <div className="mt-3">
                <p className="font-medium text-sm mb-1">Edit meta keywords (comma separated)</p>
                <Input
                  value={(editingProduct?.meta_keywords || metaKeywords).join(", ")}
                  onChange={(e) => {
                    const arr = e.target.value
                      .split(",")
                      .map(s => s.trim())
                      .filter(Boolean);
                    setMetaKeywords(arr);
                    if (editingProduct) setEditingProduct({ ...editingProduct, meta_keywords: arr });
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {editingProduct ? "Update Product" : "Add Product"}
          </Button>
          {editingProduct && (
            <Button variant="outline" onClick={() => { setEditingProduct(null); setMetaKeywords([]); }} className="w-full sm:w-auto">
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          )}
        </div>
      </Card>

      {/* Products Table */}
      <Card className="p-4 md:p-6 overflow-x-auto">
        <div className="min-w-[700px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                  Name <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead>Slug</TableHead>
                <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
                  Category <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead onClick={() => handleSort("price")} className="cursor-pointer">
                  Price <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedProducts.map((p, i) => (
                <TableRow key={p._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="truncate max-w-[140px]">{p.name}</TableCell>
                  <TableCell className="truncate max-w-[120px]">{p.slug}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>Rs. {p.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* Per-row enhance (calls AI, opens editor with enhanced text) */}
                      <Button variant="ghost" size="icon" onClick={() => handleEnhanceWithAI(p)} title="Enhance with AI">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(p); setMetaKeywords(p.meta_keywords || []); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p._id!)} >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
