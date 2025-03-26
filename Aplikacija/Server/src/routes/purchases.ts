import express from 'express';
import * as purchasesController from '../controllers/purchasesController';

const router = express.Router();

router.route('/cart').get(purchasesController.getUncomfirmedPurchaseByUserId);
router.route('/add').patch(purchasesController.addProductsToPurchase);
router.route('/decrease').patch(purchasesController.removeProductsFromPurchase);
router
  .route('/remove')
  .patch(purchasesController.removeProductsAllFromPurchase);
router.route('/').post(purchasesController.createPurchase);
router.route('/:id').delete(purchasesController.deletePurchase);
router.route('/confirm/:id').patch(purchasesController.confirmPurchase);
// router.route('/').get(purchasesController.getPurchases);
// router.route('/:id').get(purchasesController.getPurchaseById);
// router.route('/past/:userId').get(purchasesController.getPurchasesByUserId);
// router.route('/onepurchase/:id').get(purchasesController.getAllProductsOnePurchase);
// router.route('/:id').patch(purchasesController.updatePurchase);
// router.route('/add/:id/:productId/:quantity').patch(purchasesController.addProductsToPurchaseQuantity);

export default router;
