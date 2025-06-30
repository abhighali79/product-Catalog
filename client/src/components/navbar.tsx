import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Microchip, Home, ShieldQuestion, Menu } from "lucide-react";
import { auth } from "@/lib/auth";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = location.startsWith("/admin");
  const isAuthenticated = auth.isAuthenticated();

  const handleLogout = () => {
    auth.removeToken();
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Microchip className="text-primary text-2xl" />
              <h1 className="text-xl font-bold text-slate-900">Sai Infotech</h1>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {!isAdmin && (
              <>
                <Link href="/" className="text-slate-600 hover:text-primary transition-colors">
                  Home
                </Link>
                <a href="#products" className="text-slate-600 hover:text-primary transition-colors">
                  Products
                </a>
                <a href="#services" className="text-slate-600 hover:text-primary transition-colors">
                  Services
                </a>
                <a href="#footer" className="text-slate-600 hover:text-primary transition-colors">
                  Contact
                </a>
              </>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin ? (
              isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-slate-600">Welcome, {auth.getUser()?.username}</span>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                  <Link href="/">
                    <Button variant="default">
                      <Home className="mr-2 h-4 w-4" />
                      Public View
                    </Button>
                  </Link>
                </div>
              ) : null
            ) : (
              <Link href="/admin/login">
                <Button>
                  <ShieldQuestion className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && !isAdmin && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-slate-600 hover:text-primary transition-colors py-2">
                Home
              </Link>
              <a href="#products" className="text-slate-600 hover:text-primary transition-colors py-2">
                Products
              </a>
              <a href="#services" className="text-slate-600 hover:text-primary transition-colors py-2">
                Services
              </a>
              <a href="#footer" className="text-slate-600 hover:text-primary transition-colors py-2">
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
