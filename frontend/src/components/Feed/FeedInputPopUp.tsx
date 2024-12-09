import React from "react";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import FeedPost from "./FeedPost";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/context/ProfileContext";

const addFeeds = async ({ content }: { content: string }) => {
  const response = await axios.post(
    "http://localhost:3000/api/feed",
    {
      content: content,
    },
    {
      withCredentials: true,
    },
  );
  if (response.data) {
    try {
      await axios.post(
        "http://localhost:3000/api/push_notification/feed",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (notifError) {
      console.error("Failed to send notification:", notifError);
    }
  }
  return response.data;
};

const FeedInputPopUp: React.FC = ({ }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();
  const { refetchProfile } = useProfile();

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
    onError: (e) => {
      if (axios.isAxiosError(e) && e.response) {
        const message = e.response.data.message || "An error occurred";
        toast.toast({
          title: "Failed",
          description: message,
          duration: 3000,
          variant: "destructive"
        });
      } else {
        toast.toast({
          title: "Failed",
          description: (e as Error).message || "An unexpected error occurred.",
          duration: 2000,
          variant: "destructive"
        });
      }
      refetchProfile();
      navigate(`/login`)
    }
  });

  return (
    <>
      <button
        className="text-[10px] sm:text-sm flex-grow w-full h-8 sm:h-12 px-4 border rounded-full text-left bg-white border-gray-400 hover:bg-gray-100"
        onClick={() => setIsOpen(true)}
      >
        Start a post
      </button>
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

export default FeedInputPopUp;

