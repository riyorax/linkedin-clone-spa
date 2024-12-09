import React from 'react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FeedPost from './FeedPost';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/context/ProfileContext';

interface Props {
  feed_id: number;
  currentContent: string;
}

const deleteFeed = async (feed_id: number) => {
  return axios.delete(`http://localhost:3000/api/feed/${feed_id}`, {
    withCredentials: true
  });
}

const FeedCardPopUp: React.FC<Props> = ({ feed_id, currentContent }) => {
  const [showUpdateEditor, setShowUpdateEditor] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();
  const { refetchProfile } = useProfile();

  const deleteMutation = useMutation({
    mutationFn: deleteFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
      setShowDeleteConfirmation(false);
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

  const updateMutation = useMutation({
    mutationFn: (content: string) => axios.put(`http://localhost:3000/api/feed/${feed_id}`,
      { content },
      { withCredentials: true }
    ),
    onError: (e) => {
      if (axios.isAxiosError(e) && e.response) {
        const message = e.response.data.message || "An error occurred";
        toast.toast({
          title: "Failed",
          description: message,
          duration: 3000,
        });
      } else {
        toast.toast({
          title: "Failed",
          description: (e as Error).message || "An unexpected error occurred.",
          duration: 2000,
        });
      }
      refetchProfile();
      navigate(`/login`)
    }
  });

  const handleDelete = () => {
    deleteMutation.mutate(feed_id);
  };
  return (
    <>
      <div className="relative mr-2 mt-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Edit className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-30 sm:w-56 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <DropdownMenuItem
              className="text-[10px] sm:text-sm cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => setShowUpdateEditor(true)}
            >
              Update
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-[10px] sm:text-sm  cursor-pointer px-4 py-2 hover:bg-gray-100"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {showUpdateEditor && (
        <FeedPost
          initialContent={currentContent}
          onSubmit={(content) => updateMutation.mutate(content)}
          onCancel={() => setShowUpdateEditor(false)}
          isOpen={showUpdateEditor}
          submitLabel="Update"
          isPending={updateMutation.isPending}
        />
      )}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-sm sm:text-l font-semibold mb-4">Delete Post</h3>
            <p className="text-[10px] sm:text-sm text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="text-[10px] sm:text-sm px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="text-[10px] sm:text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FeedCardPopUp