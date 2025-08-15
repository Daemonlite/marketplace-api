export const generateOtp = async () => {
    try {
        let otp = Math.floor(100000 + Math.random() * 900000);
        console.log(`OTP: ${otp}`);
        return otp
    } catch (error) {
        throw error
    }
}