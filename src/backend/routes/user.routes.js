import { Router } from "express";
import {
  createUser,
  loginUser,
  uploadProduct,
  searchForProduct,
  createChat,
  getSellerChats,
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


export default router;
