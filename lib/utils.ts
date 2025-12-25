import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const numPrice = Number(price);
  if (numPrice <= 0) {
    return "قیمت در انتظار تعیین";
  }

  // Convert from Rials to Toman (divide by 10) and format with commas
  const tomanPrice = numPrice;
  return `${tomanPrice.toLocaleString("fa-IR")} تومان`;
}
