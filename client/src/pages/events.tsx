import React, { useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useMediaQuery } from "@/hooks/use-mobile";
import { getAllEvents } from "@/lib/contentLoader";
import { EntityType } from "@/models/schema";
import Sidebar from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { formatDate } from "@/lib/utils";
import Link from "@/components/ui/link";
import { Calendar } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const Events = () => {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  
  // Fetch events
  const events = getAllEvents();
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const paginatedEvents = events.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
          ></motion.div>
          <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
            <CardHeader>
              <div className="flex flex-col md:flew-row md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-serif text-accent-900 dark:text-white">
                    Event
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardDescription className="text-accent-700 dark:text-accent-200 text-base">
              <div className="pl-4 leading-relaxed">
                Explore events mentioned in our transcribed archival documents.
              </div>
            </CardDescription>
            <CardContent>
              <Table className="border">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Link to={`/events/${event.slug}`}>
                          <div className="flex flex-row items-center">
                            <div className="bg-green-100 dark:bg-green-900 h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0">
                              <Calendar className="h-4 w-4 text-green-800 dark:text-green-200"></Calendar>
                            </div>
                            <span className="ml-2">{event.name}</span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {event.startDate ? formatDate(event.startDate.toString()) : "N/A"}
                      </TableCell>
                      <TableCell>
                        {event.endDate ? formatDate(event.endDate.toString()) : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {events.length > ITEMS_PER_PAGE && <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1} // Pass disabled prop
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
                    disabled={currentPage === totalPages} // Pass disabled prop
                  />
                </PaginationContent>
              </Pagination>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Events;