import { Router } from "express";
import { getConversations, sendMessage } from "../controllers/chatController.js";

const router = Router();

router.get("/", getConversations);
router.post("/messages", sendMessage);

export default router;
