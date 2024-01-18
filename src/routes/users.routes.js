import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import { authorize } from "../middlewares/auth.js";
import { uploadDocuments } from "../utils.js";

const router = Router();

router.put("/premium/:uid", authorize(["admin"]), UsersController.switchRol);

router.post("/:uid/documents", authorize(["user"]), uploadDocuments.fields([
    {name:"identificacion", maxCount:1},
    {name:"domicilio", maxCount:1},
    {name:"estadoDeCuenta", maxCount:1},
]), UsersController.uploadUserFiles);

export {router as usersRouter}