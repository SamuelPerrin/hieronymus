import React, { useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import Sidebar from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Link from "@/components/ui/link";
import { getAllDocuments, getCollectionById } from "@/lib/contentLoader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { FileText } from "lucide-react";
import { EntityType } from "@/models/schema";
import { formatDate } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

const Documents = () => {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Fetch documents
  const documents = getAllDocuments();
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);
  const paginatedCollections = documents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  document.title = "Documents | Ghost in the Archive";

  // Define breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Documents", href: "/documents", current: true },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar (Desktop only) */}
        {!isMobile && (
          <aside className="lg:w-64 flex-shrink-0">
            <Sidebar entityType={EntityType.document} list={true} />
          </aside>
        )}

        <div className="flex-grow">
          <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700  max-w-2xl">
              <CardHeader>
                <div className="flex flex-col md:flew-row md:items-center gap-4">
                  <CardTitle className="text-2xl font-serif text-accent-900 dark:text-white">
                    Documents
                  </CardTitle>
                </div>
              </CardHeader>
              <CardDescription className="text-accent-700 dark:text-accent-200 text-base">
                <div className="pl-4 leading-relaxed">
                  Explore our transcriptions of archival documents.
                </div>
              </CardDescription>
              <CardContent>
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Authors</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Collection</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCollections.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <Link to={`/documents/${document.slug}`}>
                            <div className="flex flex-row items-center">
                              <div className="bg-blue-100 dark:bg-blue-900 h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0">
                                <FileText className="h-4 w-4 text-blue-800 dark:text-blue-200"></FileText>
                              </div>
                              <span className="ml-2">{document.title}</span>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell>{document.authors?.join(", ") || "-"}</TableCell>
                        <TableCell>{document.date ? formatDate(document.date) : "-"}</TableCell>
                        <TableCell>{getCollectionById(document.collectionId)?.title || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {documents.length > ITEMS_PER_PAGE && <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    />
                    {Array.from({ length: totalPages }, (_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={currentPage === index + 1}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationContent>
                </Pagination>}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Documents;