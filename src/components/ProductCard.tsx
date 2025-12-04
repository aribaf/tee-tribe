// ProductCard.tsx — defensive rendering tweaks
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id?: string;               // make optional
  name: string;
  price: number | string;
  image?: string;
  slug: string;
}

export const ProductCard = ({ id, name, price, image, slug }: ProductCardProps) => {
  const { addItem } = useCart();

  // ensure price is numeric
  const priceNum = Number(price) || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: id || slug, // fallback to slug if id missing
      name,
      price: priceNum,
      image: image || '/placeholder.png',
      size: 'M',
    });
  };

  return (
    <Link
      to={`/product/${slug}`}
      className="group relative block border-4 border-muted bg-card transition-all hover:border-primary hover:shadow-brutal"
    >
      <div className="aspect-square overflow-hidden bg-muted/20">
        <img
          src={image || '/placeholder.png'}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-secondary">
            Rs. {priceNum.toLocaleString()}
          </span>
          <Button
            size="icon"
            onClick={handleAddToCart}
            className="bg-primary hover:bg-primary/90 shadow-neon"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="absolute inset-0 border-4 border-transparent transition-all opacity-0 group-hover:opacity-100 group-hover:border-primary pointer-events-none" />
    </Link>
  );
};
