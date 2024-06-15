"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EditProductPage() {
  const router = useRouter();
  // const { productId } = router.query;

  // useEffect(() => {
  //   if (!productId) {
  //     return; // Jika productId belum tersedia, maka tidak lakukan apa-apa
  //   }

  //   console.log(`Mengedit produk dengan ID: ${productId}`);
  // }, [productId]);

  return (
    <div>
      <h1>Edit Product</h1>
      {/* Form untuk mengedit produk */}
    </div>
  );
}