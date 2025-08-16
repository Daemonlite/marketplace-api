import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/connect.js";
import userRoutes from "./routes/userRoutes.js";
import serviceCategoryRoutes from "./routes/serviceCategoryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";
import cloudinary from "cloudinary";


dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//database connection
connectDb();

// routes
app.use("/api/users", userRoutes);
app.use("/api/service-categories", serviceCategoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-requests", serviceRequestRoutes);




app.listen(port, () => console.log(`Server is running on port ${port}`));