import nodemailer from "nodemailer";
import dotenv from "dotenv";

export const verifyMail = async (token, email,userName) => {

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
          Verify Your Email with token below 
        </h1>

        <p style="color:#555555; font-size:16px; line-height:1.6;">
          Hi ${userName},<br><br>
          Thanks for signing up! Please confirm your email address
          by clicking the button below.
        </p>

           <div
           style="display:inline-block; margin:20px 0; padding:14px 28px;
                  background-color:#4f46e5; color:#ffffff; text-decoration:none;
                  font-size:16px; font-weight:bold; border-radius:6px;">
          Verify Email  </div>
          <h2 style="margin:auto">👇👇</h2>
         <h4 style = "color:blue; font-size:15px"> Your token is [${token}] </h4>
        <p style="color:#888888; font-size:13px; line-height:1.5;">
          This link will expire in <b>15 min</b>.<br>
          If the button doesn't work, copy and paste this link into your browser:<br>
          <span style="color:#4f46e5; word-break:break-all;">${verifyLink}</span>
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
  console.log(info);
};
