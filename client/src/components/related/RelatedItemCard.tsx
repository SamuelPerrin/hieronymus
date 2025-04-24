import { Link } from "wouter";
import { User, MapPin, Calendar, FileText, FileArchive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RelatedItem } from "@shared/schema";

interface RelatedItemCardProps {
  item: RelatedItem;
}

const RelatedItemCard = ({ item }: RelatedItemCardProps) => {
  const getTypeInfo = (type: string) => {
    switch (type) {
      case "person":
        return {
          icon: <User className="h-4 w-4" />,
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          label: "Person"
        };
      case "place":
        return {
          icon: <MapPin className="h-4 w-4" />,
          color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
          label: "Place"
        };
      case "event":
        return {
          icon: <Calendar className="h-4 w-4" />,
          color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          label: "Event"
        };
      case "collection":
        return {
          icon: <FileArchive className="h-4 w-4" />,
          color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
          label: "Collection"
        };
      case "document":
      default:
        return {
          icon: <FileText className="h-4 w-4" />,
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          label: "Document"
        };
    }
  };

  const { icon, color, label } = getTypeInfo(item.type);

  const getLink = () => {
    switch (item.type) {
      case "person":
        return `/people/${item.slug}`;
      case "place":
        return `/places/${item.slug}`;
      case "event":
        return `/events/${item.slug}`;
      case "collection":
        return `/collections/${item.slug}`;
      case "document":
      default:
        return `/documents/${item.slug}`;
    }
  };

  return (
    <div className="flex-shrink-0 w-64 bg-white dark:bg-accent rounded-lg shadow-sm border border-primary-100 dark:border-accent-700 overflow-hidden">
      <div className="p-4">
        <Badge variant="outline" className={`${color} border-none mb-2`}>
          {label}
        </Badge>
        <h4 className="font-serif font-bold text-accent-900 dark:text-white">
          <Link href={getLink()}>
            <a className="hover:text-highlight transition-colors">
              {item.name}
            </a>
          </Link>
        </h4>
        {item.date && (
          <p className="text-sm text-accent-700 dark:text-primary-300 mt-1">{item.date}</p>
        )}
        {item.description && (
          <p className="text-sm text-accent-600 dark:text-primary-400 mt-2 line-clamp-3">
            {item.description.replace(/[#*_~`]/g, '')}
          </p>
        )}
      </div>
    </div>
  );
};

export default RelatedItemCard;
