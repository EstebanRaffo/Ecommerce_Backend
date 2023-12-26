import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";
import { authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/", CartsController.getCarts);
router.post("/", CartsController.createCart);
router.get("/:cid", CartsController.getCartById);
router.post("/:cid/products/:pid", authorize(["user","premium"]), CartsController.addProductToCart);
router.delete("/:cid/products/:pid", CartsController.deleteProduct);
router.put("/:cid", CartsController.updateCart);
router.put("/:cid/products/:pid", CartsController.updateProductQuantityInCart);
router.delete("/:cid", CartsController.deleteProductsOfCart);
router.post("/:cid/purchase", CartsController.buyCart);

export {router as cartsRouter};