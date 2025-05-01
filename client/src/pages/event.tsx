import { useEffect } from "react";
import { useRoute } from "wouter";
import { EntityType, Event } from "@/models/schema";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import RelatedItemsCarousel from "@/components/related/RelatedItemsCarousel";
import { useMediaQuery } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { prepareJSX } from "@/lib/markdownUtils";
import { getEventBySlug, getRelatedItemsForSlug } from "@/lib/contentLoader";
import { formatDate } from "@/lib/utils";

const EventPage = () => {
  const [match, params] = useRoute("/events/:slug");
  const slug = params?.slug || "";
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Fetch event
  let isLoadingEvent = true;
  const event = slug ? getEventBySlug(slug) : {
    id: 0,
    slug,
    name: "Event not found",
    description: "The requested event could not be found.",
  } as Event;
  isLoadingEvent = !event;

  // Fetch related items
  let isLoadingRelated = true;
  const relatedItems = slug ? getRelatedItemsForSlug(slug, EntityType.event) : [];
  isLoadingRelated = false;

  // Set page title
  useEffect(() => {
    if (event) {
      document.title = `${event.name} | Ghost in the Archive`;
    } else {
      document.title = "Event | Ghost in the Archive";
    }
  }, [event]);

  // Define breadcrumb items
  const breadcrumbItems : BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
  ];

  if (event) {
    breadcrumbItems.push({ label: event.name, current: true });
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar (Desktop) */}
        {!isMobile && (
          <aside className="lg:w-64 flex-shrink-0">
            <Sidebar entityType={EntityType.event} slug={slug} />
          </aside>
        )}

        {/* Main Content Area */}
        <div className="flex-grow">
          {isLoadingEvent ? (
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
          ) : event ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-900 h-16 w-16 rounded-full flex items-center justify-center  flex-shrink-0">
                      <Calendar className="h-8 w-8 text-green-800 dark:text-green-200" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-serif text-accent-900 dark:text-white">
                        {event.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {!event.startDate && (event.startYear && event.endYear) && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-none">
                            {event.startYear === event.endYear 
                              ? event.startYear 
                              : `${event.startYear}–${event.endYear}`}
                          </Badge>
                        )}
                        {event.startDate && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-none">
                            {(event.startDate && event.endDate) ? "Started:" : "Date:"} {formatDate(event.startDate)}
                          </Badge>
                        )}
                        {event.endDate && (
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-none">
                            Ended: {formatDate(event.endDate)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {event.description && (
                    <div 
                    className="text-accent-700 dark:text-accent-200 leading-relaxed markdown-content max-w-prose" 
                  >
                    {typeof event.description === 'string' 
                        ? prepareJSX(event.description) 
                        : <p className="text-red-500">Error: Document content could not be displayed</p>}
                  </div>
                  )}
                </CardContent>
              </Card>

              {/* Related Items Carousel (Mobile Only) */}
              {isMobile && relatedItems && relatedItems.length > 0 && (
                <RelatedItemsCarousel items={relatedItems} />
              )}
            </motion.div>
          ) : (
            <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
              <CardContent className="pt-6">
                <h1 className="text-2xl font-serif font-bold text-accent-900 dark:text-white mb-4">
                  Event not found
                </h1>
                <p className="text-accent-700 dark:text-primary-200">
                  The requested event could not be found.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPage;
