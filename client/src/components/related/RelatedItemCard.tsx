import { Link } from "wouter";
import { User, MapPin, Calendar, FileText, Archive } from "lucide-react";
import { EntityType, RelatedItem } from "@/models/schema";

interface RelatedItemCardProps {
  item: RelatedItem;
}

const RelatedItemCard = ({ item }: RelatedItemCardProps) => {
  const getTypeInfo = (type: EntityType) => {
    switch (type) {
      case EntityType.person:
        return (
          <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 h-8 w-8 rounded-full flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>);
      case EntityType.place:
        return (
          <div className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 h-8 w-8 rounded-full flex items-center justify-center">
            <MapPin className="h-4 w-4" />
          </div>);
      case EntityType.event:
        return (
          <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 h-8 w-8 rounded-full flex items-center justify-center">
            <Calendar className="h-4 w-4" />
          </div>);
      case EntityType.collection:
        return (
          <div className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 h-8 w-8 rounded-full flex items-center justify-center">
            <Archive className="h-4 w-4" />
          </div>);
      case EntityType.document:
      default:
        return (
          <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 h-8 w-8 rounded-full flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>);
    }
  };

  const icon = getTypeInfo(item.type);

  const getLink = () => {
    switch (item.type) {
      case EntityType.person:
        return `/people/${item.slug}`;
      case EntityType.place:
        return `/places/${item.slug}`;
      case EntityType.event:
        return `/events/${item.slug}`;
      case EntityType.collection:
        return `/collections/${item.slug}`;
      case EntityType.document:
      default:
        return `/documents/${item.slug}`;
    }
  };

  return (
    <div className="flex-shrink-0 w-64 bg-white dark:bg-accent rounded-lg shadow-sm border border-primary-100 dark:border-accent-700 overflow-hidden">
      <div className="p-4 flex flex-row md:flex-row md:items-center gap-4">
        <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <h4 className="font-serif font-bold text-accent-900 dark:text-white">
          <Link href={getLink()} className="hover:text-highlight transition-colors">
            {item.name}
          </Link>
        </h4>
      </div>
      <div className="p-4">
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
