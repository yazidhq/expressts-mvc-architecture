import { Router } from "express";
import { userController } from "../controllers/user.controller";

const router = Router();

router.post("", userController.create);
router.get("", userController.read);
router.delete("", userController.truncate);

router.get("/:id", userController.readOne);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

export default router;
