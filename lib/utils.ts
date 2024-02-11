import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { skip } from "node:test";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numberToString(num: any): string {
  if (num >= 1000000) {
    // Convert to millions, round to nearest thousandths
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    // Convert to thousands, round to nearest hundredths
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    // Return the number as it is if less than 1000
    return num.toString();
  }
}

export function timeAgo(createdAt: Date): string {
  // Get the current date
  const now = new Date();
  // Calculate the difference in milliseconds
  const diff = now.getTime() - createdAt.getTime();

  // Convert the difference to minutes, hours, and days
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Determine the largest unit of time to display
  if (days > 0) {
    return ` ${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "just now";
  }
}

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    { skipNull: true }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keys: string[];
}
export const removeKeysFromQuery = ({ params, keys }: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  for (const key of keys) {
    delete currentUrl[key];
  }

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    { skipNull: true }
  );
};

export const removeSpecialCharacters = (str: string) => {
  return str.replace(/[^a-zA-Z0-9]/g, "");
};
