import ServiceCategory from "../models/ServiceCategory.js";
import { uploadImage } from "../helpers/uploadImage.js";

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
    if (!serviceCategory) {
      return res.status(404).json({ message: "Service category not found" });
    }
    return res.status(200).json(serviceCategory);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createServiceCategory = async (req, res) => {
  try {
    console.log(`body`, req.body);
    console.log(`file`, req.file);
    const { name } = req.body;
    const image = req.file;

    if (!name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingServiceCategory = await ServiceCategory.findOne({ name });
    if (existingServiceCategory) {
      return res
        .status(400)
        .json({ message: "Service category already exists" });
    }

    let imageUrl;

    if (image) {
      imageUrl = await uploadImage(image);
    }

    const serviceCategory = await ServiceCategory.create({
      name,
      image: imageUrl,
    });
    return res.status(200).json(serviceCategory);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateServiceCategory = async (req, res) => {
  try {
    const body = req.body;
    const serviceCategory = await ServiceCategory.findById(req.params.id);
    if (!serviceCategory) {
      return res.status(404).json({ message: "Service category not found" });
    }

    let imageUrl;
    if (req.file) {
      imageUrl = await uploadImage(req.file);
      body.image = imageUrl;
    }

    const updatedServiceCategory = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true }
    );
    return res.status(200).json(updatedServiceCategory);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteServiceCategory = async (req, res) => {
  try {
    const serviceCategory = await ServiceCategory.findByIdAndDelete(req.params.id);
    if (!serviceCategory) {
      return res.status(404).json({ message: "Service category not found" });
    }
    return res
      .status(200)
      .json({ message: "Service category deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
