import express from "express";
import verifyToken from "../middlewares/verify.js";
import {getServices, getServiceById,fetchServiceProviders, fetchUserServices,createService, updateService, deleteService,deleteService} from "../controllers/serviceController.js"

const serviceRoutes = express.Router();


serviceRoutes.get("/", verifyToken, getServices);
serviceRoutes.get("/:id", verifyToken, getServiceById);
serviceRoutes.get("/service-providers/:id", verifyToken, fetchServiceProviders);
serviceRoutes.get("/user-services/:id", verifyToken, fetchUserServices);
serviceRoutes.post("/", verifyToken, createService);
serviceRoutes.put("/:id", verifyToken, updateService);
serviceRoutes.delete("/:id", verifyToken, deleteService);

export default serviceRoutes