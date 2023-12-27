import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";
import { authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/", CartsController.getCarts);
router.post("/", authorize(["user","premium"]), CartsController.createCart);
router.get("/:cid", CartsController.getCartById);
router.post("/:cid/products/:pid", authorize(["user","premium"]), CartsController.addProductToCart);
router.delete("/:cid/products/:pid", authorize(["user","premium"]), CartsController.deleteProduct);
router.put("/:cid", authorize(["user","premium"]), CartsController.updateCart);
router.put("/:cid/products/:pid", authorize(["user","premium"]), CartsController.updateProductQuantityInCart);
router.delete("/:cid", authorize(["user","premium"]), CartsController.deleteProductsOfCart);
router.post("/:cid/purchase", authorize(["user","premium"]), CartsController.buyCart);

export {router as cartsRouter};