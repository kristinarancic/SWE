import express from 'express';
import * as productsController from '../controllers/productsController';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.route('/paginated').get(productsController.getProductsWithPagination);
router.route('/filter').get(productsController.filterProducts);
router.route('/').post(productsController.createProduct);
router
  .route('/csv')
  .patch(upload.single('file'), productsController.updateProductsFromCSV);
router.route('/').patch(productsController.updateProduct);
router
  .route('/fourRandom/:shopId')
  .get(productsController.getFourRandomProductsPhotos);
// router.route('/').get(productsController.getProducts);
// router.route('/:id').get(productsController.getProductById);
// router.route('/').get(productsController.getProductsByShopId);
// router.route('/shop/:shopId').get(productsController.getProductsByShopId);
// router.route('/random/:numberParam/:shopId').get(productsController.getRandomNumberOfProductsOneShop);
// router.route('/csv/:shopId').post(productsController.importProductsFromCSV);
// router.route('/csv/:shopId').patch(productsController.updateProductsFromCSV);
// router.route('/:id').delete(productsController.deleteProduct);

export default router;
