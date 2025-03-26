import express from "express";
import * as notificationsController from '../controllers/notificationsController';

const router = express.Router();

router.route('/').get(notificationsController.getNotifications);
router.route('/unread').get(notificationsController.getNotificationsUnread);
router.route('/all').get(notificationsController.getNotificationsAll);

export default router;