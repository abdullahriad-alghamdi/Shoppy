import { Router } from "express";

import {
  createProduct,
  deleteProductBySlug,
  getAllProducts,
  getProductBySlug,
  updateProductBySlug,
} from "../controllers/productController";

const router: Router = Router();

// Get : /products -> get all products
router.get("/", getAllProducts);

// Get : /products/:slug -> get product by slug
router.get("/:slug", getProductBySlug);

// post : /products -> create new product
router.post("/", createProduct);

// put : /products/:slug -> update product by slug
router.put("/:slug", updateProductBySlug);

// delete : /products/:slug -> delete product by slug
router.delete("/:slug", deleteProductBySlug);

export default router;
