import React from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";


const addFeeds  = async ({ content }: {content: string}) => {
    const response = await axios.post("http://localhost:3000/api/feed", {
        content: content,
    },
    { 
        withCredentials: true
    });
    console.log("data response: ",response)
    return response.data;
};

const FeedInputPopUp: React.FC = ({})=>{
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState("");
    const queryClient = useQueryClient();
    const toast = useToast()

    const toggleOpen = () =>{
        setIsOpen(!isOpen);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    }

    const feedMutation = useMutation({
        mutationFn: addFeeds,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feeds"] });
            setContent("");
            setIsOpen(false);
            toast.toast({
                title: "Success",
                description: "Your post has been published!",
            });
        },
        onError: (error) => {
            toast.toast({
                title: "Error",
                description: "Failed to create post. Please try again.",
                variant: "destructive",
            });
        }
    })

    const handleSubmit = () => {
        if (!content.trim()) return;
        feedMutation.mutate({ content });
    }

    return (
        <div className="flex flex-col items-center w-full">
            <button className="flex-grow w-full h-12 px-4 border rounded-full text-left bg-white border-gray-400 hover:bg-gray-100" onClick={toggleOpen}>
                <p className="font-semibold text-gray-700 px-1">Start a post, try writing with AI</p>   
            </button>
            {isOpen && (
                <div className="fixed inset-0 flex items-start pt-10 justify-center bg-opacity-50 bg-black z-10" onClick={toggleOpen}>
                    <div className="bg-white rounded-lg shadow-lg w-[600px] p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-row items-center">
                                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Profile" className="w-12 h-12 rounded-full object-cover"/>
                                <div className="ml-3">
                                    <h3 className="font-semibold">Maximilian Sulistiyo</h3>
                                </div>
                            </div>
                            <button className="text-gray-500 hover:text-gray-700 text-right" onClick={toggleOpen}>
                                ✕
                            </button>
                        </div>
                        <textarea placeholder="What do you want to talk about?" className="w-full mt-4 rounded-lg p-3 resize-none placeholder-gray-600 focus:outline-none" rows={4} value={content} onChange={handleChange}></textarea>
                        <div className="flex items-center justify-end mt-4">
                            <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600" onClick={handleSubmit}>
                                {feedMutation.isPending ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      );
};

export default FeedInputPopUp