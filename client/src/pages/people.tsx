import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useMediaQuery } from "@/hooks/use-mobile";
import { getAllPeople } from "@/lib/contentLoader";
import { EntityType } from "@shared/schema";
import Sidebar from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Link } from "wouter";
import { User } from "lucide-react";

const People = () => {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Fetch people
  let isLoadingPeople = true;
  const people = getAllPeople();
  isLoadingPeople = false;

  document.title = "People | Ghost in the Archive";

  // Define breadcrumb items
  const breadcrumbItems : BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "People", href: "/people", current: true }
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
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 0.3 }}
          ></motion.div>
          <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
            <CardHeader>
              <div className="flex flex-col md:flew-row md:items-center gap-4">
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
              <Table className="border">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Birth Date</TableHead>
                    <TableHead>Death Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {people.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>
                        <Link to={`/people/${person.slug}`}>
                          <div className="flex flex-row items-center">
                            <div className="bg-red-100 dark:bg-red-900 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-red-800 dark:text-red-200"></User>
                            </div>
                            <span className="ml-2">
                              {person.name}
                            </span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {person.birthDate ? formatDate(person.birthDate) : "N/A"}
                      </TableCell>
                      <TableCell>
                        {person.deathDate ? formatDate(person.deathDate) : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default People;