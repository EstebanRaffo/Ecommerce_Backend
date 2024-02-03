import { Router } from "express";
import { ProductsController } from "../controllers/products.controller.js";
import { authorize } from "../middlewares/auth.js";
import { uploadImgProducts } from "../utils.js";

const router = Router();

router.get("/", ProductsController.getProducts);
router.get("/mockingproducts", ProductsController.generateProducts);
router.post("/", authorize(["admin","premium"]), uploadImgProducts.array('thumbnails', 4), ProductsController.createProduct);
router.get("/:pid", ProductsController.getProductById);
router.put("/:pid", authorize(["admin","premium"]), ProductsController.updateProduct);
router.delete("/:pid", authorize(["admin","premium"]), ProductsController.deleteProduct);

export {router as productsRouter};