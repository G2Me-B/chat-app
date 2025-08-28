import {
    User
} from "../models/user.model.js";
import {
    Message
} from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({
            _id: {
                $ne: loggedInUserId
            }
        }).select("password");

        res.status(200).json({
            users: filteredUsers
        });
    } catch (error) {
        console.log("Error in getUsersForSidebar controller: ", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getMessages = async (req, res) => {
    try {
        const {
            id: userToChatId
        } = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or: [{
                    myId,
                    receiverId: userToChatId
                },
                {
                    myId: userToChatId,
                    receiverId: myId
                }
            ]
        })
        res.status(200).json({
            messages
        })
    } catch (error) {

    }
}

export const sendMessage = async (req, res) => {
    try {
        const {
            text,
            image
        } = req.body
        const {
            id: receiverId
        } = req.params
        const senderId = req.user._id

        let imageUrl;
        if (image) {
            const uploadResult = await cloudinary.uploader.upload(image)
            imageUrl = uploadResult.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()
        // todo: implement realtime functionality  with socket.io

        res.status(201).json({})
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}