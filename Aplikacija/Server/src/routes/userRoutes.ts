import express from 'express';
import * as usersController from '../controllers/usersController';

const router = express.Router();
router.route('/').patch(usersController.updateUser);
router.route('/:id').get(usersController.getUser);
router.route('/suspend').patch(usersController.suspendUser);
router.route('/unsuspend').patch(usersController.unsuspendUser);
export default router;
