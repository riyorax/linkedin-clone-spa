import { getMutualConnection } from "../services/connection.service";
import * as chatService from "../services/chat.service";

export const getUsersForSidebar = async (req, res) => {
    try {
        const listConnection = await getMutualConnection(req.user.userId);
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
        const senderId = req.user.userId;
        const { message } = req.body;

        const newMessage = await chatService.sendMessages(senderId, receiverId, message);

        // todo: realtime pake socket.io

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