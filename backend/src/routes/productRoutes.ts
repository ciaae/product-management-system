import { Router } from 'express';
import {
  createProductController,
  deleteProductController,
  generateTagsController,
  getProductByIdController,
  getProductsController
} from '../controllers/productController.js';
import { requestLogger } from '../middleware/requestLogger.js';
import { validateRequestParams, validateSchema } from '../middleware/validate.js';
import { createProductSchema, productIdSchema } from '../schemas/productSchema.js';

const router = Router();

router.use(requestLogger);

router.post('/', validateSchema(createProductSchema), createProductController);
router.get('/', getProductsController);
router.get('/:id', validateRequestParams(productIdSchema), getProductByIdController);
router.delete('/:id', validateRequestParams(productIdSchema), deleteProductController);
router.post('/:id/generate-tags', validateRequestParams(productIdSchema), generateTagsController);

export default router;
