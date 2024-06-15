export interface Order {
    orderId: string;
    itemId: string;
    sellerId: string;
    buyerId: string;
    username: string;
    amount: number;
    status: string;
    shipping_address: string;
    timestamp: number;
    cost: number;
}