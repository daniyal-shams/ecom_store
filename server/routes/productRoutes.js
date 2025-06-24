import express from "express";
import { createProducts, getAllProducts , getProduct , updateProduct, deleteProduct } from "../controllers/productController.js";

const  router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct)


export default router ;