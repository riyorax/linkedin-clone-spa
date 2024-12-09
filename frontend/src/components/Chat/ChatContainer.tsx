import React, { useEffect, useRef } from 'react';
import ChatHeader from '@/components/Chat/ChatHeader';
import ChatInput from '@/components/Chat/ChatInput';
import ChatSkeleton from '@/components/Skeleton/ChatSkeleton';
import { formatMessageTime } from '@/lib/utils';

interface ChatContainerProps {
    messages: any[];
    isMessagesLoading: boolean;
    selectedUser: any | null;
    authUser: { id: number; username: string; name: string; profile_photo: string } | null;
    onSendMessage: (message: string) => Promise<void>;
    setSelectedUser: (user: any | null) => void;
    typingUsers: string[];
    onTyping: () => void;
    onStopTyping: () => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isMessagesLoading, selectedUser, authUser, onSendMessage, setSelectedUser, typingUsers, onTyping, onStopTyping, }) => {
    const messageEndRef = useRef(null);
    const isTyping = typingUsers.includes(selectedUser.id);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader selectedUser={selectedUser} setSelectedUser={selectedUser} typing={isTyping} />
                <ChatSkeleton />
                <ChatInput onSendMessage={onSendMessage} onTyping={onTyping} onStopTyping={onStopTyping} />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader selectedUser={selectedUser} setSelectedUser={setSelectedUser}  typing={isTyping} />

            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat ${message.from_id === authUser?.id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className="chat-image avatar">
                            <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full border">
                                <img
                                    src={
                                        message.from_id === authUser?.id
                                            ? authUser?.profile_photo || "/avatar.png"
                                            : selectedUser?.profile_photo_path || "/avatar.png"
                                    }
                                    alt="profile pic"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="chat-header mb-1">
                            <time className="text-[10px] sm:text-xs opacity-50 ml-1">{formatMessageTime(message.timestamp)}</time>
                        </div>

                        <div className="chat-bubble text-xs sm:text-base">
                            {message.message && <p className="break-words">{message.message}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <ChatInput onSendMessage={onSendMessage} onTyping={onTyping} onStopTyping={onStopTyping} />
        </div>
    );
};

export default ChatContainer;