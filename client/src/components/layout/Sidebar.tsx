import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { RelatedItem } from "@shared/schema";
import { User, MapPin, Calendar, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarProps {
  entityType: "document" | "person" | "place" | "event" | "collection";
  slug: string;
}

const Sidebar = ({ entityType, slug }: SidebarProps) => {
  const { data: relatedItems, isLoading } = useQuery<RelatedItem[]>({
    queryKey: [`/api/${entityType}/${slug}/related`],
  });

  const groupedItems = relatedItems
    ? {
        people: relatedItems.filter((item) => item.type === "person"),
        places: relatedItems.filter((item) => item.type === "place"),
        events: relatedItems.filter((item) => item.type === "event"),
        documents: relatedItems.filter((item) => item.type === "document"),
        collections: relatedItems.filter((item) => item.type === "collection"),
      }
    : null;

  const getIcon = (type: string) => {
    switch (type) {
      case "person":
        return <User className="h-4 w-4" />;
      case "place":
        return <MapPin className="h-4 w-4" />;
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "document":
      case "collection":
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="sticky top-24 bg-white dark:bg-accent rounded-lg shadow-sm p-5 border border-primary-100 dark:border-accent-700">
        <h3 className="font-serif text-lg font-bold mb-4 text-accent-900 dark:text-white border-b border-primary-100 dark:border-accent-700 pb-2">
          Related Content
        </h3>
        <div className="space-y-6">
          {["People", "Places", "Events", "Documents"].map((section) => (
            <div key={section} className="mb-6">
              <h4 className="font-sans font-semibold text-accent-700 dark:text-primary-200 mb-2 text-sm uppercase tracking-wider">
                {section}
              </h4>
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center p-1 gap-2">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!groupedItems || Object.values(groupedItems).every((group) => group.length === 0)) {
    return (
      <div className="sticky top-24 bg-white dark:bg-accent rounded-lg shadow-sm p-5 border border-primary-100 dark:border-accent-700">
        <h3 className="font-serif text-lg font-bold mb-4 text-accent-900 dark:text-white border-b border-primary-100 dark:border-accent-700 pb-2">
          Related Content
        </h3>
        <p className="text-muted-foreground">No related content found.</p>
      </div>
    );
  }

  return (
    <div className="sticky top-24 bg-white dark:bg-accent rounded-lg shadow-sm p-5 border border-primary-100 dark:border-accent-700">
      <h3 className="font-serif text-lg font-bold mb-4 text-accent-900 dark:text-white border-b border-primary-100 dark:border-accent-700 pb-2">
        Related Content
      </h3>

      {/* People Section */}
      {groupedItems.people.length > 0 && (
        <div className="mb-6">
          <h4 className="font-sans font-semibold text-accent-700 dark:text-primary-200 mb-2 text-sm uppercase tracking-wider">
            People
          </h4>
          <ul className="space-y-2">
            {groupedItems.people.map((person) => (
              <li key={`person-${person.id}`}>
                <Link href={`/people/${person.slug}`}>
                  <a className="flex items-center hover:bg-primary-50 dark:hover:bg-accent-700 p-1 rounded transition-colors">
                    <span className="w-7 h-7 rounded-full bg-accent-100 dark:bg-accent-800 flex-shrink-0 flex items-center justify-center text-accent-700 dark:text-primary-200 mr-2 text-xs">
                      <User className="h-4 w-4" />
                    </span>
                    <span className="text-accent-700 dark:text-primary-200 hover:text-accent-900 dark:hover:text-white transition-colors">
                      {person.name}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Places Section */}
      {groupedItems.places.length > 0 && (
        <div className="mb-6">
          <h4 className="font-sans font-semibold text-accent-700 dark:text-primary-200 mb-2 text-sm uppercase tracking-wider">
            Places
          </h4>
          <ul className="space-y-2">
            {groupedItems.places.map((place) => (
              <li key={`place-${place.id}`}>
                <Link href={`/places/${place.slug}`}>
                  <a className="flex items-center hover:bg-primary-50 dark:hover:bg-accent-700 p-1 rounded transition-colors">
                    <span className="w-7 h-7 rounded-full bg-accent-100 dark:bg-accent-800 flex-shrink-0 flex items-center justify-center text-accent-700 dark:text-primary-200 mr-2 text-xs">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="text-accent-700 dark:text-primary-200 hover:text-accent-900 dark:hover:text-white transition-colors">
                      {place.name}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Events Section */}
      {groupedItems.events.length > 0 && (
        <div className="mb-6">
          <h4 className="font-sans font-semibold text-accent-700 dark:text-primary-200 mb-2 text-sm uppercase tracking-wider">
            Events
          </h4>
          <ul className="space-y-2">
            {groupedItems.events.map((event) => (
              <li key={`event-${event.id}`}>
                <Link href={`/events/${event.slug}`}>
                  <a className="flex items-center hover:bg-primary-50 dark:hover:bg-accent-700 p-1 rounded transition-colors">
                    <span className="w-7 h-7 rounded-full bg-accent-100 dark:bg-accent-800 flex-shrink-0 flex items-center justify-center text-accent-700 dark:text-primary-200 mr-2 text-xs">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <span className="text-accent-700 dark:text-primary-200 hover:text-accent-900 dark:hover:text-white transition-colors">
                      {event.name}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Documents Section */}
      {groupedItems.documents.length > 0 && (
        <div className="mb-6">
          <h4 className="font-sans font-semibold text-accent-700 dark:text-primary-200 mb-2 text-sm uppercase tracking-wider">
            Related Documents
          </h4>
          <ul className="space-y-2">
            {groupedItems.documents.map((doc) => (
              <li key={`doc-${doc.id}`}>
                <Link href={`/documents/${doc.slug}`}>
                  <a className="flex items-center hover:bg-primary-50 dark:hover:bg-accent-700 p-1 rounded transition-colors">
                    <span className="w-7 h-7 rounded-full bg-accent-100 dark:bg-accent-800 flex-shrink-0 flex items-center justify-center text-accent-700 dark:text-primary-200 mr-2 text-xs">
                      <FileText className="h-4 w-4" />
                    </span>
                    <span className="text-accent-700 dark:text-primary-200 hover:text-accent-900 dark:hover:text-white transition-colors">
                      {doc.name}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Collections Section */}
      {groupedItems.collections.length > 0 && (
        <div>
          <h4 className="font-sans font-semibold text-accent-700 dark:text-primary-200 mb-2 text-sm uppercase tracking-wider">
            Collections
          </h4>
          <ul className="space-y-2">
            {groupedItems.collections.map((collection) => (
              <li key={`collection-${collection.id}`}>
                <Link href={`/collections/${collection.slug}`}>
                  <a className="flex items-center hover:bg-primary-50 dark:hover:bg-accent-700 p-1 rounded transition-colors">
                    <span className="w-7 h-7 rounded-full bg-accent-100 dark:bg-accent-800 flex-shrink-0 flex items-center justify-center text-accent-700 dark:text-primary-200 mr-2 text-xs">
                      <FileText className="h-4 w-4" />
                    </span>
                    <span className="text-accent-700 dark:text-primary-200 hover:text-accent-900 dark:hover:text-white transition-colors">
                      {collection.name}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
