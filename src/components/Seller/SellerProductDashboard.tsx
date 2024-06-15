"use client"

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";
import { database } from '/firebaseConfig'
import { useSeller } from "@/context/SellerContext";
import { ref, remove } from "firebase/database";
import { useRouter } from "next/navigation";

interface SellerProductDashboardProps {
    products: Product[];
}

const SellerProductDashboard : React.FC<SellerProductDashboardProps> = ({ products })=> {
    const { sellerId } = useSeller();
    const router = useRouter();
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const handleEdit = (id: string) => {
    // TODO: Edit produk
        router.push(`/seller/products/${id}`);
    };

    const handleDelete = (product: Product) => {
        console.log(product.title)
        setProductToDelete(product);
    };
    
      const confirmDelete = () => {
        // console.log("terhapus")
        if (productToDelete) {
          const productRef = ref(database, `user_seller/${sellerId}/products/${productToDelete.product_id}`);
          remove(productRef)
            .then(() => {
              console.log("Product deleted successfully!");
              setProductToDelete(null); // Hapus data produk yang akan dihapus setelah dihapus dari database
            })
            .catch((error) => {
              console.error("Error deleting product: ", error);
            });
        }
      };

    return (
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Gambar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">Judul</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[23%]">Pengarang</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[7%]">Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[17%]">Harga</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[13%]">Aksi</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                      <tr key={product.product_id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <img src={product.photoUrl} alt={product.title} className="w-16 h-25 object-cover"/>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{product.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{product.author}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatPrice(product.price)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                    onClick={() => handleDelete(product)}
                                    className="px-4 py-2 bg-[#F08CAE] text-white rounded-lg hover:bg-[#d77997]"
                                >
                                  Hapus
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>

          {productToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-6 rounded-lg">
                        <p>Apakah Anda yakin ingin menghapus <b>{productToDelete?.title}</b>?</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setProductToDelete(null)}
                                className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
      </div>
    )
}

export default SellerProductDashboard;