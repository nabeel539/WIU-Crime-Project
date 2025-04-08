import express from "express";
import {
  addUser,
  adminLogin,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/adminController.js";
import { adminProtect } from "../middlewares/auth.js";

const router = express.Router();
router.post("/login", adminLogin);
router.post("/users/add", adminProtect, addUser);
router.get("/users/all", adminProtect, getAllUsers);
router.get("/users/:id", adminProtect, getUserById);
router.put("/users/:id", adminProtect, updateUserById);

export default router;
