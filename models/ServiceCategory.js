import mongoose from "mongoose";

const serviceCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },

}, { timestamps: true });

const ServiceCategory = mongoose.model("ServiceCategory", serviceCategorySchema);
export default ServiceCategory