import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

// Backend API base URL — adjust if needed
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  description: string;
  image: string;
  slug: string;
  sizes: string[];
  colors: string[];
  category?: string;
  meta_keywords?: string[];
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        const data = await res.json();
        // data.categories may be an array of objects; map to names if needed
        const parsed =
          Array.isArray(data.categories) && data.categories.length > 0 && typeof data.categories[0] === 'object'
            ? data.categories.map((c: any) => c.name || c)
            : data.categories || ['Graphic', 'Tribal', 'Typography', 'Abstract', 'Tech', 'Accessories'];
        setCategories(parsed);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories(['Graphic', 'Tribal', 'Typography', 'Abstract', 'Tech', 'Accessories']);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        selectedCategories.forEach((cat) => params.append("categories", cat));
        params.set("min_price", String(priceRange[0]));
        params.set("max_price", String(priceRange[1]));
        params.set("page", "1");
        params.set("limit", "50");

        const res = await fetch(`${API_BASE}/products?${params.toString()}`);
        const data = await res.json();

        const normalized = (data.items || []).map((p: any) => {
          // ensure safe values & types
          const priceNum = Number(p.price ?? 0) || 0;
          const id = p.id || p._id || p.slug || `${(p.name || 'product').toString().toLowerCase().replace(/\s+/g,'-')}-${Math.random().toString(36).slice(2,8)}`;
          return {
            ...p,
            id,
            _id: p._id || p.id || id,
            name: p.name || 'Unnamed Product',
            price: priceNum,
            description: p.description ?? '',
            image: p.image || '/placeholder.png',
            slug: p.slug || (p.name ? (p.name as string).toLowerCase().replace(/\s+/g,'-') : id),
            sizes: Array.isArray(p.sizes) ? p.sizes : (p.sizes ? String(p.sizes).split(',').map((s:string)=>s.trim()) : []),
            colors: Array.isArray(p.colors) ? p.colors : (p.colors ? String(p.colors).split(',').map((c:string)=>c.trim()) : []),
            meta_keywords: p.meta_keywords || p.metaKeywords || [],
            category: p.category || p.Category || '',
          } as Product;
        });

        setProducts(normalized);
        setTotal(typeof data.total === 'number' ? data.total : normalized.length);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategories, priceRange]);

  // Toggle category
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Filters Sidebar Component
  const FiltersSidebar = () => (
    <div className="border-4 border-muted p-6 rounded-lg bg-background">
      <h2 className="text-2xl font-bold mb-6 uppercase">Filters</h2>

      <Accordion type="multiple" defaultValue={['category', 'price']}>
        {/* Category Filter */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-lg font-bold uppercase">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label
                    htmlFor={category}
                    className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-lg font-bold uppercase">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 space-y-4">
              <Slider
                min={0}
                max={5000}
                step={100}
                value={priceRange}
                onValueChange={(val: number | number[]) => {
                  if (Array.isArray(val) && val.length === 2) setPriceRange([val[0], val[1]]);
                }}
              />
              <div className="flex items-center justify-between text-sm font-bold">
                <span>Rs. {priceRange[0]}</span>
                <span>Rs. {priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          SHOP <span className="text-primary">ALL</span>
        </h1>
        <p className="font-urdu text-xl sm:text-2xl text-secondary">تمام مصنوعات</p>
      </div>

      {/* Filters toggle button (mobile) */}
      <div className="flex justify-center mb-6 lg:hidden">
        <Button variant="outline" onClick={() => setFiltersOpen(!filtersOpen)}>
          {filtersOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <FiltersSidebar />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing <span className="font-bold text-foreground">{total}</span> products
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-xl text-muted-foreground">
              Loading products...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} id={product.id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl font-bold text-muted-foreground">No products found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
