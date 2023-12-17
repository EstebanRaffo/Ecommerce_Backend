import { Router } from "express";
import { ViewsController } from "../controllers/views.controller.js";
import { authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/", ViewsController.renderHome);
router.get("/realtimeproducts", ViewsController.renderRealTimeProducts);
router.get("/chat", authorize(["usuario"]), ViewsController.renderChat);
router.get("/products", ViewsController.getProducts);
router.get("/signup", ViewsController.renderSignup);
router.get("/login", ViewsController.renderLogin);
router.get("/profile", ViewsController.renderProfile);
router.get("/loggerTest", ViewsController.testLogger);
router.get("/restore-password", ViewsController.renderRestorePassword);
router.post("/send-mail", ViewsController.sendRestorePasswordMail);
router.get("/reset-password-form", ViewsController.renderResetPasswordForm);
router.post("/reset-password", ViewsController.resetPassword);

export {router as viewsRouter};