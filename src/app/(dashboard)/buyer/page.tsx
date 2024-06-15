"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { database } from "/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

export default function DashboardBuyer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [booksData, setBooksData] = useState<Product[]>([]);

  useEffect(() => {
    const fetchBooksFromFirebase = async () => {
      try {
        const userSellersRef = ref(database, "user_seller");

        const allProducts: Product[] = [];

        onValue(userSellersRef, (snapshot) => {
          snapshot.forEach((userSellerSnapshot) => {
            const productsRef = ref(database, `user_seller/${userSellerSnapshot.key}/products`);

            onValue(productsRef, (productsSnapshot) => {
              productsSnapshot.forEach((productSnapshot) => {
                const productData = productSnapshot.val();
                const product: Product = {
                  product_id: productSnapshot.key,
                  title: productData.title,
                  author: productData.author,
                  description: productData.description,
                  price: productData.price,
                  stock: productData.stock,
                  sold: productData.sold,
                  photoUrl: productData.photoUrl,
                };
                allProducts.push(product);
              });
              setBooksData(allProducts);
            });
          });
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchBooksFromFirebase();
  }, []);

  const filteredBooks = booksData.filter((book) => {
    const title = book.title ? book.title.toLowerCase() : "";
    const author = book.author ? book.author.toLowerCase() : "";
    return title.includes(searchQuery.toLowerCase()) || author.includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    setDropdownVisible(searchQuery.length > 0 && filteredBooks.length > 0);
  }, [searchQuery, filteredBooks]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleBookSelect = (bookTitle: string) => {
    setSearchQuery(bookTitle);
    setDropdownVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-blue-600 text-white p-4 rounded-lg shadow-md mb-6 relative">
        <h1 className="text-3xl font-bold mb-2">TETI Book store</h1>
        <div className="relative">
          <input type="text" placeholder="Search books..." className="w-full p-2 rounded-lg text-black" value={searchQuery} onChange={handleInputChange} />
          {dropdownVisible && (
            <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg z-10">
              {filteredBooks.map((book) => (
                <li key={book.product_id} className="p-2 hover:bg-blue-100 cursor-pointer text-black" onClick={() => handleBookSelect(book.title)}>
                  <Link href={`/beliBuku?bookId=${book.product_id}`}>
                    <strong>{book.title}</strong> - <span>{book.author}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <main className="container mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Book Catalogue</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <li key={book.product_id} className="bg-white shadow-md rounded-lg p-4">
              <Link href={`/checkout?bookId=${book.product_id}`}>
                <div className="flex items-center">
                  <img src={book.photoUrl} alt={book.title} className="w-20 h-20 object-cover mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold">{book.title}</h3>
                    <p className="text-gray-600">{book.author}</p>
                    <p className="text-red-500 font-bold">{formatPrice(book.price)}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          {filteredBooks.length === 0 && <p className="text-gray-500 col-span-full">No books found.</p>}
        </ul>
      </main>
    </div>
  );
}
