import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import { authorize } from "../middlewares/auth.js";


const router = Router();

router.put("/premium/:uid", authorize(["admin"]), UsersController.switchRol);

export {router as usersRouter}