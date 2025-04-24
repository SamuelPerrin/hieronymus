import * as React from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  className?: string;
  items: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export function Breadcrumb({ className, items }: BreadcrumbProps) {
  return (
    <nav className={cn("text-sm mb-6 text-accent-500 dark:text-primary-200", className)}>
      <ol className="list-none p-0 inline-flex flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-3 h-3 mx-2 text-muted-foreground" />
            )}
            {item.href && !item.current ? (
              <Link href={item.href} className="hover:text-accent-700 dark:hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={item.current ? "text-accent-700 dark:text-white" : ""} aria-current={item.current ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
