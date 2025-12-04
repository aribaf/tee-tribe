const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;      // "/assets/product-1.jpg"
  slug: string;
  sizes: string[];
  colors: string[];
  category: string;
  frontendId?: string;
};

export async function fetchProducts(params: {
  categories?: string[];
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
  q?: string;
}) {
  const search = new URLSearchParams();
  if (params.categories && params.categories.length)
    params.categories.forEach(c => search.append("categories", c));
  if (params.min_price !== undefined) search.set("min_price", String(params.min_price));
  if (params.max_price !== undefined) search.set("max_price", String(params.max_price));
  if (params.page)  search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.q)     search.set("q", params.q);

  const res = await fetch(`${API_BASE}/products?${search.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json() as Promise<{items: Product[]; total: number; page: number; limit: number;}>;
}

export async function fetchProductBySlug(slug: string) {
  const res = await fetch(`${API_BASE}/products/slug/${slug}`);
  if (!res.ok) throw new Error("Not found");
  return res.json() as Promise<Product>;
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json() as Promise<{categories: string[]}>;
}
