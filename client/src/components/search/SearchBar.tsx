import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
}

const SearchBar = ({ initialQuery = "", className = "" }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [location, navigate] = useLocation();

  // Update the search query if the initialQuery changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="flex">
        <Input
          type="text"
          placeholder="Search transcriptions, people, places..."
          className="w-full border border-primary-200 dark:border-accent-700 rounded-l-md focus:ring-2 focus:ring-highlight focus:border-highlight transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          className="rounded-l-none bg-primary ml-2 hover:bg-primary/80"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
