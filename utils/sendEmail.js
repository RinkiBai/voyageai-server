// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendResetEmail = async (email, subject, htmlMessage) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing email credentials in environment variables");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password if 2FA is on
      },
    });

    // ✅ Verify SMTP connection
    transporter.verify((err, success) => {
      if (err) {
        console.error("❌ SMTP connection failed:", err);
      } else {
        console.log("✅ SMTP is ready to send emails");
      }
    });

    const mailOptions = {
      from: `"VoyageAI 🚀" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: htmlMessage,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw new Error("Email could not be sent. Reason: " + error.message);
  }
};
