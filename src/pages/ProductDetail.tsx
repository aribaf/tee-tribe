import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReviewCard } from "@/components/ReviewCard";
import { Minus, Plus, ArrowLeft, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters").max(500),
});

interface Review {
  _id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  slug: string;
  sizes: string[];
  colors: string[];
  category: string;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔹 Fetch product by slug
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/products/slug/${slug}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // 🔹 Fetch reviews
  useEffect(() => {
    if (product) fetchReviews();
  }, [product]);

  const fetchReviews = async () => {
    if (!product) return;
    try {
      const res = await fetch(`${API_BASE}/reviews/${product._id}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // 🔹 Add to Cart
  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: selectedSize,
        });
      }
      toast({
        title: "Added to cart!",
        description: `${product.name} (${selectedSize}) x${quantity} added to your cart.`,
      });
    }
  };

  // 🔹 Submit Review
  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    try {
      reviewSchema.parse({ rating, comment });
      setSubmitting(true);

      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product._id,
          user_name: user.email || "Anonymous",
          rating,
          comment,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review");

      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });

      setRating(0);
      setComment("");
      fetchReviews();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Loading product...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Product not found</h1>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 sm:py-16">
      <Link
        to="/shop"
        className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6 sm:mb-8"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Shop
      </Link>

      {/* 🔹 Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image */}
        <div className="border-4 border-muted overflow-hidden rounded-lg shadow-md aspect-square max-w-md mx-auto">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6 sm:space-y-8">
          <span className="inline-block px-4 py-1 border-2 border-primary text-primary text-xs sm:text-sm font-bold uppercase mb-2 sm:mb-4">
            {product.category}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">{product.name}</h1>

          <div className="text-3xl sm:text-4xl font-bold text-secondary mb-4 sm:mb-6">
            Rs. {product.price.toLocaleString()}
          </div>

          <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 uppercase">Select Size</h3>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <div key={size}>
                      <RadioGroupItem value={size} id={size} className="peer sr-only" />
                      <Label
                        htmlFor={size}
                        className="flex h-10 w-10 sm:h-12 sm:w-12 cursor-pointer items-center justify-center 
                          border-2 border-muted font-bold text-sm sm:text-base rounded-md 
                          transition-all hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 uppercase">Quantity</h3>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="border-2"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl sm:text-2xl font-bold w-10 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="border-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            onClick={handleAddToCart}
            className="w-full text-base sm:text-lg shadow-neon mt-6 sm:mt-8"
          >
            ADD TO CART
          </Button>

          {/* Product Details */}
          <div className="mt-10 border-t-2 border-muted pt-6">
            <h3 className="text-lg sm:text-xl font-bold mb-3 uppercase">Product Details</h3>
            <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
              <li>• Premium 100% cotton fabric</li>
              <li>• High-quality screen printing</li>
              <li>• Machine washable</li>
              <li>• Unisex fit</li>
              <li>• Made with attitude</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 🔹 Reviews Section */}
      <div className="mt-12 sm:mt-16">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(averageRating)
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-base sm:text-lg font-semibold">
                {averageRating.toFixed(1)} out of 5
              </span>
              <span className="text-muted-foreground">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        {/* Add Review Form */}
        <div className="border-2 border-foreground p-4 sm:p-6 mb-8 bg-card rounded-lg">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Write a Review</h3>
          {user ? (
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Rating</Label>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          i < rating ? "fill-primary text-primary" : "fill-muted text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="comment" className="mb-2 block">
                  Your Review
                </Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              <Button
                onClick={handleSubmitReview}
                disabled={submitting || rating === 0 || !comment}
                className="w-full sm:w-auto"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Please{" "}
              <Link to="/auth" className="text-primary font-bold hover:underline">
                log in
              </Link>{" "}
              to write a review.
            </p>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} onDelete={fetchReviews} />
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
              <p className="text-muted-foreground text-base sm:text-lg">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
