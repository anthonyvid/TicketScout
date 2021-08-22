import * as adminController from "../controllers/adminController.js";
import { ensureAuthenticated, checkNotAuthenticated } from "../config/auth.js";
import express from "express";
const router = express.Router();

// Admin Register Page
router.get("/register", checkNotAuthenticated, adminController.renderRegister);
// Admin Register handle
router.post("/register", adminController.register);

// router.post("/invite-employee", adminController.inviteEmployee);

export default router;
