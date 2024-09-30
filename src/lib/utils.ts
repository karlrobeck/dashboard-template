import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const flattenObj = (obj: any) => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && !Array.isArray(value)) {
      const nestedResult = flattenObj(value);
      Object.entries(nestedResult).forEach(([nestedKey, nestedValue]) => {
        result[`${key}.${nestedKey}`] = nestedValue;
      });
    } else {
      result[key] = value;
    }
  }
  return result;
};