import e from 'express';
import {
    User
} from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {
    generateToken
} from '../lib/utils.js';


export const signup = async (req, res) => {
    const {
        fullName,
        email,
        password
    } = req.body;
    try {
        if (!fullName || !email || !password) {
            res.status(400).json({
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
        console.error("Error in signup controller", error.message);
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
        res.cookie('token', '', {
            maxAge: 0,
            expires: new Date(0) // Set the cookie to expire immediately
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