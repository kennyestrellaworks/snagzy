import express from "express";
import {
  loginController,
  logoutController,
  refreshTokenController,
  signupController,
  getProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/refresh-token", refreshTokenController);
router.get("/profile", protectRoute, getProfile);

export default router;
