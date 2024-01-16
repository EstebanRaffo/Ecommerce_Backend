import { Router } from "express";
import { ViewsController } from "../controllers/views.controller.js";
import { authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/", ViewsController.renderHome);
router.get("/realtimeproducts", ViewsController.renderRealTimeProducts);
router.get("/chat", authorize(["user"]), ViewsController.renderChat);
router.get("/products", ViewsController.getProducts);
router.get("/signup", ViewsController.renderSignup);
router.get("/login", ViewsController.renderLogin);
router.get("/profile", ViewsController.renderProfile);
router.get("/loggerTest", ViewsController.testLogger);
router.get("/forgot-password", ViewsController.renderForgotPassword);
router.get("/reset-password-form", ViewsController.renderResetPassword);
router.get("/documents", ViewsController.renderDocumentsForm);

export {router as viewsRouter};