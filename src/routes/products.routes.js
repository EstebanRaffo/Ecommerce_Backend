import { Router } from "express";
import { ProductsController } from "../controllers/products.controller.js";
import { authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/", ProductsController.getProducts);
router.get("/mockingproducts", ProductsController.generateProducts);
router.get("/:pid", ProductsController.getProductById);
router.post("/", authorize(["admin"]), ProductsController.createProduct);
router.put("/:pid", authorize(["admin"]), ProductsController.updateProduct);
router.delete("/:pid", authorize(["admin"]), ProductsController.deleteProduct);

export {router as productsRouter};