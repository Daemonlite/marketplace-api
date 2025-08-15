import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/connect.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config();

const port = process.env.PORT || 5000;

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//database connection
connectDb();

// routes
app.use("/api/users", userRoutes);



app.listen(port, () => console.log(`Server is running on port ${port}`));