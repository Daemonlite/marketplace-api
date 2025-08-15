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
} from "../controllers/UserControllers.js";

const ruserRoutes = express.Router();


ruserRoutes.get("/", verifyToken, fetchUsers);
ruserRoutes.get("/:id", verifyToken, fetchUserById);
ruserRoutes.get("/blocked-users", verifyToken, fetchBlockedUsers);
ruserRoutes.post("/register", registerUser);
ruserRoutes.post("/verify", verifyUser);
ruserRoutes.post("/login", loginUser);
ruserRoutes.post("/forgot-password", forgotPassword);
ruserRoutes.post("/verify-user-token", verifyUserToken);
ruserRoutes.post("/reset-password", resetPassword);
ruserRoutes.post("/block-user/:id", blockUser);
ruserRoutes.post("/unblock-user/:id", unblockUser);

export default ruserRoutes;