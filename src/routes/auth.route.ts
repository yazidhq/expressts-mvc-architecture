import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/signUp", AuthController.signUp);
router.post("/signIn", AuthController.signIn);

export default router;
