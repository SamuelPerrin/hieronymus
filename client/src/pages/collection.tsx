import { useEffect } from "react";
import { useRoute } from "wouter";
import Link from "@/components/ui/link";
import { Collection, Document, EntityType } from "@/models/schema";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, ArrowRight, Archive } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { extractExcerpt, prepareJSX } from "@/lib/markdownUtils";
import Sidebar from "@/components/layout/Sidebar";
import { useMediaQuery } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { getCollectionBySlug, getDocumentsByCollectionId } from "@/lib/contentLoader";

const CollectionPage = () => {
  const [match, params] = useRoute("/collections/:slug");
  const slug = params?.slug || "";
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Fetch collection
  let isLoadingCollection = true;
  const collection = slug ? getCollectionBySlug(slug) : {
    id: 0,
    slug,
    title: "Collection not found",
    content: "The requested collection could not be found.",
  } as Collection;
  isLoadingCollection = !collection;

  // Fetch documents for this collection
  let isLoadingDocuments = true;
  const documents : Document[] = [];
  if (collection) {
    documents.push(...getDocumentsByCollectionId(collection.id));
    isLoadingDocuments = documents.length === 0;
  }

  // Set page title
  useEffect(() => {
    if (collection) {
      document.title = `${collection.title} | Ghost in the Archive`;
    } else {
      document.title = "Collection | Ghost in the Archive";
    }
  }, [collection]);

  // Define breadcrumb items
  const breadcrumbItems : BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections"},
  ];

  if (collection) {
    breadcrumbItems.push({ label: collection.title, current: true });
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar (Desktop) */}
        {!isMobile && (
          <aside className="lg:w-64 flex-shrink-0">
            <Sidebar entityType={EntityType.collection} slug={slug} />
          </aside>
        )}

        {/* Main Content Area */}
        <div className="flex-grow">
          {isLoadingCollection ? (
            <div className="bg-white dark:bg-accent rounded-lg shadow-sm p-6 lg:p-8 border border-primary-100 dark:border-accent-700">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6 mb-8" />
            </div>
          ) : collection ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 mb-8">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="bg-orange-100 dark:bg-orange-900 h-16 w-16 rounded-full flex items-center justify-center flex-shrink-0">
                      <Archive className="h-8 w-8 text-orange-800 dark:text-orange-200" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-serif text-accent-900 dark:text-white">
                        {collection.title}
                      </CardTitle>
                      {collection.description && (
                        <CardDescription className="text-accent-700 dark:text-primary-200 text-base">
                          {collection.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {collection.content && (
                    <div 
                    className="text-accent-700 dark:text-accent-200 leading-relaxed markdown-content"
                  >
                    {typeof collection.content === 'string' 
                        ? prepareJSX(collection.content) 
                        : <p className="text-red-500">Error: Document content could not be displayed</p>}
                  </div>
                  )}
                </CardContent>
              </Card>

              <h2 className="font-serif text-xl font-bold text-accent-900 dark:text-white mb-4">
                Documents in this Collection
              </h2>

              {isLoadingDocuments ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/3" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : documents && documents.length > 0 ? (
                <div className="space-y-6">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-serif hover:text-primary transition-colors">
                          <Link href={`/documents/${doc.slug}`}>
                            {doc.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="flex items-center text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" /> {doc.date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-accent-700 dark:text-accent-300 line-clamp-3">
                          {extractExcerpt(doc.content)}
                        </p>
                        <Link href={`/documents/${doc.slug}`} className="inline-flex items-center mt-2 text-primary hover:text-primary/80 text-sm">
                          Read full document
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                  <CardContent className="pt-6">
                    <p className="text-accent-700 dark:text-accent-200">
                      No documents found in this collection.
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ) : (
            <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
              <CardContent className="pt-6">
                <h1 className="text-2xl font-serif font-bold text-accent-900 dark:text-white mb-4">
                  Collection not found
                </h1>
                <p className="text-accent-700 dark:text-accent-200">
                  The requested collection could not be found.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
