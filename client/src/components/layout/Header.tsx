import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import DarkModeToggle from "../ui/dark-mode-toggle";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Ghost in the Archive" }: HeaderProps) => {
  const [location, navigate] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchOpen) setSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    } else {
      toast({
        title: "Search query is empty",
        description: "Please enter a search term",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <header className="bg-white dark:bg-accent shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Ghost className="h-6 w-6 text-accent-700" />
                <span className="font-serif text-xl font-bold text-accent-900 dark:text-primary-200">{title}</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/">
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white", 
                  location === "/" && "text-accent-900 dark:text-white")}>
                  Home
                </Button>
              </Link>
              <Link href="/collections/letters">
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white",
                  location.startsWith("/collections") && "text-accent-900 dark:text-white")}>
                  Collections
                </Button>
              </Link>
              <Link href="/people/alexander-hamilton">
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white",
                  location.startsWith("/people") && "text-accent-900 dark:text-white")}>
                  People
                </Button>
              </Link>
              <Link href="/places/new-windsor">
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white",
                  location.startsWith("/places") && "text-accent-900 dark:text-white")}>
                  Places
                </Button>
              </Link>
              <Link href="/events/american-revolution">
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white",
                  location.startsWith("/events") && "text-accent-900 dark:text-white")}>
                  Events
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white",
                  location === "/about" && "text-accent-900 dark:text-white")}>
                  About
                </Button>
              </Link>
            </div>

            <div className="flex items-center">
              <DarkModeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSearch} 
                aria-label="Toggle search"
                className="text-accent-700 hover:text-accent-900 hover:bg-primary-100 dark:text-primary-200 dark:hover:text-white dark:hover:bg-accent/50"
              >
                <Search className="h-5 w-5" />
              </Button>

              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileMenu}
                  aria-label="Open menu"
                  className="ml-2 text-accent-700 hover:text-accent-900 hover:bg-primary-100 dark:text-primary-200 dark:hover:text-white dark:hover:bg-accent/50"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {searchOpen && (
            <div className="pb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="text"
                  placeholder="Search transcriptions, people, places..."
                  className="w-full px-4 py-2 border border-primary-200 rounded-md focus:ring-2 focus:ring-highlight focus:border-highlight transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-accent-500 hover:text-accent-700 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-white shadow-md md:hidden dark:bg-accent">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <Button 
                variant="ghost" 
                className={cn("w-full justify-start text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white", 
                  location === "/" && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent")}
              >
                Home
              </Button>
            </Link>
            <Link href="/collections/letters">
              <Button 
                variant="ghost" 
                className={cn("w-full justify-start text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white", 
                  location.startsWith("/collections") && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent")}
              >
                Collections
              </Button>
            </Link>
            <Link href="/people/alexander-hamilton">
              <Button 
                variant="ghost" 
                className={cn("w-full justify-start text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white", 
                  location.startsWith("/people") && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent")}
              >
                People
              </Button>
            </Link>
            <Link href="/places/new-windsor">
              <Button 
                variant="ghost" 
                className={cn("w-full justify-start text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white", 
                  location.startsWith("/places") && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent")}
              >
                Places
              </Button>
            </Link>
            <Link href="/events/american-revolution">
              <Button 
                variant="ghost" 
                className={cn("w-full justify-start text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white", 
                  location.startsWith("/events") && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent")}
              >
                Events
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                variant="ghost" 
                className={cn("w-full justify-start text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white", 
                  location === "/about" && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent")}
              >
                About
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
