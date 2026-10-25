import nodemailer from "nodemailer";
import dotenv from "dotenv";

export const verifyMail = async (token,email)=>{

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.userMail,
            pass:process.env.mailPass
        }
    });

    const mailConfiguration = {
        from: process.env.userMail,
        to: email,
        subject: "Email Verification",
        text: `Hi! there, you recently visited our website and entered your email.
              Please follow the given link to verify your email 
              http://localhost:9001/verify/${token} thanks`
    };

    const info = await transporter.sendMail(mailConfiguration);
    console.log("Email sent successfully");
    console.log(info);
}
 