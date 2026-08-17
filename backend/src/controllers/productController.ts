import type { NextFunction, Request, Response } from 'express';
import {
  createProduct,
  deleteProduct,
  generateProductTags,
  getAllProducts,
  getProductById
} from '../services/productService.js';

export async function createProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function getProductsController(_req: Request, res: Response, next: NextFunction) {
  try {
    const products = await getAllProducts();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
}

export async function getProductByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await getProductById(productId);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductController(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await deleteProduct(productId);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function generateTagsController(req: Request, res: Response, next: NextFunction) {
  try {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await generateProductTags(productId);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}
