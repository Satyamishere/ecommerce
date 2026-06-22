import { Router } from "express";
import {
  createUser,
  loginUser,
  uploadProduct,
  searchForProduct,
  createChat,
  getSellerChats,
  getCurrentUser,
  addReview,
  getPurchasesProducts,
  getSellingProducts,
  totalProdcutSold,
  getViewProducts,
  updateProductReview
} from "../controllers/userfunction.js";

import { verifyJWT } from "../middleware/verifytoken.js";

const router = Router();

// Auth
router.route("/register").post(createUser);
router.route("/login").post(loginUser);

// Product
router.route("/sell").post(verifyJWT, uploadProduct);
router.route("/searchproduct").post(verifyJWT, searchForProduct);

// Chat
router.route("/createchat").post(verifyJWT, createChat);
router.route("/seller/:sellerId").get(verifyJWT, getSellerChats);
router.route("/currentuser").get(verifyJWT, getCurrentUser);

//
router.route("/getviewproduct").get(verifyJWT, getViewProducts);
//router.route("/updateviewedproduct").get(verifyJWT, updateViewedProduct);
router.route("/getpurchasesproducts").get(verifyJWT, getPurchasesProducts);
router.route("/getsellingproducts").get(verifyJWT, getSellingProducts);
router.route("/gettotalproductssold").get(verifyJWT, totalProdcutSold);
router.route("/updateProductReview").get(verifyJWT, updateProductReview);






export default router;
