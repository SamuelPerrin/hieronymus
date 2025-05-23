import { Calendar, Download, Share, Printer, FileText, UserPen, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Document } from "@/models/schema";
import { prepareJSX } from "@/lib/markdownUtils";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getPersonSlugByName } from "@/lib/contentLoader";
import Link from "@/components/ui/link";

interface DocumentViewerProps {
  document: Document;
}

const DocumentViewer = ({ document }: DocumentViewerProps) => {
  const { toast } = useToast();
  
  // Handle actions
  const handleDownload = () => {
    toast({
      title: "Download initiated",
      description: "Your PDF is being prepared for download."
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: "Check out this historical document!",
        url: window.location.href,
      }).catch(err => {
        console.error("Error sharing", err);
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link copied",
          description: "Document link copied to clipboard."
        });
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <article className="bg-white dark:bg-accent rounded-lg shadow-sm p-6 lg:p-8 border border-primary-100 dark:border-accent-700 max-w-2xl">
      {/* Document Header */}
      <header className="mb-4 border-b border-primary-100 dark:border-accent-700 pb-2">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 h-16 w-16 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="h-8 w-8 text-blue-800 dark:text-blue-200" />
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-accent-900 dark:text-white mb-4">
            {document.title}
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 mb-4">
          {document.authors && document.authors.length > 0 && (
            <div className="text-accent-700 dark:text-primary-200 flex items-center space-x-2">
              <UserPen className="h-4 w-4" />
              {document.authors.map((author, index) => (
                <span key={index} className="hover:underline">
                  <Link to={`/people/${getPersonSlugByName(author)}`}>{author}</Link>
                  {index < document.authors!.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}

          {document.recipients && document.recipients.length > 0 && (
            <div className="text-accent-700 dark:text-primary-200 flex items-center space-x-2">
              <MailOpen className="h-4 w-4" />
              {document.recipients.map((recipient, index) => (
                <span key={index} className="hover:underline">
                  <Link to={`/people/${getPersonSlugByName(recipient)}`}>{recipient}</Link>
                  {index < document.recipients!.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}

          {document.date && (
            <div className="text-accent-700 dark:text-primary-200 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(document.date)}</span>
            </div>
          )}

          {document.type && (
            <div className="text-accent-700 dark:text-primary-200">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-none">
                {document.type.toString().charAt(0).toUpperCase() + document.type.toString().slice(1).replace('_', ' ')}
              </Badge>
            </div>
          )}

          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap items-center sm:justify-end gap-2">
              {document.type && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-none">
                  {document.type.toString().charAt(0).toUpperCase() + document.type.toString().slice(1).replace('_', ' ')}
                </Badge>
              )}
              {document.tags.map((tag, index) => {
                // Alternate badge colors
                const colors = [
                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                  "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                  "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
                  "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                ];
                return (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`${colors[index % colors.length]} border-none`}
                  >
                    {tag}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Document Content */}
      <div 
        className="font-sans text-accent-900 dark:text-accent-200 leading-relaxed markdown-content max-w-prose" 
      >
        {typeof document.content === 'string'
          ? prepareJSX(document.content)
          : <p className="text-red-500">Error: Document content could not be displayed</p>
        }
      </div>
      {/* Document Footer */}
      <footer className="mt-10 pt-6 border-t border-primary-100 dark:border-accent-700">
        {/* Source Information */}
        {(document.source || document.location || document.archiveReference || document.transcribedBy) && (
          <div className="bg-primary-50 dark:bg-accent-700 p-4 rounded-md border border-primary-100 dark:border-accent-600 mb-4">
            <div className="font-sans text-sm dark:text-accent-200">
              {document.source && (
                <div className="mb-1">
                  <strong>Source:</strong> {document.source}
                </div>
              )}
              {document.location && (
                <div className="mb-1">
                  <strong>Location:</strong> {document.location}
                </div>
              )}
              {document.archiveReference && (
                <div>
                  <strong>Archive Reference:</strong> {document.archiveReference}
                </div>
              )}
              {document.transcribedBy && (
                <div>
                  <strong>Transcribed by:</strong> {document.transcribedBy}
                </div>
              )}
              {document.transcriptionDate && (
                <div>
                  <strong>Transcription Date:</strong> {formatDate(document.transcriptionDate.toString())}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="text-sm text-accent-700 dark:text-primary-300">
            {document.lastUpdated && (
              <p>Last updated: {formatDate(document.lastUpdated.toString())}</p>
            )}
          </div>

          <div className="flex space-x-2">
            {/* <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-accent-700 dark:text-primary-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button> */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-accent-700 dark:text-primary-200"
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-accent-700 dark:text-primary-200"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </footer>
    </article>
  );
};

export default DocumentViewer;
