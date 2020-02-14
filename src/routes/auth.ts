import { Router } from "express";
import AuthController from "../controller/AuthController";
import checkJwt from "../middlewars/checkJwt";

const router = Router();
//Login route
router.post("/login", AuthController.login);

//register route
router.post("/register", AuthController.register);
//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;