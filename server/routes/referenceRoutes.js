import { Router } from "express";
import { getProviders, getServices, health } from "../controllers/referenceController.js";

const router = Router();

router.get("/health", health);
router.get("/services", getServices);
router.get("/providers", getProviders);

export default router;
