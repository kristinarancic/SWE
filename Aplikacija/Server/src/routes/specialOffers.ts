import express from 'express';
import * as specOffersController from '../controllers/specOffersController';

const router = express.Router();

router.route('/').get(specOffersController.getSpecialOffers);
router.route('/:id').get(specOffersController.getSpecialOfferById);
router.route('/shop/:shopId').get(specOffersController.getSpecialOfferByShopId);
router.route('/user/:userId').get(specOffersController.getSpecialOfferByUserId);
router.route('/').post(specOffersController.createSpecialOffer);
router.route('/:id').patch(specOffersController.updateSpecialOffer);
router.route('/confirm/:id').patch(specOffersController.confirmSpecialOffer);
router.route('/:id').delete(specOffersController.deleteSpecialOffer);

export default router;