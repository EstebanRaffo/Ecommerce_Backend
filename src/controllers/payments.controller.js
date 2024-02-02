import { CartsService } from "../services/carts.service.js";
import { config } from "../config/config.js";
import stripePackage from 'stripe';

export class PaymentsController{

    static renderCheckout(req, res){
        res.render('checkout', { stripePublicKey: config.stripe.publicKey });
    }

    static async createPayment(req, res){
        try {
            const { token } = req.body; 
            const cid = req.user.cart.valueOf();
            const cart = await CartsService.getCartById(cid);
            const { products } = cart;
            const purchase_amount = products.reduce((sum, product) => sum + (product.quantity * product._id.price), 0);
            
            const stripe = stripePackage(config.stripe.secretKey);
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
    }
}