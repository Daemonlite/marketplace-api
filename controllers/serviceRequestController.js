import ServiceRequest from "../models/ServiceRequest.js";
import User from "../models/User.js";
import Service from "../models/Service.js";
import { requestServiceLater } from "../queues/index.js";
import sendMail from "../helpers/sendMail.js";

export const fetchServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find()
      .populate({
        path: "service",
        select: "_id name description keyServices",
      })
      .populate({
        path: "user",
        select: "_id name email phone",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json(serviceRequests);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchProvidersRequests = async (req, res) => {
  try {
    const userId = req.params.id;
    const relatedUsers = await User.findById(userId);
    if (!relatedUsers) {
      return res.status(404).json({ message: "User not found" });
    }
    const serviceRequests = await ServiceRequest.find({
      service: { provider: userId },
    })
      .populate({
        path: "service",
        select: "_id name description keyServices",
      })
      .populate({
        path: "user",
        select: "_id name email phone",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json(serviceRequests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchUserRequests = async (req, res) => {
  try {
    const userId = req.params.id;
    const relatedUsers = await User.findById(userId);
    if (!relatedUsers) {
      return res.status(404).json({ message: "User not found" });
    }
    const serviceRequests = await ServiceRequest.find({ user: userId })
      .populate({
        path: "service",
        select: "_id name description keyServices",
      })
      .populate({
        path: "user",
        select: "_id name email phone",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json(serviceRequests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchServiceRequestById = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id)
      .populate({
        path: "service",
        select: "_id name description keyServices",
      })
      .populate({
        path: "user",
        select: "_id name email phone",
      });
    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }
    return res.status(200).json(serviceRequest);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createServiceRequest = async (req, res) => {
  try {
    const { service } = req.body;

    if (!service) {
      return res.status(400).json({ message: "Service and user are required" });
    }

    const serviceExists = await Service.findById(service);
    if (!serviceExists) {
      return res.status(404).json({ message: "Service not found" });
    }

    const user = req.user._id;
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingServiceRequest = await ServiceRequest.findOne({
      service,
      user,
    });
    console.log(existingServiceRequest);
    if (existingServiceRequest) {
      return res
        .status(400)
        .json({ message: "Service request already exists" });
    }

    const provider = await User.findById(serviceExists.provider);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    if (userExists._id.toString() === provider._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot request your own service" });
    }

    const serviceRequest = await ServiceRequest.create({ service, user });
    await requestServiceLater(provider.email, userExists.name, serviceExists);
    return res.status(201).json(serviceRequest);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const respondToServiceRequest = async (req, res) => {
  try {
    const serviceRequestId = req.params.id;
    const { status } = req.body;

    const currentUser = req.user;

    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }

    if(serviceRequest.status !== "pending") {
      return res.status(400).json({ message: "Service request is not pending" });
    }
    console.log(serviceRequest);
    const service = await Service.findById(serviceRequest.service);
    console.log(currentUser._id, service.provider);
    if (currentUser._id.toString() !== service.provider.toString()) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to update this service request",
        });
    }
    serviceRequest.status = status;
    await serviceRequest.save();
    const serviceRequestUser = await User.findById(serviceRequest.user);
    const message = `Your service request for ${service.name} has been ${status}. By ${currentUser.name}.`;
    await sendMail(serviceRequestUser.email, message, "Service Request Status");
    return res.status(200).json(serviceRequest);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteServiceRequest = async (req, res) => {
  try {
    const serviceRequestId = req.params.id;
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }
    await serviceRequest.deleteOne();
    return res
      .status(200)
      .json({ message: "Service request deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
