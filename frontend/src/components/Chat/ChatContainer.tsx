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
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isMessagesLoading, selectedUser, authUser, onSendMessage }) => {
    const messageEndRef = useRef(null);

    // Scroll to the bottom whenever the messages array changes
    useEffect(() => {
        if (messageEndRef.current && messages){
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader selectedUser={selectedUser} setSelectedUser={() => {}} />
                <ChatSkeleton />
                <ChatInput onSendMessage={onSendMessage} />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader selectedUser={selectedUser} setSelectedUser={() => {}} />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat ${message.from_id === authUser?.id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.from_id === authUser?.id
                                            ? authUser?.profile_photo || "/avatar.png"
                                            : selectedUser?.profile_photo_path || "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>

                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.timestamp)}</time>
                        </div>

                        <div className="chat-bubble flex flex-col">
                            {message.message && <p>{message.message}</p>}
                        </div>
                    </div>
                ))}
            </div>
            
            <ChatInput onSendMessage={onSendMessage} />
        </div>
    );
};

export default ChatContainer;