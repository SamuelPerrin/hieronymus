import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useMediaQuery } from "@/hooks/use-mobile";
import { getAllPlaces } from "@/lib/contentLoader";
import React, { useState } from "react";
import { EntityType } from "@shared/schema";
import Sidebar from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Link } from "wouter";
import { MapPin } from "lucide-react";


const ITEMS_PER_PAGE = 10;

const Places = () => {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Fetch places
  const places = getAllPlaces();
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(places.length / ITEMS_PER_PAGE);
  const paginatedPlaces = places.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  document.title = "Places | Ghost in the Archive";

  // Define breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Places", href: "/places", current: true }
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
          ></motion.div>
          <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
            <CardHeader>
              <div className="flex flex-col md:flew-row md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-serif text-accent-900 dark:text-white">
                    Places
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardDescription className="text-accent-700 dark:text-primary-200 text-base">
              <div className="pl-4 leading-relaxed">
                Explore places mentioned in our transcribed archival documents.
              </div>
            </CardDescription>
            <CardContent>
              <Table className="border">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPlaces.map((place) => (
                    <TableRow key={place.id}>
                      <TableCell>
                        <Link to={`/places/${place.slug}`}>
                          <div className="flex flex-row items-center">
                            <div className="bg-purple-100 dark:bg-purple-900 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                              <MapPin className="h-4 w-4 text-purple-800 dark:text-purple-200"></MapPin>
                            </div>
                            <span className="ml-2">{place.name}</span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {place.city || "N/A"}{place.region && `, ${place.region}`}{place.country && `, ${place.country}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {places.length > ITEMS_PER_PAGE && <Pagination className="mt-4">
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

export default Places;