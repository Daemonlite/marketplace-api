import express from "express";
import verifyToken from "../middlewares/verify.js";
import {fetchServiceRequests,fetchServiceRequestById,fetchProvidersRequests,fetchUserRequests,createServiceRequest,respondToServiceRequest,deleteServiceRequest} from "../controllers/serviceRequestController.js"

const serviceRequestRoutes = express.Router();


serviceRequestRoutes.get("/", verifyToken, fetchServiceRequests);
serviceRequestRoutes.get("/:id", verifyToken, fetchServiceRequestById);
serviceRequestRoutes.get("/providers/:id", verifyToken, fetchProvidersRequests);
serviceRequestRoutes.get("/user-requests/:id", verifyToken, fetchUserRequests);
serviceRequestRoutes.post("/", verifyToken, createServiceRequest);
serviceRequestRoutes.patch("/:id", verifyToken, respondToServiceRequest);
serviceRequestRoutes.delete("/:id", verifyToken, deleteServiceRequest);

export default serviceRequestRoutes