import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Place } from "@shared/schema";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import RelatedItemsCarousel from "@/components/related/RelatedItemsCarousel";
import { useMediaQuery } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { getPlaceBySlug } from "@/lib/contentLoader";
import { prepareJSX } from "@/lib/markdownUtils";

const PlacePage = () => {
  const [match, params] = useRoute("/places/:slug");
  const slug = params?.slug || "";
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Fetch place
  let isLoadingPlace = true;
  const place = getPlaceBySlug(slug);
  isLoadingPlace = !place;

  // Fetch related items
  const { data: relatedItems, isLoading: isLoadingRelated } = useQuery({
    queryKey: [`/api/place/${slug}/related`],
    enabled: !!slug,
  });

  // Set page title
  useEffect(() => {
    if (place) {
      document.title = `${place.name} | Ghost in the Archive`;
      isLoadingPlace = false;
    } else {
      document.title = "Place | Ghost in the Archive";
    }
  }, [place, isLoadingPlace]);

  // Define breadcrumb items
  const breadcrumbItems : BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Places", href: "/places" },
  ];

  if (place) {
    breadcrumbItems.push({ label: place.name, current: true });
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar (Desktop) */}
        {!isMobile && (
          <aside className="lg:w-64 flex-shrink-0">
            <Sidebar entityType="place" slug={slug} />
          </aside>
        )}

        {/* Main Content Area */}
        <div className="flex-grow">
          {isLoadingPlace ? (
            <div className="bg-white dark:bg-accent rounded-lg shadow-sm p-6 lg:p-8 border border-primary-100 dark:border-accent-700">
              <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mt-6 mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
            </div>
          ) : place ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-serif text-accent-900 dark:text-white">
                        {place.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {place.region && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-none">
                            {place.region}
                          </Badge>
                        )}
                        {place.country && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-none">
                            {place.country}
                          </Badge>
                        )}
                        {place.alternateNames && place.alternateNames.length > 0 && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-none">
                            Also known as: {place.alternateNames?.join(", ")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {place.description && (
                    <div 
                    className="text-accent-700 dark:text-primary-200 leading-relaxed markdown-content" 
                  >
                    {typeof place.description === 'string' 
                        ? prepareJSX(place.description) 
                        : <p className="text-red-500">Error: Document content could not be displayed</p>}
                  </div>
                  )}
                </CardContent>
              </Card>

              {/* Related Items Carousel (Mobile Only) */}
              {/* {isMobile && relatedItems && relatedItems.length > 0 && (
                <RelatedItemsCarousel items={relatedItems} />
              )} */}
            </motion.div>
          ) : (
            <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
              <CardContent className="pt-6">
                <h1 className="text-2xl font-serif font-bold text-accent-900 dark:text-white mb-4">
                  Place not found
                </h1>
                <p className="text-accent-700 dark:text-primary-200">
                  The requested place could not be found.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
