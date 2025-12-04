import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t-4 border-primary bg-card mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-primary">TEE</span>
              <span>-</span>
              <span className="text-secondary">TRIBE</span>
            </div>
            <p className="text-muted-foreground">
              Bold designs for bold people.
            </p>
            <p className="font-urdu text-sm text-muted-foreground mt-2">
              جرات مند لوگوں کے لیے جرات مندانہ ڈیزائن
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">Shop</Link></li>
              <li><Link to="/sell" className="text-muted-foreground hover:text-primary transition-colors">Sell</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Returns</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border-2 border-muted flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 border-2 border-muted flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 border-2 border-muted flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-muted mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Tee-Tribe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
