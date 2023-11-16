import { Router } from "express";
import { ViewsController } from "../controllers/views.controller.js";

const router = Router();

router.get("/", ViewsController.renderHome);
router.get("/realtimeproducts", ViewsController.renderRealTimeProducts);
router.get("/chat", ViewsController.renderChat);
router.get("/products", ViewsController.getProducts);
router.get("/signup", ViewsController.renderSignup);
router.get("/login", ViewsController.renderLogin);
router.get("/profile", ViewsController.renderProfile);

export {router as viewsRouter};