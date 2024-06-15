"use client"
import SellerNavbar from "@/components/Seller/SellerNavbar";
import { get, onValue, ref } from "firebase/database";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSeller } from "@/context/SellerContext";
import { Product } from "@/types/product";
import { database } from "../../../../../firebaseConfig";
import SellerOrderDashboard from "@/components/Seller/orders/SellerOrderDashboard";
import { Order } from "@/types/orders";

export default function ProductsDashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const {sellerId} = useSeller();

    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        if(sellerId){
            const fetchOrdersData = async () => {
                const ordersData = await fetchOrders(sellerId);
                setOrders(ordersData);
            };
            fetchOrdersData();
        }
    }, [sellerId]); // Add any dependencies here if needed

    const fetchOrders = async (sellerId: string) => {
        const userRef = ref(database, 'user_buyer');
        const userSnapshot = await get(userRef);
        const orders: Order[] = [];
    
        userSnapshot.forEach((userSnapshotChild) => {
            const uid = userSnapshotChild.key;
            const shippingAddress = userSnapshotChild.child('shipping_address').val();
            const username = userSnapshotChild.child('username').val();
    
            const userOrdersRef = ref(database, `user_buyer/${uid}/orders`);
            onValue(userOrdersRef, (ordersSnapshot) => {
                const ordersData = ordersSnapshot.val();
                if (ordersData) {
                    Object.keys(ordersData).forEach((key) => {
                        const order = ordersData[key];
                        if (order.seller_id === sellerId) {
                            const orderData: Order = {
                                orderId: order.order_id,
                                itemId: order.item_id,
                                username: username,
                                sellerId: order.seller_id,
                                buyerId: uid,
                                amount: order.amount,
                                status: order.status,
                                shipping_address: shippingAddress,
                                timestamp: order.timestamp,
                                cost: order.totalCost
                            };
                            orders.push(orderData);
                        }
                    });
                }
            });
        });
    
        return orders;
    };

    const router = useRouter();

    const handleCreateNew = () => {
        router.push('/seller/products/new');
    };

    return (
        <>
            <SellerNavbar />
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center p-10">    
                <SellerOrderDashboard orders={orders}/>
            </div>
        </>
    );
  }