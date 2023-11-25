import { Router } from "express";
import { DeleteOrderById, GetSingleOrder, PostOrderController, UpdatedOrderById, getAllOrderController } from "../controllers/OrderController";

const router = Router();
// GET : /order -> returned all order
router.get("/", getAllOrderController);
// POST : /order -> returned new order
router.post("/", PostOrderController);
// GET : /odrer/:slug -> returned single order
router.get("/:id", GetSingleOrder);
// PUT : /order/:id -> returned updated order
router.put("/:id", UpdatedOrderById);
// DELETE : /order/:slug -> returned updated order
router.delete("/:id", DeleteOrderById);

export default router;
