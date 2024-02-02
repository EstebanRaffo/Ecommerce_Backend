import { Router } from "express";
import { CartsService } from "../services/carts.service.js";
import { config } from "../config/config.js";
import stripePackage from 'stripe';

const stripe = stripePackage(config.stripe.secretKey);

const router = Router();

router.get('/checkout', (req, res) => {
    res.render('checkout', { stripePublicKey: config.stripe.publicKey });
});

router.post('/payment', async (req, res) => {
    try {
        const { token } = req.body; 
        const cid = req.user.cart.valueOf();
        const cart = await CartsService.getCartById(cid);
        const { products } = cart;
        const purchase_amount = products.reduce((sum, product) => sum + (product.quantity * product._id.price), 0);
      
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