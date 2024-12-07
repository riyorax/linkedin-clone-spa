import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatSidebar from "@/components/Chat/ChatSidebar";
import NoChatSelected from "@/components/Chat/NoChatSelected";
import ChatContainer from "@/components/Chat/ChatContainer";

interface User {
    id: string;
    full_name: string;
    username: string;
    profile_photo_path: string;
}

const ChatPage: React.FC = () => {
    const [receiverId, setReceiverId] = useState<string | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);

    async function getFriends() {
        setIsUsersLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/api/chat/users", {
                withCredentials: true,
            });
            if (response.status === 200 && response.data.success) {
                setUsers(response.data.body.listConnection);
            } else {
                throw new Error(response.data.message || "Failed to fetch users.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsUsersLoading(false);
        }
    }

    async function getMessages(receiverId: string | null) {
        if (!receiverId) return;
        setIsMessagesLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/chat/${receiverId}`, {
                withCredentials: true,
            });
            if (response.status === 200 && response.data.success) {
                setMessages(response.data.body.messages);
            } else {
                throw new Error(response.data.message || "Failed to fetch messages.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsMessagesLoading(false);
        }
    }

    // Fetch messages when receiverId changes
    useEffect(() => {
        getMessages(receiverId);
    }, [receiverId]);

    // Fetch users on component mount
    useEffect(() => {
        getFriends();
    }, []);

    return (
        <div className="h-screen bg-neutral-100">
            <div className="flex items-center justify-center px-4">
                <div className="bg-neutral-50 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <ChatSidebar
                            users={users}
                            isUsersLoading={isUsersLoading}
                            selectedUser={selectedUser}
                            setSelectedUser={(user) => {
                                setSelectedUser(user);
                                setReceiverId(user?._id || null);
                            }}
                        />

                        {!selectedUser ? <NoChatSelected /> : <ChatContainer messages={messages} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
