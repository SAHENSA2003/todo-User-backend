import UserSchema from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyMail } from "../emailVerify/verifymail.js";
import SessionSchema from "../models/SessionSchema.js";

export const CreateUser = async (req, res) => {
    try {
        const { UserName, email, Password } = req.body;
        const existMail = await UserSchema.findOne({ email: email });
        console.log(existMail);
        if (existMail) {
            return res.status(409).json({
                success: false,
                message: "User Already Exist"
            })
        };
        const hashedPassword = await bcrypt.hash(Password, 10);
        const User = await UserSchema.create({ UserName, email, Password: hashedPassword });
        const token = jwt.sign({ id: User._id }, process.env.secretKey, { "expiresIn": "10m" });
        console.log(token);

        await verifyMail(token, email, UserName);

        User.token = token;
        await User.save();
        return res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            data: User
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User not registered",
        });
    };

};

export const deleteAll = async (req, res) => {
    try {
        const user = await UserSchema.deleteMany({});
        return res.status(200).json({
            success: true,
            message: user.length === 0 ? "No user found" : "alluser deleted successfully",
            data: user.deletedCount,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
};

export const delUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await UserSchema.findOneAndDelete({ _id: id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "user deleted successfully",
            data: user
        })
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
            message: allUser.length === 0 ? "No user exist" : "user fetched Successfully",
            data: allUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
};

export const verifyToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Token authorization invalid or not found"
            })
        } else {
            const token = authHeader.split(" ")[1];
            jwt.verify(token, process.env.secretKey, async (err, decoded) => {
                if (err) {
                    console.log("The error message is ", err.name, err);
                    if (err.name === "TokenExpiredError") {
                        return res.status(401).json({
                            success: false,
                            message: "Token expired, Please reVerify on click Re-verify, then verify again!!"
                        })
                    }
                    return res.status(401).json({
                        success: false,
                        message: "Token invalid!! please re-verify to get the fresh token !!"
                    })
                }
                else {
                    console.log(decoded);
                    // const { id } = decoded;
                    const id = decoded.id;
                    console.log(id)
                    const user = await UserSchema.findById(id);
                    if (!user) {
                        return res.status(401).json({
                            success: false,
                            message: "user not found!!!"
                        })
                    } else {
                        user.token = null;
                        user.isVerified = true;
                        await user.save();
                        return res.status(200).json({
                            success: true,
                            message: "user verified successfully"
                        })
                    }
                }
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

export const reVerifyToken = async (REQ, RES) => {
    try {
        const authHeader = REQ.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return RES.status(401).json({
                success: false,
                message: "Token not found !!"
            })
        } else {
            const token = authHeader.split(" ")[1];
            let decoded;

            try {
                decoded = jwt.verify(token, process.env.secretKey, { ignoreExpiration: true });
                console.log(decoded);
            } catch (error) {
                return RES.status(401).json({
                    success: false,
                    message: "Token invalid!!!"
                })
            };

            const User = await UserSchema.findById(decoded.id);
            if (!User) {
                return RES.status(401).json({
                    success: false,
                    message: "User not found!!"
                });
            };

            if (User.isVerified === true) {
                return RES.status(400).json({
                    success: false,
                    message: "User already verified !!"
                })
            };

            if (User.token !== token) {
                return RES.status(400).json({
                    success: false,
                    message: "This token is outdate. Please use the latest token in mail "
                })
            }
            const newToken = jwt.sign({ id: decoded.id }, process.env.secretKey, { "expiresIn": "15m" });
            User.token = newToken;
            await User.save();
            await verifyMail(newToken, User.email);

            return RES.status(200).json({
                success: true,
                message: "re-verify successfully , check your mail to verify"
            })

        }


    } catch (error) {
        console.log(error);
        return RES.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const login = async (req, res) => {
    try {
        const email = req.body.email;
        const Password = req.body.Password;
        if (!email || !Password) {
            return res.status(400).json({
                success: false,
                message: "email and Password are required !!"
            })
        }
        const user = await UserSchema.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not registered yet!!"
            })
        } else {
            const comparePassword = await bcrypt.compare(Password, user.Password)
            if (!comparePassword) {
                return res.status(400).json({
                    success: false,
                    message: "Incorrect Password"
                });
            } else if (comparePassword && user.isVerified === true) {
                //  session limit check...
                const maxSession = 3;
                const activeSessions = await SessionSchema.countDocuments({ userId: user._id });
                 console.log(activeSessions);
                if (activeSessions >= maxSession) {
                    await SessionSchema.deleteMany({ userId: user._id });
                    user.isLoggedIn = false;
                    await user.save();
                    return res.status(403).json({
                        success: false,
                        message: "Login limit reached (3 devices). All devices have been logged out. Please login again."
                    });
                }
                
                // await SessionSchema.deleteMany({ userId: user._id });
                const session = await SessionSchema.create({ userId: user._id });

                const accessToken = jwt.sign({ id: session._id }, process.env.secretKey, {
                    "expiresIn": "10days"
                });

                const refreshToken = jwt.sign({ id: session._id }, process.env.secretKey, {
                    "expiresIn": "30days"
                });
                console.log(user._id);
                user.isLoggedIn = true;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "User successfully logged in",
                    AccessToken: accessToken,
                    RefreshToken: refreshToken,
                    data: user
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "verify first then login..."
                })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
};

export const logout = async (req, res) => {
    try {
        const Delete = await SessionSchema.findByIdAndDelete(req.sessionId);
        if(!Delete){
            return res.status(401).json({
                success:false,
                message:"No active session is findOut"
            })
        }
        const remaining = await SessionSchema.countDocuments({userId:req.userId});
        if(remaining ===0){
            await UserSchema.findByIdAndUpdate(req.userId,{isLoggedIn:false});
        }
        return res.status(200).json({
            success:true,
            message:"User successfully loggedOut"
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success:false,
        message:"Internal server error!!"
      })  
    }

}


