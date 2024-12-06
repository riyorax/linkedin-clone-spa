import React from "react";
import { useState, useRef, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";

interface FeedPostProps {
    initialContent?: string;
    onSubmit: (content: string) => void;
    onCancel: () => void;
    isOpen: boolean;
    submitLabel?: string;
    isPending?: boolean;
}

const FeedPost: React.FC<FeedPostProps> = ({ initialContent = "", onSubmit, onCancel, isOpen, submitLabel = "Post", isPending = false}) => {
    const [content, setContent] = useState(initialContent);
    const [showConfirm, setShowConfirm] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const characterCount = content.length;
    const { profile, isLoading } = useProfile();
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
            <div className="bg-white rounded-lg shadow-lg w-[600px] p-6" onClick={(e) => e.stopPropagation()}>
            {showConfirm ? (
                <div className="p-4">
                    <h3 className="font-semibold mb-4">Discard post?</h3>
                    <p className="text-gray-600 mb-4">You haven't finished your post yet. Are you sure you want to leave?</p>
                    <div className="flex justify-end gap-4">
                        <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded" onClick={() => setShowConfirm(false)}>
                            Continue editing
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={onCancel}>
                            Discard
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-row items-center">
                            <img src={profile?.profile_photo} alt="Profile" className="w-12 h-12 rounded-full object-cover"/>
                            <div className="ml-3">
                                <h3 className="font-semibold">{profile?.name}</h3>
                            </div>
                        </div>
                        <button className="text-gray-500 hover:text-gray-700 text-right" onClick={handleClose}>
                        ✕
                        </button>
                    </div>
                    <textarea 
                        ref={textareaRef}
                        placeholder="What do you want to talk about?" 
                        className="w-full mt-4 rounded-lg p-3 resize-none placeholder-gray-600 focus:outline-none" 
                        rows={4} 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)}>
                    </textarea>
                    <div className="flex items-center justify-between mt-4">
                        <span className={`text-sm ${characterCount > 260 ? 'text-red-500' : 'text-gray-500'}`}>
                            {characterCount}/280
                        </span>
                        <button className={`px-6 py-2 rounded-full text-white ${content.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'}`} onClick={() => onSubmit(content)} disabled={!content.trim() || isPending}>
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