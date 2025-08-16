import express from "express";
import verifyToken from "../middlewares/verify.js";
import upload from "../middlewares/multer.js";
import {fetchServiceCategories, fetchServiceCategoryById,createServiceCategory, updateServiceCategory, deleteServiceCategory} from "../controllers/serviceCategoryController.js"

const serviceCategoryRoutes = express.Router();


serviceCategoryRoutes.get("/", verifyToken, fetchServiceCategories);
serviceCategoryRoutes.get("/:id", verifyToken, fetchServiceCategoryById);
serviceCategoryRoutes.post("/", verifyToken,upload.single("image"),createServiceCategory);
serviceCategoryRoutes.patch("/:id", verifyToken, upload.single("image"),updateServiceCategory);
serviceCategoryRoutes.delete("/:id", verifyToken, deleteServiceCategory);

export default serviceCategoryRoutes