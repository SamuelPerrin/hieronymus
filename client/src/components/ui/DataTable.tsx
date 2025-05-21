import React, { useState, useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode; // Custom rendering logic
  sortValue?: (row: T) => any; // Custom sorting logic
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  itemsPerPage?: number;
  searchKey?: keyof T; // Key to search by
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  itemsPerPage = 10,
  searchKey,
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle sorting
  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchKey && searchQuery) {
      filtered = filtered.filter((item) =>
        item[searchKey]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = columns.find((col) => col.key === sortKey)?.sortValue
          ? columns.find((col) => col.key === sortKey)!.sortValue!(a)
          : a[sortKey];
        const bValue = columns.find((col) => col.key === sortKey)?.sortValue
          ? columns.find((col) => col.key === sortKey)!.sortValue!(b)
          : b[sortKey];

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchKey, searchQuery, sortKey, sortOrder]);

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Search */}
      {searchKey && (
        <div className="mb-4">
          <form className="relative">
            <div className="flex">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-primary-200 dark:border-accent-700 rounded-l-md focus:ring-2 focus:ring-highlight focus:border-highlight transition-colors"
              />
              <Button
                type="submit"
                className="rounded-l-none bg-primary ml-2 hover:bg-primary/80"
                onClick={(e) => e.preventDefault()} // Prevent form submission since it's not needed here
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key as string}
                onClick={() => column.sortable && handleSort(column.key)}
                className={column.sortable ? "cursor-pointer" : ""}
              >
                {column.label}
                {column.sortable && sortKey === column.key && (
                  <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.key as string}>
                  {column.render ? column.render(row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {filteredData.length > itemsPerPage && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default DataTable;