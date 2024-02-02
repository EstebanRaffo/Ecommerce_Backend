import { Router } from "express";
import stripePackage from 'stripe';
import { authorize } from "../middlewares/auth.js";
import { PaymentsController } from "../controllers/payments.controller.js";
import { config } from "../config/config.js";

const stripe = stripePackage(config.stripe.secretKey);

const router = Router();

router.get('/checkout', authorize(["user","premium"]), PaymentsController.renderCheckout);
router.post('/payment', authorize(["user","premium"]), PaymentsController.createPayment);
  
export { router as paymentsRouter}