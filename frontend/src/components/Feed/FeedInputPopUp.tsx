import React from "react";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import FeedPost from "./FeedPost";


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
    const textareaRef = useRef<HTMLTextAreaElement>(null); 
    const queryClient = useQueryClient();
    const toast = useToast()

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen]);

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

    return (
        <>
            <button className="flex-grow w-full h-12 px-4 border rounded-full text-left bg-white border-gray-400 hover:bg-gray-100" onClick={() => setIsOpen(true)}>Start a post</button>
            {isOpen && (
                <FeedPost
                onSubmit={(content) => feedMutation.mutate({ content })}
                onCancel={() => setIsOpen(false)}
                isOpen={isOpen}
                isPending={feedMutation.isPending}
                />
            )}
        </>
      );
};

export default FeedInputPopUp