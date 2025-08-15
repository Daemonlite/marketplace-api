import cloudinary from "cloudinary";

export const uploadImage = async (file) => {
    try {
        const data = await cloudinary.uploader.upload(file);
        return data.url;
    } catch (error) {
        console.log(error);
    }
};