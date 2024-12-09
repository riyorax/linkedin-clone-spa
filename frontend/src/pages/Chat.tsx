import React, { useState, useEffect } from "react";
import axios from "axios";
import { useProfile } from "@/context/ProfileContext";
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
    const { profile: loggedInUser } = useProfile();
    const [receiverId, setReceiverId] = useState<string | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const { socket } = useProfile();

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

    async function sendMessage(message: string) {
        if (!receiverId) return;
        try {
            const response = await axios.post(
                `http://localhost:3000/api/chat/${receiverId}`,
                { message },
                { withCredentials: true },
            );
            if (response.status === 200 && response.data.success) {
                const newMessage = response.data.body.message; // The complete message object from the backend
                setMessages((messages) => [...messages, newMessage]); // Add the new message to the state
            } else {
                throw new Error(response.data.message || "Failed to send message.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    function subscribeToMessages() {
        if (!loggedInUser || !selectedUser || !loggedInUser.id || !selectedUser.id) return;
    
        // Subscribe to "newMessage" events for the selected user
        if (socket) {
            socket.on("newMessage", (message) => {
                if (message.from_id === selectedUser.id || message.to_id === selectedUser.id) {
                    setMessages((prevMessages) => [...prevMessages, message]);
                }
            });
            console.log("Subscribed to new messages for user:", selectedUser.id);
        }
    }
    
    function unsubscribeFromMessages() {
        if (socket) {
            socket.off("newMessage"); // Unsubscribe from "newMessage" events
            console.log("Unsubscribed from new messages");
        }
    }

    function subscribeToTypingEvents() {
        if (socket) {
            socket.on("userTyping", (userId) => {
                setTypingUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
            });
            socket.on("userStopTyping", (userId) => {
                setTypingUsers((prev) => prev.filter((id) => id !== userId));
            });
        }
    }

    function unsubscribeFromTypingEvents() {
        if (socket) {
            socket.off("userTyping");
            socket.off("userStopTyping");
        }
    }
    
    // Fetch users on component mount
    useEffect(() => {
        getFriends();
    }, []);
    
    // Manage subscriptions when receiverId changes
    useEffect(() => {
        getMessages(receiverId);
        subscribeToMessages();
        return () => {
            unsubscribeFromMessages();
        };
    }, [receiverId]);

    const handleTyping = () => {
        if (socket && receiverId) socket.emit("typing", { to: receiverId });
    };

    const handleStopTyping = () => {
        if (socket && receiverId) socket.emit("stopTyping", { to: receiverId });
    };

    useEffect(() => {
        subscribeToTypingEvents();
        return () => unsubscribeFromTypingEvents();
    }, [socket]);


    return (
        <div className="h-full">
            <div className="container flex mx-auto px-8 lg:px-40 space-x-2">
                <div className="bg-neutral-50 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <ChatSidebar
                            users={users}
                            isUsersLoading={isUsersLoading}
                            selectedUser={selectedUser}
                            setSelectedUser={(user) => {
                                setSelectedUser(user);
                                setReceiverId(user?.id || null);
                            }}
                        />

                        {!selectedUser ? (
                            <NoChatSelected />
                        ) : (
                            <ChatContainer
                            messages={messages}
                            isMessagesLoading={isMessagesLoading}
                            selectedUser={selectedUser}
                            authUser={loggedInUser}
                            onSendMessage={sendMessage}
                            setSelectedUser={setSelectedUser}
                            typingUsers={typingUsers}
                            onTyping={handleTyping}
                            onStopTyping={handleStopTyping}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
