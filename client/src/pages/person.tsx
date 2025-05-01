import { useEffect } from "react";
import { useRoute } from "wouter";
import { EntityType, Person } from "@/models/schema";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import RelatedItemsCarousel from "@/components/related/RelatedItemsCarousel";
import { useMediaQuery } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { prepareJSX } from "@/lib/markdownUtils";
import { getPersonBySlug, getRelatedItemsForSlug } from "@/lib/contentLoader";
import { formatDate } from "@/lib/utils";

const PersonPage = () => {
  const [match, params] = useRoute("/people/:slug");
  const slug = params?.slug || "";
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Fetch person
  let isLoadingPerson = true;
  const person = slug ? getPersonBySlug(slug) : {
    id: 0,
    slug,
    name: "Person not found",
    description: "The requested person could not be found.",
  } as Person;
  isLoadingPerson = !person;

  // Fetch related items
  let isLoadingRelated = true;
  const relatedItems = slug ? getRelatedItemsForSlug(slug, EntityType.person) : [];
  isLoadingRelated = false;

  // Set page title
  useEffect(() => {
    if (person) {
      document.title = `${person.name} | Ghost in the Archive`;
    } else {
      document.title = "Person | Ghost in the Archive";
    }
  }, [person]);

  // Define breadcrumb items
  const breadcrumbItems : BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "People", href: "/people" },
  ];

  if (person) {
    breadcrumbItems.push({ label: person.name, current: true });
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar (Desktop) */}
        {!isMobile && (
          <aside className="lg:w-64 flex-shrink-0">
            <Sidebar entityType={EntityType.person} slug={slug} />
          </aside>
        )}

        {/* Main Content Area */}
        <div className="flex-grow">
          {isLoadingPerson ? (
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
          ) : person ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="bg-red-100 dark:bg-red-900 h-16 w-16 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-8 w-8 text-red-800 dark:text-red-200" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-serif text-accent-900 dark:text-white">
                        {person.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {person.birthYear && person.deathYear && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-none">
                            {person.birthYear}–{person.deathYear}
                          </Badge>
                        )}
                        {person.alternateNames && person.alternateNames.length > 0 && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-none">
                            Also known as: {person.alternateNames.join(", ")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {person.description && (
                    <div 
                    className="text-accent-700 dark:text-accent-200 leading-relaxed markdown-content max-w-prose" 
                  >
                    {typeof person.description === 'string' 
                        ? prepareJSX(person.description) 
                        : <p className="text-red-500">Error: Document content could not be displayed</p>}
                  </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {(person.birthDate || person.birthYear) && (
                      <div className="border border-primary-100 dark:border-accent-700 rounded-md p-4">
                        <h3 className="text-sm font-sans font-semibold text-accent-700 dark:text-primary-200 uppercase tracking-wider mb-2">
                          Birth
                        </h3>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span>{formatDate(person.birthDate!.toString()) || `Year: ${person.birthYear}`}</span>
                        </div>
                      </div>
                    )}

                    {(person.deathDate || person.deathYear) && (
                      <div className="border border-primary-100 dark:border-accent-700 rounded-md p-4">
                        <h3 className="text-sm font-sans font-semibold text-accent-700 dark:text-primary-200 uppercase tracking-wider mb-2">
                          Death
                        </h3>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span>{formatDate(person.deathDate!.toString()) || `Year: ${person.deathYear}`}</span>
                        </div>
                      </div>
                    )}
                  </div>
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
                  Person not found
                </h1>
                <p className="text-accent-700 dark:text-primary-200">
                  The requested person could not be found.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonPage;
