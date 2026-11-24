import UserSchema from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import SessionSchema from "../models/SessionSchema.js";
import { generateAndSendCredential } from "../utils/generateCredentials.js";

export const CreateUser = async (req, res) => {
  try {
    const { UserName, email, Password } = req.body;
    const existMail = await UserSchema.findOne({ email: email });
    console.log(existMail);
    if (existMail) {
      return res.status(409).json({
        success: false,
        message: "User Already Exist with this email, please try another email",
      });
    }
    const hashedPassword = await bcrypt.hash(Password, 10);
    const User = await UserSchema.create({
      UserName,
      email,
      Password: hashedPassword,
    });

    await generateAndSendCredential(User);

    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      data: User,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User not registered",
    });
  }
};

export const deleteAll = async (req, res) => {
  try {
    const user = await UserSchema.deleteMany({});
    return res.status(200).json({
      success: true,
      message:
        user.length === 0 ? "No user found" : "alluser deleted successfully",
      data: user.deletedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const delUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserSchema.findOneAndDelete({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user deleted successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const allUser = await UserSchema.find({});
    return res.status(200).json({
      success: true,
      message:
        allUser.length === 0 ? "No user exist" : "user fetched Successfully",
      data: allUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const otp = req.body.otp;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Token authorization invalid or not found",
      });
    }

    if (!otp) {
      return res.status(400).json({
        success: false,
        message:
          "otp is required to verify, you can find it in your registered mail!!",
      });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.secretKey);
      console.log(decoded);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired , please go and reverify",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token invalid, please re-verify to get a fresh token and OTP",
      });
    }

    const user = await UserSchema.findById(decoded.id);
    console.log(user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "no user found to verify",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }
    /* checking the otp expiery */

    if (!user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "opt expire, please reverify!!",
      });
    }

    const matchOtp = await bcrypt.compare(otp, user.otp);

    if (!matchOtp) {
      return res.status(400).json({
        success: false,
        message: "invalid opt !! please give the correct one",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "user successfully verified!! you can login now!!",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const reVerifyUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required to reverify!! please give the emali",
      });
    }

    const user = await UserSchema.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "no user found with this mail, please go and , register first!!",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "user already verified!!",
      });
    }

    await generateAndSendCredential(user);

    return res.status(200).json({
      success: true,
      message:
        "token and otp successfully sent to your email please go and verify your account now !!!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body.email;
    const Password = req.body.Password;
    if (!email || !Password) {
      return res.status(400).json({
        success: false,
        message: "email and Password are required !!",
      });
    }
    const user = await UserSchema.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not registered yet!!",
      });
    } else {
      const comparePassword = await bcrypt.compare(Password, user.Password);
      if (!comparePassword) {
        return res.status(400).json({
          success: false,
          message: "Incorrect Password",
        });
      } else if (comparePassword && user.isVerified === true) {
        //  session limit check...
        const maxSession = 3;
        const activeSessions = await SessionSchema.countDocuments({
          userId: user._id,
        });
        console.log(activeSessions);
        if (activeSessions >= maxSession) {
          await SessionSchema.deleteMany({ userId: user._id });
          user.isLoggedIn = false;
          await user.save();
          return res.status(403).json({
            success: false,
            message:
              "Login limit reached (3 devices). All devices have been logged out. Please login again.",
          });
        }

        // await SessionSchema.deleteMany({ userId: user._id });
        const session = await SessionSchema.create({ userId: user._id });

        const accessToken = jwt.sign(
          { id: session._id },
          process.env.secretKey,
          {
            expiresIn: "10days",
          },
        );

        const refreshToken = jwt.sign(
          { id: session._id },
          process.env.secretKey,
          {
            expiresIn: "30days",
          },
        );
        console.log(user._id);
        user.isLoggedIn = true;
        await user.save();
        return res.status(200).json({
          success: true,
          message: "User successfully logged in",
          AccessToken: accessToken,
          RefreshToken: refreshToken,
          data: user,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "verify first then login...",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const Delete = await SessionSchema.findByIdAndDelete(req.sessionId);
    if (!Delete) {
      return res.status(401).json({
        success: false,
        message: "No active session is findOut",
      });
    }
    const remaining = await SessionSchema.countDocuments({
      userId: req.userId,
    });
    if (remaining === 0) {
      await UserSchema.findByIdAndUpdate(req.userId, { isLoggedIn: false });
    }
    return res.status(200).json({
      success: true,
      message: "User successfully loggedOut",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!!",
    });
  }
};

export const logoutAll = async (req, res) => {
  try {
    const result = await SessionSchema.deleteMany({ userId: req.userId });
    if (!result) {
      return res.status(104).json({
        success: false,
        message: "No active Session to logout",
      });
    }
    await UserSchema.findByIdAndUpdate(req.userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "SuccessFully loggedOut form all the devices !!!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const otp_TL = 10 * 60 * 1000;
    const reset_cooldown = 60 * 1000;
    const email = req.body.email?.toLowerCase().trim();
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required , to reset otp!!!",
      });
    }

    const genericResponse = {
      success: true,
      message: "an otp has been ",
    };

    const user = await UserSchema.findOne({ email: email });

    if (!user) {
      return res.status(401).json(genericResponse);
    }
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "your gmail is not verified yet, Please go and verify your account first !",
      });
    }

    if (
      user.resetOtpSentAt &&
      Date.now() - user.resetOtpSentAt.getTime() > reset_cooldown
    ) {
      return res.status(201).json(genericResponse);
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    user.resetOtp = await bcrypt.hash(otp, 10);
    user.resetOtpExpires = new Date(Date.now() + otp_TL);
    user.resetOtpAttempts = 0;
    user.resetOtpSentAt = new Date();
    await user.save();

    // await reSendMail(otp,user.email,user.name)
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!!",
    });
  }
};
