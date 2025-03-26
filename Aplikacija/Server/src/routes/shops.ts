import express from 'express';
import * as shopsController from '../controllers/shopsController';

const router = express.Router();

router.route('/paginated').get(shopsController.getShopsWithPagination);
router.route('/').patch(shopsController.updateShop);
router.route('/description').patch(shopsController.updateShopDescription);
router.route('/suspend').patch(shopsController.suspendShop);
router.route('/unsuspend').patch(shopsController.unsuspendShop);
router.route('/filter').get(shopsController.filterShops);
// router.route('/').get(shopsController.getShops);
// router.route('/specific/:specific/:id').get(shopsController.getShopSpecificInfo);
// router.route('/sixrandom').get(shopsController.getSixRandomShops);
// router.route('/one/:id').get(shopsController.getShopById);
// router.route('/:id').delete(shopsController.deleteShop);
// router.route('/name/:id').get(shopsController.getShopName);
// router.route('/photo/:id').get(shopsController.getShopPhoto);
// router.route('/description/:id').get(shopsController.getShopDescription);

export default router;
