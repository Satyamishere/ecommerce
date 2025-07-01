import { Router } from "express";
import { searchForProduct } from "../controllers/userfunction.js";
import { createOrder,verifyPayment } from "../controllers/paymenthandle.js";
import { getSalesOverTime } from "../controllers/adminfunction.js";
const router=Router()


router.route("/createorder").post(createOrder); // 
router.route("/verifypayment").post(verifyPayment);
router.route("/getsales").get(getSalesOverTime);
export default router