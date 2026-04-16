import { Router } from "express";
import { login, registerAdmin, registerCustomer } from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/register/customer", registerCustomer);
router.post("/register/admin", registerAdmin);

export default router;
