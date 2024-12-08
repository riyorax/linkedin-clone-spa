import React from "react";
import { useState, useRef, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface FeedPostProps {
    initialContent?: string;
    onSubmit: (content: string) => void;
    onCancel: () => void;
    isOpen: boolean;
    submitLabel?: string;
    isPending?: boolean;
}

const FeedPost: React.FC<FeedPostProps> = ({ initialContent = "", onSubmit, onCancel, isOpen, submitLabel = "Post", isPending = false }) => {
    const [content, setContent] = useState(initialContent);
    const [showConfirm, setShowConfirm] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const characterCount = content.length;
    const { profile } = useProfile();
    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen]);

    const handleClose = () => {
        if (content.trim() && content !== initialContent) {
            setShowConfirm(true);
            return;
        }
        onCancel();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black z-[100]" onClick={handleClose}>
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
                {showConfirm ? (
                    <>
                        <h3 className="text-sm sm:text-l font-semibold mb-4">Discard post?</h3>
                        <p className="text-[10px] sm:text-sm text-gray-600 mb-6">You haven't finished your post yet. Are you sure you want to leave?</p>
                        <div className="flex justify-end gap-4">
                            <button className="text-[10px] sm:text-sm px-4 py-2 text-gray-600 hover:bg-gray-100 rounded" onClick={() => setShowConfirm(false)}>
                                Continue editing
                            </button>
                            <button className="text-[10px] sm:text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={onCancel}>
                                Discard
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-row items-center">
                                <Avatar className="w-8 h-8 sm:w-12 sm:h-12 text-[8px] sm:text-sm flex items-center justify-center object-cover rounded-full border-2 border-white shadow-md bg-neutral-100">
                                    <AvatarImage src={profile?.profile_photo} alt={profile?.name} />
                                    <AvatarFallback>{profile?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="ml-3">
                                    <h3 className="text-sm sm:text-l font-semibold">{profile?.name}</h3>
                                </div>
                            </div>
                            <button className="text-gray-500 hover:text-gray-700 text-right" onClick={handleClose}>
                                ✕
                            </button>
                        </div>
                        <textarea
                            ref={textareaRef}
                            placeholder="What do you want to talk about?"
                            className="text-[10px] sm:text-sm w-full mt-4 rounded-lg p-3 resize-none placeholder-gray-600 focus:outline-none"
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}>
                        </textarea>
                        <div className="flex items-center justify-between mt-4">
                            <span className={`text-[10px] sm:text-sm ${characterCount > 260 ? 'text-red-500' : 'text-gray-500'}`}>
                                {characterCount}/280
                            </span>
                            <button className={`text-[10px] sm:text-sm px-6 py-2 rounded-full text-white ${content.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'}`} onClick={() => onSubmit(content)} disabled={!content.trim() || isPending}>
                                {isPending ? "Posting..." : submitLabel}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default FeedPost