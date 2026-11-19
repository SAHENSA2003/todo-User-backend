import nodemailer from "nodemailer";
import dotenv from "dotenv";

export const verifyMail = async (token, otp, email, userName) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.userMail,
      pass: process.env.mailPass
    }
  });
  const verifyLink = `http://localhost:9001/verify/${token}`;
  const mailConfiguration = {
    from: process.env.userMail,
    to: email,
    subject: "Email Verification",
    text: `Hi ${userName}, please verify your email by opening this link: ${verifyLink}`,
    html: `
    <div style="background-color:#f4f6f8; padding:30px; font-family:Arial, sans-serif;">
      <div style="max-width:500px; margin:auto; background:#ffffff; border-radius:8px; padding:30px; text-align:center;">

        <h1 style="color:#222222; font-size:26px; margin-bottom:10px;">
          Verify Your Email
        </h1>

        <p style="color:#555555; font-size:16px; line-height:1.6;">
          Hi ${userName},<br><br>
          Thanks for signing up! Use the OTP and token below to verify your account.
        </p>

        <p style="color:#555555; font-size:14px; margin-bottom:5px;">Your OTP</p>
        <div style="display:inline-block; padding:14px 28px; background-color:#4f46e5;
                    color:#ffffff; font-size:28px; font-weight:bold; letter-spacing:6px;
                    border-radius:6px;">
          ${otp}
        </div>

        <p style="color:#555555; font-size:14px; margin:25px 0 5px;">Your token</p>
        <p style="color:blue; font-size:13px; word-break:break-all; margin:0;">
          ${token}
        </p>

        <p style="color:#888888; font-size:13px; line-height:1.5; margin-top:25px;">
          Both expire in <b>10 minutes</b>.
        </p>

        <hr style="border:none; border-top:1px solid #eeeeee; margin:25px 0;">

        <p style="color:#aaaaaa; font-size:12px;">
          If you didn't create an account, you can safely ignore this email.
        </p>

      </div>
    </div>
    `
  };

  const info = await transporter.sendMail(mailConfiguration);
  console.log("Email sent successfully");
  console.log(info.messageId);
};
