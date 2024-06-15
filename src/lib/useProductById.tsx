import { useState, useEffect } from 'react';
import { database } from '/firebaseConfig';
import { Product } from '@/types/product';
import { onValue, ref } from 'firebase/database';

const useProductById = (product_id: string): Product | null => {
    const [product, setProduct] = useState<Product | null>(null);
  
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const userSellersRef = ref(database, 'user_seller');
  
          onValue(userSellersRef, (snapshot) => {
            snapshot.forEach((userSellerSnapshot) => {
              const productsRef = ref(database, `user_seller/${userSellerSnapshot.key}/products`);
  
              onValue(productsRef, (productsSnapshot) => {
                productsSnapshot.forEach((productSnapshot) => {
                  const productData : Product = productSnapshot.val();
                  if (productData.product_id === product_id) {
                    // Mapping data produk
                    const product: Product = {
                        product_id: productData.product_id,
                        title: productData.title,
                        author: productData.author,
                        description: productData.description,
                        price: productData.price,
                        stock: productData.stock,
                        sold: productData.sold,
                        photoUrl: productData.photoUrl,
                    };
                    setProduct(product);
                  }
                });
              });
            });
          });
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
  
      fetchProduct();
    }, [product_id]);
  
    return product;
  };
  
  export default useProductById;