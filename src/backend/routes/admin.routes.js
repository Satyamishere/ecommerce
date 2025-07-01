import { Router } from "express";
import {
  getAdminDashboardStats,
  getSalesByCategory,
  getSalesByProduct,
  getRecentOrders,
  getSalesOverTime,
} from "../controllers/adminfunction.js";

import { verifyJWT } from "../middleware/verifytoken.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();



// All below routes need authenticated admin access
router.route("/dashboard-stats").get(verifyJWT, isAdmin, getAdminDashboardStats);
router.route("/sales-category").get(verifyJWT, isAdmin, getSalesByCategory);
router.route("/sales-product").get(verifyJWT, isAdmin, getSalesByProduct);
router.route("/recent-orders").get(verifyJWT, isAdmin, getRecentOrders);
router.route("/sales-over-time").get(verifyJWT, isAdmin, getSalesOverTime);

export default router;
