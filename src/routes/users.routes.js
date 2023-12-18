import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";

const router = Router();

router.get("/premium/:uid", UsersController.switchRol);

export {router as usersRouter}