import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useMediaQuery } from "@/hooks/use-mobile";
import { getAllPeople } from "@/lib/contentLoader";
import { EntityType } from "@/models/schema";
import Sidebar from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/DataTable";
import Link from "@/components/ui/link";
import { formatDate } from "@/lib/utils";
import { User } from "lucide-react";

interface DataTablePerson {
  id: number;
  slug: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
}

const People = () => {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Fetch people
  const people: DataTablePerson[] = getAllPeople();

  // Define columns with custom rendering and sorting
  const columns: {
    key: keyof DataTablePerson;
    label: string;
    sortable?: boolean;
    render?: (row: DataTablePerson) => React.ReactNode;
    sortValue?: (row: DataTablePerson) => any
  }[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (person) => (
        <Link to={`/people/${person.slug}`}>
          <div className="flex flex-row items-center">
            <div className="bg-red-100 dark:bg-red-900 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-red-800 dark:text-red-200" />
            </div>
            <span className="ml-2">{person.name}</span>
          </div>
        </Link>
      ),
      sortValue: (person) => person.name,
    },
    {
      key: "birthDate",
      label: "Birth Date",
      sortable: true,
      render: (person) => (person.birthDate ? formatDate(person.birthDate) : "-"),
      sortValue: (person) => person.birthDate || "", // Use raw date for sorting
    },
    {
      key: "deathDate",
      label: "Death Date",
      sortable: true,
      render: (person) => (person.deathDate ? formatDate(person.deathDate) : "-"),
      sortValue: (person) => person.deathDate || "", // Use raw date for sorting
    },
  ];

  document.title = "People | Ghost in the Archive";

  // Define breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "People", href: "/people", current: true },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar (Desktop) */}
        {!isMobile && (
          <aside className="lg:w-64 flex-shrink-0">
            <Sidebar entityType={EntityType.person} list={true} />
          </aside>
        )}
        <div className="flex-grow">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
          <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-serif text-accent-900 dark:text-white">
                    People
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardDescription className="text-accent-700 dark:text-primary-200 text-base">
              <div className="pl-4 leading-relaxed">
                Explore people mentioned in our transcribed archival documents.
              </div>
            </CardDescription>
            <CardContent>
              <DataTable<DataTablePerson>
                data={people}
                columns={columns}
                itemsPerPage={10}
                searchKey="name"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default People;