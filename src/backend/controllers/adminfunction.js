import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User} from "../models/user.js";
import {Payment} from "../models/payment.js"


dotenv.config();

const createAdmin = async () => {
  try {
    // First check if admin exists by username/email
    const existingAdmin = await User.findOne({
      $or: [{ username: "adminuser" }, { email: "admin@example.com" }],
    });

    if (existingAdmin) {
      // If exists but missing admin role, add it
      if (!existingAdmin.role.includes("admin")) {
        existingAdmin.role.push("admin");
        await existingAdmin.save();
        console.log("Added admin role to existing user");
      }
      return;
    }

    // Only create new admin if doesn't exist
    const admin = await User.create({
      fullName: "Admin",
      email: "admin@example.com",
      username: "adminuser",
      password: "supersecureadmin123", // plain text; will be hashed automatically
      role: ["admin"],
    });

    console.log("Admin created successfully");
  } catch (err) {
    console.error("Admin creation error:", err.message);
  }
};

const getAdminDashboardStats = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $match: { status: "paid" },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          uniqueProducts: { $addToSet: "$product" },
          uniqueBuyers: { $addToSet: "$user" },
        },
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalRevenue: 1,
          totalUniqueProducts: { $size: "$uniqueProducts" },
          totalUniqueBuyers: { $size: "$uniqueBuyers" },
        },
      },
    ]);

    return res.status(200).json({
      message: "Dashboard stats fetched",
      data: result[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        totalUniqueProducts: 0,
        totalUniqueBuyers: 0,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch dashboard data", error: err.message });
  }
};

const getSalesByCategory = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      // 1. Match only successful payments
      { $match: { status: "paid" } },

      // 2. Join with products
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },

      // 3. Group by category ID
      {
        $group: {
          _id: "$productDetails.category",
          totalRevenue: { $sum: "$amount" },
          orderCount: { $sum: 1 },
        },
      },

      // 4. Lookup category details
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },

      // 5. Final formatting
      {
        $project: {
          _id: 0,
          categoryName: "$categoryDetails.name",
          totalRevenue: 1,
          orderCount: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Sales by category fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch sales by category",
      error: error.message,
    });
  }
};

const getSalesByProduct = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      // Only consider successful payments
      { $match: { status: "paid" } },

      // Lookup product details
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },

      // Group by product ID
      {
        $group: {
          _id: "$productDetails._id",
          productTitle: { $first: "$productDetails.title" },
          productPrice: { $first: "$productDetails.price" },
          productImage: { $first: "$productDetails.image" },
          timesSold: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
        },
      },

      // Optional: sort by most sold
      { $sort: { timesSold: -1 } },
    ]);

    return res.status(200).json({
      message: "Sales by product fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch product sales data",
      error: error.message,
    });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Payment.aggregate([
      {
        $match: { status: "paid" }, // only successful payments
      },
      {
        $sort: { createdAt: -1 }, // sort by most recent
      },
      {
        $limit: 10, // number of doucment given
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          orderId: "$orderId",
          buyerName: "$userDetails.fullName",
          productTitle: "$productDetails.title",
          amount: 1,
          status: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Recent orders fetched",
      data: recentOrders,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching recent orders",
      error: err.message,
    });
  }
};

const getSalesOverTime = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      { $match: { status: "paid" } },
      {
        $project: {
          week: { $isoWeek: "$paidAt" },
          year: { $isoWeekYear: "$paidAt" },
          amount: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", week: "$week" },
          totalSales: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 },
      },
    ]);

    res.status(200).json({ data: result });
  } catch (err) {
    console.error(" Aggregation failed:", err);
    res.status(500).json({ error: err.message });
  }
};



export {
  getAdminDashboardStats,
  getSalesByCategory,
  getSalesByProduct,
  getRecentOrders,
  createAdmin,
  getSalesOverTime,
};
