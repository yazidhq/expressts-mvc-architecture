import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import AuthenticationMiddleware from "../middleware/authentication";

const router = Router();

router.post("", AuthenticationMiddleware.authenticate, UserController.create);
router.get("", AuthenticationMiddleware.authenticate, UserController.read);
router.delete("", AuthenticationMiddleware.authenticate, UserController.truncate);

router.get("/:id", AuthenticationMiddleware.authenticate, UserController.readOne);
router.put("/:id", AuthenticationMiddleware.authenticate, UserController.update);
router.delete("/:id", AuthenticationMiddleware.authenticate, UserController.delete);

export default router;
