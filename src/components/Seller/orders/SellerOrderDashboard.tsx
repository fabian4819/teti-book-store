"use client"

import { useEffect, useState } from "react";
import { formatPrice, formatTimestamp } from "@/lib/utils";
import { database } from '/firebaseConfig'
import { useSeller } from "@/context/SellerContext";
import { get, onValue, ref, remove, update } from "firebase/database";
import { Order } from "@/types/orders";

interface SellerOrderDashboardProps {
    orders: Order[];
}

const SellerOrderDashboard : React.FC<SellerOrderDashboardProps> = ({ orders })=> {
    const { sellerId } = useSeller();

    const ProductTitleCell = ({itemId}) => {
        const [productTitle, setProductTitle] = useState('');
    
        useEffect(() => {
            const getProductTitle = async () => {
                if (sellerId && itemId) {
                    const title = await fetchProductTitle(sellerId, itemId);
                    setProductTitle(title || 'Unknown Product');
                }
            };
    
            getProductTitle();
        }, [sellerId, itemId]);
    
        return (
            <td className="px-6 py-4 whitespace-nowrap">
                {productTitle}
            </td>
        );
    };

    const fetchProductTitle = async (sellerId: string | null, productKey: string): Promise<string | null> => {
        try {
            // Reference to the user_seller node
            const userSellerRef = ref(database, 'user_seller');
            const userSellerSnapshot = await get(userSellerRef);
    
            let productTitle: string | null = null;
    
            userSellerSnapshot.forEach((sellerSnapshot) => {
                const sellerData = sellerSnapshot.val();
                if (sellerData && sellerSnapshot.key === sellerId) {
                    const productsRef = ref(database, `user_seller/${sellerId}/products/${productKey}`);
                    get(productsRef).then((productSnapshot) => {
                        if (productSnapshot.exists()) {
                            productTitle = productSnapshot.val().title;
                        }
                    });
                    // Exit the loop early once we find the matching seller
                    return true;
                }
            });

            console.log("Found product" + productTitle)
    
            return productTitle;
        } catch (error) {
            console.error("Error fetching product title:", error);
            return null;
        }
    };
    
    const handleStatusChange = async (status: string, orderId: string) => {
        // at ref(database, `users_buyer`), for each child, find
        const userRef = ref(database, 'user_buyer');
        const userSnapshot = await get(userRef);
    
        userSnapshot.forEach((userSnapshotChild) => {
            const uid = userSnapshotChild.key;
            const userOrdersRef = ref(database, `user_buyer/${uid}/orders`);
            onValue(userOrdersRef, (ordersSnapshot) => {
                const ordersData = ordersSnapshot.val();
                if (ordersData) {
                    Object.keys(ordersData).forEach((key) => {
                        const order = ordersData[key];
                        if (order.order_id === orderId) {
                            const orderRef = ref(database, `user_buyer/${uid}/orders/${key}`);
                            update(orderRef, { status: status })
                            .then(() => {
                                console.log(`Order ${orderId} status updated to ${status}`);
                            })
                            .catch((error) => {
                                console.error(`Failed to update status: ${error}`);
                            });
                            }
                    });
                }
            });
        });
    };

    return (
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Tanggal Pesanan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">Alamat Tujuan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[14%]">Pembeli</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[7%]">Jumlah</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[17%]">Harga</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">Status</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((orders) => (
                      <tr key={orders.orderId}>
                          <td className="px-6 py-4 whitespace-nowrap">{formatTimestamp(orders.timestamp)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{orders.shipping_address}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{orders.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{orders.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatPrice(orders.cost)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select 
                                className={`
                                    rounded-md 
                                    px-2 
                                    py-1 
                                    text-sm 
                                    ${orders.status === 'received' ? 'bg-yellow-500' : ''} 
                                    ${orders.status === 'processed' ? 'bg-blue-500' : ''} 
                                    ${orders.status === 'shipped' ? 'bg-green-200' : ''} 
                                    ${orders.status === 'completed' ? 'bg-gray-200' : ''} 
                                `}
                                value={orders.status}
                                onChange={(e) => handleStatusChange(e.target.value, orders.orderId)}
                            >
                                <option value="received" className="bg-yellow-500">New Order</option>
                                <option value="processed" className="bg-blue-500">Processed</option>
                                <option value="shipped" className="bg-green-200">Shipped</option>
                                <option value="completed" className="bg-gray-200">Completed</option>
                            </select>
                            </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    )
}

export default SellerOrderDashboard;