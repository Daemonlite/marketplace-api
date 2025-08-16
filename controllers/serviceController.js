import ServiceCategory from "../models/ServiceCategory.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import { uploadImage } from "../helpers/uploadImage.js";

export const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate({
      path: "category provider",
      select: "_id name",
      

    }).sort({ createdAt: -1 });
    return res.status(200).json(services);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate({
      path: "category",
      select: "_id name",
    })

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json(service);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchServiceProviders = async (req, res) => {
  try {
    const serviceId = req.params.id;

    // Get distinct provider IDs from services in this category
    const providerIds = await Service.find({ category: serviceId }).distinct("provider");

    if (!providerIds || providerIds.length === 0) {
      return res.status(404).json({ message: "No providers found for this category" });
    }

    // Fetch all related users
    const relatedUsers = await User.find({ _id: { $in: providerIds } })
      .select("_id name email phone"); // pick fields you want

    return res.status(200).json(relatedUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const fetchUserServices = async (req, res) => {
  try {
    const userId = req.params.id;

    const relatedUsers = await User.find({ _id: userId });
    if (!relatedUsers) {
      return res.status(404).json({ message: "User not found" });
    }

    const services = await Service.find({ provider: userId }).sort({ createdAt: -1 });

    return res.status(200).json(services);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, category, location, keyServices } =
      req.body;

    const image = req.file;
    if (!name || !description || !category || !location || !keyServices) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const currentUser = req.user._id;
    const user = await User.findById(currentUser);
    if (!user || !user.role === "provider") {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "You are blocked by the admin" });
    }
    const serviceCategory = await ServiceCategory.findById(category);
    if (!serviceCategory) {
      return res.status(404).json({ message: "Service category not found" });
    }

    const existingService = await Service.findOne({ name, provider: user._id });
    if (existingService) {
      return res.status(400).json({ message: "Service already exists" });
    }

    const services = keyServices.split(",");
    console.log(`services`, services);
    let imageUrl;
    if (image) {
      imageUrl = await uploadImage(image);
    }
    const service = await Service.create({
      name,
      description,
      category,
      location,
      keyServices: services,
      image: imageUrl,
      provider: user._id,
    });
    return res.status(200).json(service);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const body = req.body;

    const currentUser = req.user._id;
    const user = await User.findById(currentUser);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imageUrl;
    if (req.file) {
      imageUrl = await uploadImage(req.file);
      body.image = imageUrl;
    }

    const service = Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const updatedService = await Service.findByIdAndUpdate(serviceId, body, {
      new: true,
    });
    return res.status(200).json(updatedService);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const currentUser = req.user._id;

    if (
      service.provider.toString() !== currentUser.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this service" });
    }

    await service.deleteOne();
    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
