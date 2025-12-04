import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shirt, Palette, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const heroBanner = "/assets/hero-banner.jpg";

interface Review {
  id: string;
  product_id: number;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

const Home = () => {
  const featuredProducts = products.slice(0, 3);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data: reviewsData, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;

      const reviewsWithProfiles = await Promise.all(
        (reviewsData || []).map(async (review) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", review.user_id)
            .single();
          return { ...review, profiles: profile || { full_name: "Customer" } };
        })
      );

      setReviews(reviewsWithProfiles);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <div>
      {/* ✅ SEO Optimization */}
      <Helmet>
        <title>Wear Your Bold Statement | Custom T-Shirts & Designs</title>
        <meta
          name="description"
          content="Shop premium custom t-shirts or sell your own designs. Be bold, be fearless, and express yourself with high-quality fabric and unique prints."
        />
        <meta
          name="keywords"
          content="custom t-shirts, shirt design, print your own t-shirt, streetwear, fashion, design marketplace"
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Wear Your Bold Statement" />
        <meta
          property="og:description"
          content="Custom premium t-shirts for fearless creators. Upload your own designs or shop exclusive styles."
        />
        <meta property="og:image" content={heroBanner} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wear Your Bold Statement" />
        <meta
          name="twitter:description"
          content="Shop bold and custom t-shirts, or sell your designs online."
        />
        <meta name="twitter:image" content={heroBanner} />

        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "WebSite",
            name: "Wear Your Bold Statement",
            url: "https://yourwebsite.com",
            description:
              "Custom premium t-shirts and design marketplace for creative individuals.",
            publisher: {
              "@type": "Organization",
              name: "YourBrand",
            },
            potentialAction: {
              "@type": "SearchAction",
              target: "https://yourwebsite.com/shop?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <img
          src={heroBanner}
          alt="Bold custom t-shirts showcasing fearless style"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              WEAR YOUR
              <br />
              <span className="text-primary">BOLD</span> STATEMENT
            </h1>
            <p className="text-3xl md:text-4xl mb-4 text-secondary font-bold tracking-wider">
              BE FEARLESS • BE YOU
            </p>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl">
              Custom t-shirts with attitude. Shop exclusive designs or upload
              your own. Be unique. Be bold.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button
                  size="lg"
                  className="text-lg px-8 bg-primary hover:bg-primary/90 shadow-neon"
                >
                  SHOP NOW
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                >
                  SELL YOUR DESIGN
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-4 border-muted p-8 hover:border-primary transition-all">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">LIGHTNING FAST</h3>
              <p className="text-muted-foreground">
                Quick delivery to your doorstep. No waiting.
              </p>
            </div>
            <div className="border-4 border-muted p-8 hover:border-primary transition-all">
              <Shirt className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-2xl font-bold mb-2">PREMIUM QUALITY</h3>
              <p className="text-muted-foreground">
                High-quality fabric that lasts. Feel the difference.
              </p>
            </div>
            <div className="border-4 border-muted p-8 hover:border-primary transition-all">
              <Palette className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">CUSTOM DESIGNS</h3>
              <p className="text-muted-foreground">
                Upload your art. We bring it to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            FEATURED <span className="text-primary">DESIGNS</span>
          </h2>
          <p className="font-urdu text-2xl text-secondary mb-8">نمایاں ڈیزائن</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <Link to="/shop">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              VIEW ALL DESIGNS
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Customer Reviews */}
      {reviews.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              WHAT OUR <span className="text-primary">CUSTOMERS SAY</span>
            </h2>
            <p className="font-urdu text-2xl text-secondary mb-12">گاہک کی رائے</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-card border-2 border-muted p-6 hover:border-primary transition-all"
                >
                  <div className="flex items-center mb-4 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? "text-primary fill-primary"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {review.comment}
                  </p>
                  <p className="font-bold text-sm">
                    — {review.profiles?.full_name || "Customer"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call-to-Action Section */}
      <section className="py-20 bg-card border-t-4 border-b-4 border-primary text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">GOT A DESIGN?</h2>
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
          Upload your artwork and turn it into reality. Earn money while
          expressing yourself.
        </p>
        <Link to="/sell">
          <Button
            size="lg"
            className="text-lg px-12 bg-secondary hover:bg-secondary/90 shadow-orange"
          >
            START SELLING
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
