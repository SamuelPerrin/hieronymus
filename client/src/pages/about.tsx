import { useEffect } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ghost, BookOpen, FileText, Code } from "lucide-react";
import Link from "@/components/ui/link";
import { motion } from "framer-motion";

const AboutPage = () => {
  useEffect(() => {
    document.title = "About | Ghost in the Archive";
  }, []);

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About", current: true },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-serif font-bold text-accent-900 dark:text-white mb-6">
            About Ghost in the Archive
          </h1>

          <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 mb-8">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Ghost className="h-10 w-10 text-primary" />
                </div>
              </div>
              <p className="text-accent-700 dark:text-accent-200 mb-4">
                Ghost in the Archive is a scholarly repository dedicated to making historical primary sources accessible to researchers, educators, students, and history enthusiasts. Our mission is to provide transcriptions of unique archival documents and to present them in full historical context.
              </p>
              <p className="text-accent-700 dark:text-accent-200">
                Through this digital archive, we aim to preserve historical knowledge, facilitate research, and deepen understanding of the past by creating a network of relationships between historical documents and the people, places, and events they reference.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-5 w-5 text-primary mr-2" />
                    <CardTitle className="text-xl font-serif">
                      Our Methodology
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-accent-700 dark:text-accent-200 mb-4">
                    Each document in our collection is carefully transcribed according to the following process:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-accent-700 dark:text-accent-200">
                    <li>Digital images of each document are obtained from reputable archives.</li>
                    <li>Each document is transcribed by hand with attention to original formatting.</li>
                    <li>The text is reviewed and corrected as necessary.</li>
                    <li>The transcript is enhanced with links to pages with more information on the people, places, and events referenced in the original.</li>
                    <li>More documents and context will be added as new sources become available.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 mb-8">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Code className="h-5 w-5 text-primary mr-2" />
                    <CardTitle className="text-xl font-serif">
                      Technical Details
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-accent-700 dark:text-accent-200 mb-4">
                    Ghost in the Archive is built using modern web technologies to ensure accessibility, performance, and sustainability:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-accent-700 dark:text-accent-200">
                    <li>React and TypeScript for a reliable and maintainable application</li>
                    <li>Markdown rendering for consistent document formatting</li>
                    <li>Responsive design for access on all devices</li>
                    <li>Semantic HTML for accessibility</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 text-primary mr-2" />
                  <CardTitle className="text-xl font-serif">
                    How to Cite
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-accent-700 dark:text-accent-200 mb-4">
                  We include information about the archival location of each source document below the transcription, where it is labeled "Archive Reference." Further information about the location of each collection can be found on each collection's page. Information about the transcriber can also be found on each document's page.
                </p>
                <p className="text-accent-700 dark:text-accent-200 mb-4">
                  When citing materials from our archive in your research or publications, consider including the following information:
                </p>
                <ul className="text-accent-700 dark:text-accent-200 mb-4 list-disc pl-5">
                  <li>Author name</li>
                  <li>Document title</li>
                  <li>Document date</li>
                  <li>Document's location in collection (box and/or file identifier)</li>
                  <li>Collection title</li>
                  <li>Archive name and location</li>
                  <li>Transcriber's name</li>
                  <li>Digital source name</li>
                  <li>Access date</li>
                  <li>URL of the document</li>
                </ul>
                <p className="text-accent-700 dark:text-accent-200 mt-4">
                  For example, to cite <Link to="/documents/a-spirit-of-purpose">A Spirit of Purpose</Link>, you might use the following citation:
                </p>
                <div className="bg-primary-50 dark:bg-accent-700 p-4 rounded text-sm font-mono text-accent-900 dark:text-accent-200">
                  William S. Banowsky, "A Spirit of Purpose," 20 Apr. 1975, Box 1, Pepperdine University Speeches Collection, Pepperdine University Special Collections and University Archives (Malibu, CA), transcribed by Sam Perrin, <i>Ghost in the Archive</i>, accessed [Access Date], https://ghostinthearchive.com/documents/a-spirit-of-purpose.
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
