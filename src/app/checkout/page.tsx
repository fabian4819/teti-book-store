'use client';
import Checkout from "../../components/checkout/checkout";
import { useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import useProductById from "@/lib/useProductById";
import { Product } from "@/types/product";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get('bookId') as string | null;
  const productToBePurchased = useProductById(bookId || '');
  const router = useRouter();

  useEffect(() => {
    if (!bookId) {
      router.push('/buyer');
    }

    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_CLIENT;
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey || '');
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [bookId, router]);

  if (!productToBePurchased) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-lg">
        <h1 className="font-bold text-center text-2xl mb-5">Checkout</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col items-center">
            <img
              src={productToBePurchased.photoUrl}
              alt={productToBePurchased.title}
              className="w-40 h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 text-center">
              {productToBePurchased.title}
            </h3>
            <p className="mt-2 text-lg text-gray-700 text-center">
              Rp {productToBePurchased.price}
            </p>
            <p className="mt-4 text-gray-600 text-justify">
              {productToBePurchased.description}
            </p>
            <div className="mt-6 w-full">
              <Checkout product={productToBePurchased} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
