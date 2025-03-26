import express from 'express';
import * as reviewsController from '../controllers/reviewsController';
const router: express.Router = express.Router();
router.route('/').get(reviewsController.getReviews);
router.route('/report/:id').patch(reviewsController.reportReview);
// router.route('/:id').get(reviewsController.getReviewById);
// router.route('/').post(reviewsController.createReview);
// router.route('/:id').delete(reviewsController.deleteReview);
// router.route('/:id').patch(reviewsController.updateReview);

export default router;
