import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import { authorize } from "../middlewares/auth.js";
import { uploader } from "../utils.js";

const router = Router();

router.put("/premium/:uid", authorize(["admin"]), UsersController.switchRol);
// router.post("/:uid/documents", uploader.fields([{ name: 'avatar', maxCount: 1 }, { name: 'documents', maxCount: 5 }]), UsersController.uploadFiles);
router.post("/:uid/documents", uploader.single("avatar"), UsersController.uploadFiles);

export {router as usersRouter}