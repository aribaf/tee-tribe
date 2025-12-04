import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, userRole, signOut } = useAuth();

  const navLinks = [
    { to: '/shop', label: 'Shop', urdu: 'خریداری' },
    { to: '/sell', label: 'Sell', urdu: 'فروخت' },
    { to: '/about', label: 'About', urdu: 'متعلق' },
    { to: '/contact', label: 'Contact', urdu: 'رابطہ' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-4 border-primary bg-background">
      <div className="container mx-auto px-4">
        {/* ─────────────── TOP BAR ─────────────── */}
        <div className="flex h-20 items-center justify-between">
          {/* 🔹 Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="text-3xl font-extrabold tracking-tight transition-all group-hover:text-primary">
              <span className="text-primary">TEE</span>
              <span className="text-foreground">-</span>
              <span className="text-secondary">TRIBE</span>
            </div>
            <div className="hidden sm:block font-urdu text-xl text-muted-foreground">
              ٹی ٹرائب
            </div>
          </Link>

          {/* 🔹 Navigation (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group relative text-lg font-bold uppercase tracking-wider transition-colors hover:text-primary"
              >
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-1 w-0 bg-primary transition-all group-hover:w-full" />
                </span>
                <span className="ml-2 font-urdu text-sm text-muted-foreground">
                  {link.urdu}
                </span>
              </Link>
            ))}
          </nav>

          {/* 🔹 Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search (desktop only) */}
            <div className="hidden lg:flex items-center">
              <Input
                type="search"
                placeholder="Search..."
                className="w-48 border-2 border-muted bg-muted/20 focus:border-primary"
              />
            </div>

            {/* Search icon (mobile only) */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden border-2 hover:border-primary hover:bg-primary/10"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button
                variant="outline"
                size="icon"
                className="relative border-2 hover:border-primary hover:bg-primary/10"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-2 hover:border-primary hover:bg-primary/10">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-2 border-primary bg-card shadow-coral">
                  <DropdownMenuLabel className="font-bold text-card-foreground">
                    My Account
                    {userRole === 'admin' && (
                      <span className="block text-xs text-primary font-normal mt-1">Admin</span>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  {userRole === 'admin' && (
                    <DropdownMenuItem asChild className="hover:bg-primary/10">
                      <Link to="/admin" className="cursor-pointer font-bold text-card-foreground">
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={signOut}
                    className="cursor-pointer font-bold text-card-foreground hover:bg-destructive/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="font-bold border-2 hover:border-primary hover:bg-primary/10">
                  LOGIN
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* ─────────────── MOBILE MENU ─────────────── */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t-2 border-muted py-4 animate-slide-in">
            <div className="flex flex-col gap-3 px-2">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full border-2 border-muted bg-muted/20"
              />
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-lg font-bold uppercase transition-colors hover:bg-muted hover:text-primary"
                >
                  <span>{link.label}</span>
                  <span className="font-urdu text-sm text-muted-foreground">{link.urdu}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
