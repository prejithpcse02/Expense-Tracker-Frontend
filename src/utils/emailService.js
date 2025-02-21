// src/utils/emailService.js

import emailjs from "@emailjs/browser";

// Replace these with your actual EmailJS credentials
/*const SERVICE_ID = "YOUR_SERVICE_ID";
const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const PUBLIC_KEY = "YOUR_PUBLIC_KEY";*/

export const sendThresholdAlert = async (userData) => {
  const templateParams = {
    to_name: userData.name,
    to_email: userData.email,
    total_expense: userData.totalExpense.toLocaleString(),
    threshold: userData.threshold.toLocaleString(),
    percentage: userData.percentage.toFixed(1),
  };

  try {
    const response = await emailjs.send(
      process.env.SERVICE_ID,
      process.env.TEMPLATE_ID,
      templateParams,
      process.env.PUBLIC_KEY
    );
    return { success: true, response };
  } catch (error) {
    return { success: false, error };
  }
};
