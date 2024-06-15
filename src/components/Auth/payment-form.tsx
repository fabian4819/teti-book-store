'use client';

import { useState } from 'react';

export default function PaymentForm() {
    const [orderId, setOrderId] = useState('');
    const [amount, setAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');

    const handlePayment = async () => {
        const response = await fetch('/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_id: orderId,
                gross_amount: amount,
                payment_method: paymentMethod,
            }),
        });

        const data = await response.json();
        console.log(data);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-1/3">
                <h2 className="text-2xl font-bold mb-6">Payment</h2>
                <input
                    type="text"
                    placeholder="Order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                />
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                >
                    <option value="">Select Payment Method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                </select>
                <button
                    onClick={handlePayment}
                    className="bg-blue-500 text-white p-2 rounded w-full"
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
}
