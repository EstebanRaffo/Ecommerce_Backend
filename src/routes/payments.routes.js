import { Router } from "express";
import { PaymentsService } from "../services/payments.service.js";
import { CartsService } from "../services/carts.service.js";
import { config } from "../config/config.js";
import stripePackage from 'stripe';

const stripe = stripePackage(config.stripe.secretKey);

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

router.get('/checkout', (req, res) => {
    res.render('checkout', { stripePublicKey: config.stripe.publicKey });
});

router.post('/payment', async (req, res) => {
    try {
        const { token, amount } = req.body;
        
        console.log(req.user)
        const cid = req.user.cart.valueOf();
        console.log(cid)
        const cart = await CartsService.getCartById(cid);
        const {products} = cart;
        const purchase_amount = products.reduce((sum, product) => sum + (product.quantity * product._id.price), 0);
        console.log(token)
        const charge = await stripe.charges.create({
            "amount": purchase_amount.toString(),
            "currency": 'ars',
            "source": token
        });
        res.json({status:"success", payload:charge});
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});
  
export { router as paymentsRouter}