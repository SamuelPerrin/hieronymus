import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useMediaQuery } from "@/hooks/use-mobile";
import { getAllEvents } from "@/lib/contentLoader";
import { EntityType } from "@/models/schema";
import Sidebar from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/DataTable";
import Link from "@/components/ui/link";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DataTableEvent {
  id: number;
  slug: string;
  name: string;
  startDate?: string;
  endDate?: string;
}

const Events = () => {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Fetch events
  const events: DataTableEvent[] = getAllEvents();

  // Define columns with custom rendering
  const columns: {
    key: keyof DataTableEvent;
    label: string;
    sortable?: boolean;
    render?: (row: DataTableEvent) => React.ReactNode;
    sortValue?: (row: DataTableEvent) => any;
  }[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (event) => (
        <Link to={`/events/${event.slug}`}>
          <div className="flex flex-row items-center">
            <div className="bg-green-100 dark:bg-green-900 h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4 text-green-800 dark:text-green-200" />
            </div>
            <span className="ml-2">{event.name}</span>
          </div>
        </Link>
      ),
      sortValue: (event) => event.name,
    },
    {
      key: "startDate",
      label: "Start Date",
      sortable: true,
      render: (event) => (event.startDate ? formatDate(event.startDate) : "-"),
      sortValue: (event) => event.startDate || "",
    },
    {
      key: "endDate",
      label: "End Date",
      sortable: true,
      render: (event) => (event.endDate ? formatDate(event.endDate) : "-"),
      sortValue: (event) => event.endDate || "",
    },
  ];

  document.title = "Events | Ghost in the Archive";

  // Define breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events", current: true },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar (Desktop) */}
        {!isMobile && (
          <aside className="lg:w-64 flex-shrink-0">
            <Sidebar entityType={EntityType.event} list={true} />
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
                    Events
                  </CardTitle>
                </div>
              </CardHeader>
              <CardDescription className="text-accent-700 dark:text-accent-200 text-base">
                <div className="pl-4 leading-relaxed">
                  Explore events mentioned in our transcribed archival documents.
                </div>
              </CardDescription>
              <CardContent>
                <DataTable<DataTableEvent>
                  data={events}
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

export default Events;