import nodemailer from "nodemailer";
import dotenv from "dotenv/config";

const resetMail = async (otp, email, userName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.userMail,
      pass: process.env.mailPass,
    },
  });

  const configuration = {
    from: `"Your App" <${process.env.userMail}>`,
    to: email,
    subject: "Password Reset OTP",
    text: `Hi ${userName}, your password reset OTP is ${otp}. It is valid for 10 minutes. If you did not request this, ignore this email.`,
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #333;">Password Reset</h2>
                <p>Hi <b>${userName}</b>,</p>
                <p>Use the OTP below to reset your password:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; text-align: center; background: #f4f4f4; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    ${otp}
                </div>
                <p>This OTP is valid for <b>10 minutes</b>. Do not share it with anyone.</p>
                <p style="color: #888; font-size: 12px;">If you did not request a password reset, you can safely ignore this email.</p>
            </div>
        `,
  };

  const info = await transporter.sendMail(configuration);
  if (info) console.log('mail send successfully');
};

export default resetMail;
