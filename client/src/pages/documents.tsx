import React, { useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import Sidebar from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/DataTable";
import Link from "@/components/ui/link";
import { getAllDocuments, getCollectionById } from "@/lib/contentLoader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { FileText } from "lucide-react";
import { EntityType } from "@/models/schema";
import { formatDate } from "@/lib/utils";

interface DataTableDocument {
  id: number;
  slug: string;
  title: string;
  authors?: string[];
  date?: string;
  collectionId?: number;
}

const Documents = () => {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Fetch documents
  const documents = getAllDocuments();

  // Define columns with custom rendering
  const columns: {
      key: keyof DataTableDocument;
      label: string;
      sortable?: boolean;
      render?: (row: DataTableDocument) => React.ReactNode;
      sortValue?: (row: DataTableDocument) => any
    }[] =[
    {
      key: "title",
      label: "Name",
      sortable: true,
      render: (document: any) => (
        <Link to={`/documents/${document.slug}`}>
          <div className="flex flex-row items-center">
            <div className="bg-blue-100 dark:bg-blue-900 h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4 text-blue-800 dark:text-blue-200" />
            </div>
            <span className="ml-2">{document.title}</span>
          </div>
        </Link>
      ),
      sortValue: (document: any) => document.title,
    },
    {
      key: "authors",
      label: "Authors",
      sortable: true,
      render: (document: any) => document.authors?.join(", ") || "-",
      sortValue: (document: any) => document.authors?.join(", ") || "",
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (document: any) => (document.date ? formatDate(document.date) : "-"),
      sortValue: (document: any) => document.date || "",
    },
    {
      key: "collectionId",
      label: "Collection",
      sortable: true,
      render: (document: any) =>
        getCollectionById(document.collectionId)?.title || "-",
      sortValue: (document: any) =>
        getCollectionById(document.collectionId)?.title || "",
    },
  ];

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 max-w-2xl">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
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
                <DataTable
                  data={documents}
                  columns={columns}
                  itemsPerPage={10}
                  searchKey="title"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Documents;