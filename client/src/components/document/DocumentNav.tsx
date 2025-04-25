import { Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface DocumentNavProps {
  prevDoc?: {
    slug: string;
    title: string;
  };
  nextDoc?: {
    slug: string;
    title: string;
  };
}

const DocumentNav = ({ prevDoc, nextDoc }: DocumentNavProps) => {
  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
      {prevDoc ? (
        <Link href={`/documents/${prevDoc.slug}`} className="inline-flex items-center justify-center px-4 py-3 border border-primary-200 dark:border-accent-700 rounded-md text-accent-700 dark:text-primary-200 bg-white dark:bg-accent hover:bg-primary-50 dark:hover:bg-accent-700 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous: {prevDoc.title.length > 40 ? prevDoc.title.slice(0, 40) + '...' : prevDoc.title}
        </Link>
      ) : (
        <div></div> // Empty div to maintain layout
      )}

      {nextDoc && (
        <Link href={`/documents/${nextDoc.slug}`} className="inline-flex items-center justify-center px-4 py-3 border border-primary-200 dark:border-accent-700 rounded-md text-accent-700 dark:text-primary-200 bg-white dark:bg-accent hover:bg-primary-50 dark:hover:bg-accent-700 transition-colors">
          Next: {nextDoc.title.length > 40 ? nextDoc.title.slice(0, 40) + '...' : nextDoc.title}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      )}
    </div>
  );
};

export default DocumentNav;
