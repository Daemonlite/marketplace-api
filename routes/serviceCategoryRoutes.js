import express from "express";
import verifyToken from "../middlewares/verify.js";

import {fetchServiceCategories, fetchServiceCategoryById,createServiceCategory, updateServiceCategory, deleteServiceCategory} from "../controllers/serviceCategoryController.js"

const serviceCategoryRoutes = express.Router();


serviceCategoryRoutes.get("/", verifyToken, fetchServiceCategories);
serviceCategoryRoutes.get("/:id", verifyToken, fetchServiceCategoryById);
serviceCategoryRoutes.post("/", verifyToken, createServiceCategory);
serviceCategoryRoutes.put("/:id", verifyToken, updateServiceCategory);
serviceCategoryRoutes.delete("/:id", verifyToken, deleteServiceCategory);

export default serviceCategoryRoutes