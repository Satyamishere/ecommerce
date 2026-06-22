import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payments",
      required: true,
    },

    status: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },

    deliveredAt: {
      type: Date,
    },

    shippingAddress: {
      type: String,
    },

    trackingId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("orders", orderSchema);