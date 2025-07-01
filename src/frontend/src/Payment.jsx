

import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Payment = () => {
  const { productId } = useParams();
  const [amount, setAmount] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:7000/api/v1/payment/createorder",
        {
          productId,
          amount: Number(amount),
          receipt: `receipt_${Date.now()}`,
        },
        {
          withCredentials: true,
        }
      );

      if (!data.success) {
        alert(data.message);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "My Marketplace",
        description: "Payment",
        order_id: data.order.id,
        handler: async (response) => {
          await axios.post(
            "http://localhost:7000/api/v1/payment/verifypayment",
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              productId,
            },
            { withCredentials: true }
          );
          alert("Payment successful!");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Make a Payment</h2>
      <form onSubmit={handlePayment}>
        <label>Amount (₹):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;
