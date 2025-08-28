import {
    User
} from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {
    generateToken
} from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';


export const signup = async (req, res) => {
    const {
        fullName,
        email,
        password
    } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            });
        }
        const user = await User.findOne({
            email
        });
        if (user) return res.status(400).json({
            message: "User already exists"
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })
        if (!newUser) return res.status(400).json({
            message: "Error creating user"
        });
        else {
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                message: "User created successfully",
                user: newUser
            });
        }
    } catch (error) {
        console.error("Error in signup controller: ", error.message);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const login = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            res.status(400).json({
                message: "Invalid credentials"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({
                message: "Invalid credentials"
            });
        }
        generateToken(user._id, res);
        res.status(200).json({
            message: "Login successful",
            user: user
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            maxAge: 0,
            httpOnly: true,
            sameSite: 'strict', // or whatever you use in generateToken
            secure: process.env.NODE_ENV !== 'development', // match your set-cookie
            path: '/', // must match!
        });
        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {
            profilePic
        } = req.body;
        const userId = req.user._id

        if (!profilePic) {
            return res.status(400).json({
                message: "Profile picture is required"
            });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, {
            new: true
        });
        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({
            message: "Server error"
        });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};