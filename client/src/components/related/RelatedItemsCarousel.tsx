import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RelatedItem } from "@/models/schema";
import RelatedItemCard from "./RelatedItemCard";

interface RelatedItemsCarouselProps {
  items: RelatedItem[];
  title?: string;
}

const RelatedItemsCarousel = ({ 
  items,
  title = "Related Items" 
}: RelatedItemsCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check if we need to show scroll arrows
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition(); // Initial check
      
      // Clear on unmount
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [items]);

  // Re-check when items or window size changes
  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    
    return () => {
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 300; // Adjust as needed
    const currentScroll = scrollContainerRef.current.scrollLeft;
    
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!items.length) {
    return null;
  }

  return (
    <div className="mt-8 relative">
      <div className="flex items-center mb-4">
        <h3 className="font-serif text-xl font-bold text-accent-900 dark:text-white">
          {title}
        </h3>
      </div>
      
      <div className="relative">
        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-accent shadow-md"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-accent shadow-md"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 space-x-4 -mx-4 px-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <RelatedItemCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedItemsCarousel;
