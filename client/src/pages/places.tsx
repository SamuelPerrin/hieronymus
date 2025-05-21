import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useMediaQuery } from "@/hooks/use-mobile";
import { getAllPlaces } from "@/lib/contentLoader";
import { EntityType } from "@/models/schema";
import Sidebar from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/DataTable";
import Link from "@/components/ui/link";
import { MapPin } from "lucide-react";

interface DataTablePlace {
  id: number;
  slug: string;
  name: string;
  city?: string;
  region?: string;
  country?: string;
  location?: string;
}

const Places = () => {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Fetch places
  const places: DataTablePlace[] = getAllPlaces();

  // Define columns with custom rendering
  const columns: {
    key: keyof DataTablePlace;
    label: string;
    sortable?: boolean;
    render?: (row: DataTablePlace) => React.ReactNode;
    sortValue?: (row: DataTablePlace) => any;
  }[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (place) => (
        <Link to={`/places/${place.slug}`}>
          <div className="flex flex-row items-center">
            <div className="bg-purple-100 dark:bg-purple-900 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="h-4 w-4 text-purple-800 dark:text-purple-200" />
            </div>
            <span className="ml-2">{place.name}</span>
          </div>
        </Link>
      ),
      sortValue: (place) => place.name,
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      render: (place) =>
        `${place.city || "-"}${place.region ? `, ${place.region}` : ""}${
          place.country ? `, ${place.country}` : ""
        }`,
      sortValue: (place) =>
        `${place.city || ""}${place.region ? `, ${place.region}` : ""}${
          place.country ? `, ${place.country}` : ""
        }`,
    },
  ];

  document.title = "Places | Ghost in the Archive";

  // Define breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Places", href: "/places", current: true },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar (Desktop) */}
        {!isMobile && (
          <aside className="lg:w-64 flex-shrink-0">
            <Sidebar entityType={EntityType.place} list={true} />
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
                    Places
                  </CardTitle>
                </div>
              </CardHeader>
              <CardDescription className="text-accent-700 dark:text-primary-200 text-base">
                <div className="pl-4 leading-relaxed">
                  Explore places mentioned in our transcribed archival documents.
                </div>
              </CardDescription>
              <CardContent>
                <DataTable<DataTablePlace>
                  data={places}
                  columns={columns}
                  itemsPerPage={10}
                  searchKey="name"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Places;