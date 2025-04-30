import Link from "@/components/ui/link";
import { RelatedItem, EntityType, EntityTypeSlug, EntityTypeMap } from "@/models/schema";
import { User, MapPin, Calendar, FileText, Archive } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getRelatedItemsForSlug } from "@/lib/contentLoader";
import { capitalize } from "@/lib/utils";

interface SidebarProps {
  entityType: EntityType;
  slug?: string;
  list?: boolean;
}

interface GroupedItems {
    people: RelatedItem[];
    places: RelatedItem[];
    events: RelatedItem[];
    documents: RelatedItem[];
    collections: RelatedItem[];
}

const Sidebar = ({ entityType, slug, list }: SidebarProps) => {
  const relatedItems: RelatedItem[] = [];
  let groupedItems: GroupedItems | null = null;
  let listsToTease: (string | EntityType)[] = [];
  let isLoading = true;

  if (slug) {
    relatedItems.push(...getRelatedItemsForSlug(slug, entityType));
    isLoading = false;
  
    groupedItems = relatedItems
      ? {
          people: relatedItems.filter((item) => item.type === EntityType.person),
          places: relatedItems.filter((item) => item.type === EntityType.place),
          events: relatedItems.filter((item) => item.type === EntityType.event),
          documents: relatedItems.filter((item) => item.type === EntityType.document),
          collections: relatedItems.filter((item) => item.type === EntityType.collection),
        }
      : null;
  } else if (list) {
    // Get an array of other List pages to tease in the Sidebar, excluding the current page
    listsToTease = Object.values(EntityType)
      .filter(val => val !== entityType)
      .map(val => EntityType[val]);
    isLoading = false;
  }

  const getIcon = (type: EntityType) => {
    switch (type) {
      case EntityType.person:
        return (
          <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
            <User className="h-4 w-4" />
          </div>);
      case EntityType.place:
        return (
          <div className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
            <MapPin className="h-4 w-4" />
          </div>);
      case EntityType.event:
        return (
          <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
            <Calendar className="h-4 w-4" />
          </div>);
      case EntityType.collection:
        return (
          <div className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
            <Archive className="h-4 w-4" />
          </div>);
      case EntityType.document:
        return (
          <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
            <FileText className="h-4 w-4" />
          </div>);
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

  if (list && !slug) {
    return (
      <div className="sticky top-24 bg-white dark:bg-accent rounded-lg shadow-sm p-5 border border-primary-100 dark:border-accent-700">
        <h3 className="font-serif text-lg font-bold mb-4 text-accent-900 dark:text-white border-b border-primary-100 dark:border-accent-700 pb-2">
          Related Content
        </h3>
        <div className="mb-6">
          <ul className="space-y-2">
            {listsToTease.map((page, index) => 
              (<li key={index} className="">
                <Link to={`/${EntityTypeMap[page as EntityType]}`}  className="flex items-center hover:bg-primary-50 dark:hover:bg-accent-700 p-1 rounded transition-colors">
                  {getIcon(page as EntityType)}
                  <span className="text-accent-700 dark:text-primary-200 hover:text-accent-900 dark:hover:text-white transition-colors">
                    {capitalize(EntityTypeMap[page as EntityType])}
                  </span>
                </Link>
              </li>)
            )}
          </ul>
        </div>
      </div>
    )
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
                <Link href={`/people/${person.slug}`} className="flex items-center hover:bg-primary-50 dark:hover:bg-accent-700 p-1 rounded transition-colors">
                  {getIcon(EntityType.person)}
                  <span className="text-accent-700 dark:text-primary-200 hover:text-accent-900 dark:hover:text-white transition-colors">
                    {person.name}
                  </span>
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
                <Link href={`/places/${place.slug}`} className="flex items-center hover:bg-primary-50 dark:hover:bg-accent-700 p-1 rounded transition-colors">
                  {getIcon(EntityType.place)}
                  <span className="text-accent-700 dark:text-primary-200 hover:text-accent-900 dark:hover:text-white transition-colors">
                    {place.name}
                  </span>
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
                <Link href={`/events/${event.slug}`} className="flex items-center hover:bg-primary-50 dark:hover:bg-accent-700 p-1 rounded transition-colors">
                  {getIcon(EntityType.event)}
                  <span className="text-accent-700 dark:text-primary-200 hover:text-accent-900 dark:hover:text-white transition-colors">
                    {event.name}
                  </span>
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
            Documents
          </h4>
          <ul className="space-y-2">
            {groupedItems.documents.map((doc) => (
              <li key={`doc-${doc.id}`}>
                <Link href={`/documents/${doc.slug}`} className="flex items-center hover:bg-primary-50 dark:hover:bg-accent-700 p-1 rounded transition-colors">
                  {getIcon(EntityType.document)}
                  <span className="text-accent-700 dark:text-primary-200 hover:text-accent-900 dark:hover:text-white transition-colors">
                    {doc.name}
                  </span>
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
                <Link href={`/collections/${collection.slug}`} className="flex items-center hover:bg-primary-50 dark:hover:bg-accent-700 p-1 rounded transition-colors">
                  {getIcon(EntityType.collection)}
                  <span className="text-accent-700 dark:text-primary-200 hover:text-accent-900 dark:hover:text-white transition-colors">
                    {collection.name}
                  </span>
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
