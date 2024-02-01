import { Router } from "express";
import { PaymentsService } from "../services/payments.service.js";
import { CartsService } from "../services/carts.service.js";

const router = Router();

router.post("/payment-intents", async(req,res)=>{
    try {
        console.log(req.user)
        const cid = req.user.cart.valueOf();
        console.log(cid)
        const cart = await CartsService.getCartById(cid);
        const {products} = cart;
        const purchase_amount = products.reduce((sum, product) => sum + (product.quantity * product._id.price), 0);
        const paymentInfo = {
            amount:purchase_amount,
            currency: "ars"
        };
        const service = new PaymentsService();
        const resultPaymentIntent = await service.createPaymentIntent(paymentInfo);
        res.json({status:"success", payload:resultPaymentIntent});
    } catch (error) {
        return res.status(400).json({status:"error", error:error.message});
    }
});

export { router as paymentsRouter}