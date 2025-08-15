import express from "express";
import verifyToken from "../middlewares/verify.js";
import {
  fetchUsers,
  fetchUserById,
  fetchBlockedUsers,
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
  verifyUserToken,
  resetPassword,
  blockUser,
  unblockUser,
  resendOtp
} from "../controllers/UserControllers.js";

const userRoutes = express.Router();


userRoutes.get("/", verifyToken, fetchUsers);
userRoutes.get("/:id", verifyToken, fetchUserById);
userRoutes.get("/blocked-users", verifyToken, fetchBlockedUsers);
userRoutes.post("/register", registerUser);
userRoutes.post("/verify-user", verifyUser);
userRoutes.post("/resend-otp", resendOtp);
userRoutes.post("/login", loginUser);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/verify-user-token", verifyUserToken);
userRoutes.post("/reset-password", resetPassword);
userRoutes.post("/block-user/:id", blockUser);
userRoutes.post("/unblock-user/:id", unblockUser);

export default userRoutes;