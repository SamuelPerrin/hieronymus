import { useEffect } from "react";
import { getDocumentBySlug, getRelatedItemsForSlug, getCollectionById } from "@/lib/contentLoader";
import { useRoute } from "wouter";
import { Collection, Document, EntityType, RelatedItem, SourceType } from "@/models/schema";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import DocumentViewer from "@/components/document/DocumentViewer";
import DocumentNav from "@/components/document/DocumentNav";
import Sidebar from "@/components/layout/Sidebar";
import RelatedItemsCarousel from "@/components/related/RelatedItemsCarousel";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

const DocumentPage = () => {
  const [match, params] = useRoute("/documents/:slug");
  const slug = params?.slug || "";
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Load document from markdown
  const document = slug ? getDocumentBySlug(slug) : {
    id: 0,
    slug,
    type: SourceType.letter,
    title: "Document not found",
    content: "The requested document could not be found.",
    collectionId: 0,
  } as Document;
  const isLoadingDocument = false;

  // Load related items for sidebar
  let isLoadingRelated = true;
  const relatedItems: RelatedItem[] = slug ? getRelatedItemsForSlug(slug, EntityType.document) : [];
  isLoadingRelated = false;

  // Set document title
  useEffect(() => {
    if (document) {
      // Use window.document instead of document to avoid conflict with the document variable
      window.document.title = `${document.title} | Ghost in the Archive`;
    } else {
      window.document.title = "Document | Ghost in the Archive";
    }
  }, [document]);

  // Define breadcrumb items
  let collection: Collection | undefined;
  if (document?.collectionId) {
    collection = getCollectionById(document?.collectionId);
  }

  const breadcrumbItems : BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Collections", href:"/collections" },
    collection
      ? { label: collection.title, href: `/collections/${collection.slug}` }
      : { label: "Documents", href: "/documents" },
  ];

  if (document) {
    // Add the current document to breadcrumbs with the current flag
    breadcrumbItems.push({ 
      label: document.title, 
      href: `/documents/${document.slug}`,
      current: true 
    });
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar (Desktop) */}
        {!isMobile && (
          <aside className="lg:w-64 flex-shrink-0">
            {isLoadingRelated ? (
              <div className="sticky top-24 bg-white dark:bg-accent rounded-lg shadow-sm p-5 border border-primary-100 dark:border-accent-700 h-96">
                <Skeleton className="h-6 w-36 mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-full mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-full mb-4" />
              </div>
            ) : (
              <Sidebar entityType={EntityType.document} slug={slug} />
            )}
          </aside>
        )}

        {/* Main Content Area */}
        <div className="flex-grow">
          {isLoadingDocument ? (
            <div className="bg-white dark:bg-accent rounded-lg shadow-sm p-6 lg:p-8 border border-primary-100 dark:border-accent-700">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 mb-4">
                <Skeleton className="h-6 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <Skeleton className="h-32 w-full mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ) : document ? (
            <DocumentViewer document={document} />
          ) : (
            <div className="bg-white dark:bg-accent rounded-lg shadow-sm p-6 lg:p-8 border border-primary-100 dark:border-accent-700">
              <h1 className="text-2xl font-serif font-bold text-accent-900 dark:text-white">
                Document not found
              </h1>
              <p className="text-accent-700 dark:text-primary-200 mt-4">
                The requested document could not be found.
              </p>
            </div>
          )}

          {/* Document Navigation */}
          {/* {document && (
            <DocumentNav
              prevDoc={{
                slug: "hamilton-to-washington-1781",
                title: "Letter to Congress (March 1781)",
              }}
              nextDoc={{
                slug: "washington-to-hamilton-1781",
                title: "Washington's Response (April 1781)",
              }}
            />
          )} */}

          {/* Related Items Carousel (Mobile Only) */}
          {isMobile && relatedItems && relatedItems.length > 0 && (
            <RelatedItemsCarousel items={relatedItems} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
