// ✅ BACKEND: paymenthandle.js

import Razorpay from "razorpay";
import { Product } from "../models/product.js";
import { Payment } from "../models/payment.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

console.log("Razorpay KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, productId } = req.body;

    if (!productId || !amount) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Product ID and amount are required",
        });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const productPriceInPaise = product.price * 100;

    if (amount * 100 !== productPriceInPaise) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment amount. Expected: ₹${product.price}`,
        expectedAmount: product.price,
        providedAmount: amount,
      });
    }

    const order = await razorpay.orders.create({
      amount: productPriceInPaise,
      currency,
      receipt,
      payment_capture: 1,
    });

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Order creation failed:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Order creation failed",
        error: error.message,
      });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      amount,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, error: "Payment verification failed" });
    }

    const payment = await Payment.create({
      user: req.user._id,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount,
      product: productId,
      status: "paid",
      paidAt: new Date(), 
    });

    await Product.findByIdAndUpdate(productId, { status: "paid" });

    return res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export { createOrder, verifyPayment };
