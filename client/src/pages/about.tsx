import { useEffect } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ghost, BookOpen, FileText, Code } from "lucide-react";
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
              <p className="text-accent-700 dark:text-primary-200 mb-4">
                Ghost in the Archive is a scholarly repository dedicated to making historical primary sources accessible to researchers, educators, students, and history enthusiasts. Our mission is to provide transcribed historical documents with rich context and interconnections.
              </p>
              <p className="text-accent-700 dark:text-primary-200">
                Through this digital archive, we aim to preserve historical knowledge, facilitate research, and deepen understanding of the past by creating a network of relationships between historical documents, people, places, and events.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                <p className="text-accent-700 dark:text-primary-200 mb-4">
                  Each document in our collection undergoes a rigorous transcription process:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-accent-700 dark:text-primary-200">
                  <li>Source verification from reputable archives</li>
                  <li>Careful transcription with attention to original formatting</li>
                  <li>Expert review by historians and scholars</li>
                  <li>Contextual research to identify related entities</li>
                  <li>Regular updates as new information becomes available</li>
                </ol>
              </CardContent>
            </Card>

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
                <p className="text-accent-700 dark:text-primary-200 mb-4">
                  When referencing materials from our archive in your research or publications, please use the following citation format:
                </p>
                <div className="bg-primary-50 dark:bg-accent-700 p-4 rounded text-sm font-mono text-accent-900 dark:text-primary-200">
                  "Document Title," Ghost in the Archive, accessed [Access Date], [URL].
                </div>
                <p className="text-accent-700 dark:text-primary-200 mt-4">
                  For example: "Letter from Alexander Hamilton to George Washington," Ghost in the Archive, accessed May 15, 2023, https://archivalhistories.org/documents/hamilton-to-washington-1781.
                </p>
              </CardContent>
            </Card>
          </div>

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
              <p className="text-accent-700 dark:text-primary-200 mb-4">
                Ghost in the Archive is built using modern web technologies to ensure accessibility, performance, and sustainability:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-accent-700 dark:text-primary-200">
                <li>React and TypeScript for a reliable and maintainable application</li>
                <li>Markdown rendering for consistent document formatting</li>
                <li>Responsive design for access on all devices</li>
                <li>Semantic HTML for accessibility</li>
                <li>Progressive enhancement for broader device support</li>
              </ul>
              <p className="text-accent-700 dark:text-primary-200 mt-4">
                Our content database is regularly backed up and maintained with archival-quality standards to ensure long-term preservation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
            <CardHeader>
              <CardTitle className="text-xl font-serif">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-accent-700 dark:text-primary-200 mb-4">
                We welcome feedback, collaboration opportunities, and questions about our archive.
              </p>
              <div className="space-y-2 text-accent-700 dark:text-primary-200">
                <p><strong>Email:</strong> contact@archivalhistories.org</p>
                <p><strong>Twitter:</strong> @ArchivalHistories</p>
                <p><strong>Address:</strong> Department of Historical Research, 123 Academic Way, Scholarly City, 45678</p>
              </div>
              <p className="text-accent-700 dark:text-primary-200 mt-4">
                If you would like to contribute to our archive or report an error in our transcriptions, please contact our editorial team at editor@archivalhistories.org.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
