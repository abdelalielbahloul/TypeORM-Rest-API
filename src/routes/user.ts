import { Router } from "express";
import UserController from "../controller/UserController";
import checkJwt  from "../middlewars/checkJwt";
import checkRole from "../middlewars/checkRole";

const router = Router();

//Get all users
router.get("/", [checkJwt, checkRole(["ADMIN", "EDITOR"])], UserController.index);

// Get one user
router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  UserController.show
);

//Create a new user
router.post("/", [checkJwt, checkRole(["ADMIN"])], UserController.create);

//Edit one user
router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  UserController.edit
);

//Delete one user
router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  UserController.delete
);

export default router;