import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: number): string {
  var ts = new Date(timestamp);
  return ts.toLocaleString()
}

export function formatPrice(price : number | string) {
  // Mengonversi harga ke dalam bentuk number jika dalam bentuk string
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // Menggunakan Intl.NumberFormat untuk memformat harga dalam Rupiah Indonesia
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0  // Tidak ada digit desimal untuk mata uang Rupiah
  }).format(numericPrice);
}