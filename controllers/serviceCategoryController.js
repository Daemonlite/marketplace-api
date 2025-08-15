import ServiceCategory from "../models/ServiceCategory";
import { uploadImageLater } from "../queues/index.js";

export const fetchServiceCategories = async (req, res) => {
    try {
        const serviceCategories = await ServiceCategory.find();
        return res.status(200).json(serviceCategories);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const fetchServiceCategoryById = async (req, res) => {
    try {
        const serviceCategory = await ServiceCategory.findById(req.params.id);
        return res.status(200).json(serviceCategory);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createServiceCategory = async (req,res) => {
    try {
        const { name, image } = req.body;
        const serviceCategory = await ServiceCategory.create({ name });
        if (image) {
            await uploadImageLater(image);
        }
        return res.status(200).json(serviceCategory);
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateServiceCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        const serviceCategory = await ServiceCategory.findById(req.params.id);
        if (!serviceCategory) {
            return res.status(404).json({ message: "Service category not found" });
        }
        serviceCategory.name = name;
        if (image) {
            await uploadImageLater(image);
        }
        await serviceCategory.save();
        return res.status(200).json(serviceCategory);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteServiceCategory = async (req, res) => {
    try {
        const serviceCategory = await ServiceCategory.findById(req.params.id);
        if (!serviceCategory) {
            return res.status(404).json({ message: "Service category not found" });
        }
        await serviceCategory.remove();
        return res.status(200).json({ message: "Service category deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}