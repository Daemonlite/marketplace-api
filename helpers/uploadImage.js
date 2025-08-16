import cloudinary from "cloudinary";

export const uploadImage = async (file) => {
  try {
    // Convert buffer to base64
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "service-categories",
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
