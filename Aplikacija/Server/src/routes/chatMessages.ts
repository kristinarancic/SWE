import express from "express";
import * as chatsController from "../controllers/chatsController";
const router = express.Router();
router.route('/').get(chatsController.getChats);
router.route('/').post(chatsController.sendMessage);

export default router;