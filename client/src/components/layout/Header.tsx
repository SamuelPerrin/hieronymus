import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Link from "@/components/ui/link";
import { Menu, Search, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import DarkModeToggle from "../ui/dark-mode-toggle";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "Ghost in the Archive" }: HeaderProps) => {
  const [location, navigate] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const { toast } = useToast();
  const base = process.env.NODE_ENV === "production" ? "/hieronymus" : "";

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchOpen) setSearchOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false); // Close the menu after navigation
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleNavigation(`${base}/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    } else {
      toast({
        title: "Search query is empty",
        description: "Please enter a search term",
        variant: "destructive",
      });
    }
  };
  // Close the mobile menu when the hamburger is hidden
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <>
      <header className="bg-white dark:bg-accent shadow-sm sticky top-0 z-10 no-print">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href={base + "/"} className="flex items-center space-x-2">
                <Ghost className="h-6 w-6 text-accent-700 dark:text-primary-100" />
                <span className="font-display text-xl font-bold text-accent-900 dark:text-primary-200">{title}</span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              <Link href={base + "/"}>
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white", 
                  location === "/" && "text-accent-900 dark:text-white")}>
                  Home
                </Button>
              </Link>
              <Link href={base + "/documents"}>
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white", 
                  location.startsWith("/documents") && "text-accent-900 dark:text-white")}>
                  Documents
                </Button>
              </Link>
              <Link href={base + "/collections"}>
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white",
                  location.startsWith("/collections") && "text-accent-900 dark:text-white")}>
                  Collections
                </Button>
              </Link>
              <Link href={base + "/people"}>
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white",
                  location.startsWith("/people") && "text-accent-900 dark:text-white")}>
                  People
                </Button>
              </Link>
              <Link href={base + "/places"}>
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white",
                  location.startsWith("/places") && "text-accent-900 dark:text-white")}>
                  Places
                </Button>
              </Link>
              <Link href={base + "/events"}>
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white",
                  location.startsWith("/events") && "text-accent-900 dark:text-white")}>
                  Events
                </Button>
              </Link>
              <Link href={base + "/about"}>
                <Button variant="ghost" className={cn("text-accent-700 hover:text-white dark:text-primary-200 dark:hover:text-white",
                  location === "/about" && "text-accent-900 dark:text-white")}>
                  About
                </Button>
              </Link>
            </div>

            <div className="flex items-center">
              {!isMobile && (<DarkModeToggle />)}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSearch} 
                aria-label="Toggle search"
                className="text-accent-700 hover:text-accent-900 hover:bg-primary-100 dark:text-primary-200 dark:hover:text-white dark:hover:bg-accent/50"
              >
                <Search className="h-5 w-5" />
              </Button>

              {isMobile && (<Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                aria-label="Open menu"
                className="ml-2 text-accent-700 hover:text-accent-900 hover:bg-primary-100 dark:text-primary-200 dark:hover:text-white dark:hover:bg-accent/50"
              >
                <Menu className="h-5 w-5" />
              </Button>)}
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
        <div
          className="fixed z-50 bg-white shadow-md dark:bg-accent flex justify-end"
          style={{ top: "72px", right: "10px" }}
        >
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col items-end px-4 pt-6 pb-8 space-y-4">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={base + "/"}
                    onClick={() => handleNavigation(base + "/")}
                    className={cn(
                      "w-full text-right justify-end text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white",
                      location === "/" && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent"
                    )}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={base + "/documents"}
                    onClick={() => handleNavigation(base + "/documents")}
                    className={cn(
                      "w-full text-right justify-end text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white",
                      location.startsWith("/documents") && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent"
                    )}
                  >
                    Documents
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={base + "/collections"}
                    onClick={() => handleNavigation(base + "/collections")}
                    className={cn(
                      "w-full text-right justify-end text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white",
                      location.startsWith("/collections") && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent"
                    )}
                  >
                    Collections
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={base + "/people"}
                    onClick={() => handleNavigation(base + "/people")}
                    className={cn(
                      "w-full text-right justify-end text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white",
                      location.startsWith("/people") && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent"
                    )}
                  >
                    People
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={base + "/places"}
                    onClick={() => handleNavigation(base + "/places")}
                    className={cn(
                      "w-full text-right justify-end text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white",
                      location.startsWith("/places") && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent"
                    )}
                  >
                    Places
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={base + "/events"}
                    onClick={() => handleNavigation(base + "/events")}
                    className={cn(
                      "w-full text-right justify-end text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white",
                      location.startsWith("/events") && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent"
                    )}
                  >
                    Events
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={base + "/about"}
                    onClick={() => handleNavigation(base + "/about")}
                    className={cn(
                      "w-full text-right justify-end text-accent-700 hover:text-accent-900 dark:text-primary-200 dark:hover:text-white",
                      location === "/about" && "text-accent-900 bg-primary-100 dark:text-white dark:bg-accent"
                    )}
                  >
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* DarkModeToggle for narrow screens */}
              <NavigationMenuItem>
                <div className="pt-2">
                  <DarkModeToggle />
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
    </>
  );
};

export default Header;
