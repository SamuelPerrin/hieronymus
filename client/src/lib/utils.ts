import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const parts = dateString.split('-').map(Number);
  const [year, month, day] = parts;

  const options: Intl.DateTimeFormatOptions = { 
    year: "numeric",
    timeZone: "UTC" // Ensures output is always UTC
  };

  if (!isNaN(month)) {
    options.month = "long";
  }
  if (!isNaN(day)) {
    options.day = "numeric";
  }

  // Construct date in UTC, with fallback values (only display them if present)
  const date = new Date(Date.UTC(year, isNaN(month) ? 0 : month - 1, isNaN(day) ? 1 : day));

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}