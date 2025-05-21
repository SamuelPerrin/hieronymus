import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useMediaQuery } from "@/hooks/use-mobile";
import { getAllCollections } from "@/lib/contentLoader";
import { EntityType } from "@/models/schema";
import Sidebar from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/DataTable";
import Link from "@/components/ui/link";
import { Archive } from "lucide-react";

interface DataTableCollection {
  id: number;
  slug: string;
  title: string;
  description?: string;
}

const Collections = () => {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Fetch collections
  const collections: DataTableCollection[] = getAllCollections();

  // Define columns with custom rendering
  const columns: {
    key: keyof DataTableCollection;
    label: string;
    sortable?: boolean;
    render?: (row: DataTableCollection) => React.ReactNode;
    sortValue?: (row: DataTableCollection) => any;
  }[] = [
    {
      key: "title",
      label: "Name",
      sortable: true,
      render: (collection) => (
        <Link to={`/collections/${collection.slug}`}>
          <div className="flex flex-row items-center">
            <div className="bg-orange-100 dark:bg-orange-900 h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0">
              <Archive className="h-4 w-4 text-orange-800 dark:text-orange-200" />
            </div>
            <span className="ml-2">{collection.title}</span>
          </div>
        </Link>
      ),
      sortValue: (collection) => collection.title,
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
      render: (collection) => collection.description || "-",
    },
  ];

  document.title = "Collections | Ghost in the Archive";

  // Define breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections", current: true },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar (Desktop) */}
        {!isMobile && (
          <aside className="lg:w-64 flex-shrink-0">
            <Sidebar entityType={EntityType.collection} list={true} />
          </aside>
        )}
        <div className="flex-grow">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <CardTitle className="text-2xl font-serif text-accent-900 dark:text-white">
                    Collections
                  </CardTitle>
                </div>
              </CardHeader>
              <CardDescription className="text-accent-700 dark:text-accent-200 text-base">
                <div className="pl-4 leading-relaxed">
                  Explore our collections of transcribed archival documents.
                </div>
              </CardDescription>
              <CardContent>
                <DataTable<DataTableCollection>
                  data={collections}
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

export default Collections;