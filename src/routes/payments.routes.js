import { Router } from "express";
import { authorize } from "../middlewares/auth.js";
import { PaymentsController } from "../controllers/payments.controller.js";

const router = Router();

router.get('/checkout', authorize(["user","premium"]), PaymentsController.renderCheckout);
router.post('/payment', authorize(["user","premium"]), PaymentsController.createPayment);
  
export { router as paymentsRouter}