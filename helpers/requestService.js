import sendMail from "./sendMail.js";

const requestService = async (email, requester, service) => {
  try {
    const subject = "Service Request Confirmation";
    const userName = email.split("@")[0];

    // Improved HTML email template with better structure and styling
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid #e7e7e7;
        }
        .content {
            padding: 20px;
            background-color: #fff;
        }
        .details {
            margin: 20px 0;
        }
        .detail-item {
            margin-bottom: 10px;
        }
        .detail-label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e7e7e7;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Service Request Confirmation</h2>
    </div>
    
    <div class="content">
        <p>Dear ${userName},</p>
        
        <p>You have received a service request for <strong>${
          service.name
        }</strong> from ${requester}. Here are the details:</p>
        
        <div class="details">
            <div class="detail-item">
                <span class="detail-label">Service Name:</span>
                <span>${service.name}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Description:</span>
                <span>${service.description || "Not provided"}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Key Services:</span>
                <span>${
                  service.keyServices
                    ? service.keyServices.join(", ")
                    : "Not specified"
                }</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Location:</span>
                <span>${service.location || "Not specified"}</span>
            </div>
        </div>

        <p>Kindly review this request and provide any necessary additional information to the requester.</p>
        
        <p>We will process your request shortly and contact you if we need any additional information.</p>
        
        <p>Thank you for choosing our service!</p>
    </div>
    
    <div class="footer">
        <p>If you didn't request this service, please contact our support team immediately.</p>
        <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
    </div>
</body>
</html>`;

    await sendMail(email,content, subject);
    return {
      success: true,
      message: "Service request email sent successfully",
    };
  } catch (error) {
    console.error("Error sending service request email:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export default requestService;
