import { getMutualConnection } from "../services/connection.service";
import * as chatService from "../services/chat.service";
import { getReceiverSocketIds, io } from "../lib/socket";
import { getConnection } from "../services/connection.service";

export const getUsersForSidebar = async (req, res) => {
    try {
        const id = parseInt(req.user.userId);
        const listConnection = await getMutualConnection(id);
        res.status(200).json({
            success: true,
            message: "List connection data fetched successfully",
            body: {
                access: req.access,
                listConnection: listConnection,
            },
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching connections.",
            error: e,
        });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id:userToChatId } = req.params;
        const senderId = req.user.userId;

        // Check if both connected
        const isConnection = await getConnection(senderId, userToChatId);

        if (!isConnection) {
            return res.status(403).json({
                success: false,
                message: "You are not connected with this user.",
                error: null,
            });
        }
        
        const messages = await chatService.getMessages(senderId, userToChatId);
        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            body: {
                messages: messages,
            },
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching messages.",
            error: e,
        });
    }
}

export const sendMessages = async (req, res) => {
    try {
        const { id:receiverId } = req.params;
        const senderId = parseInt(req.user.userId);
        const { message } = req.body;

        // Check if both connected
        const isConnection = await getConnection(senderId, receiverId);

        if (!isConnection) {
            return res.status(403).json({
                success: false,
                message: "You are not connected with this user.",
                error: null,
            });
        }

        const newMessage = await chatService.sendMessages(senderId, receiverId, message);

        const receiverSocketIds = getReceiverSocketIds(receiverId);
        if (receiverSocketIds) {
            receiverSocketIds.forEach((socketId) => {
                io.to(socketId).emit("newMessage", newMessage);
            });
        }

        res.status(200).json({
            success: true,
            message: "Message sent successfully",
            body: {
                message: newMessage,
            },
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while sending message.",
            error: e,
        });
    }
}