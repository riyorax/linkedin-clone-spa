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

interface Props {
  feed_id:number;
  currentContent: string;
}

const deleteFeed = async (feed_id: number) => {
  return axios.delete(`http://localhost:3000/api/feed/${feed_id}`, {
    withCredentials: true
  });
}

const FeedCardPopUp: React.FC<Props> = ({feed_id, currentContent}) => {
  const [showUpdateEditor, setShowUpdateEditor] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
      setShowDeleteConfirmation(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (content: string) => axios.put(`http://localhost:3000/api/feed/${feed_id}`, 
      { content }, 
      { withCredentials: true }
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
      setShowUpdateEditor(false);
    },
  });

  const handleDelete = () => {
      deleteMutation.mutate(feed_id);
  };
  return  (
    <>
    <div className="relative mr-2 mt-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <img
              src="https://www.svgrepo.com/show/124304/three-dots.svg"
              className="w-3 h-3"
              alt="Options"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <DropdownMenuItem
            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            onClick={() => setShowUpdateEditor(true)}
          >
            Update
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
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
            <h3 className="text-lg font-semibold mb-4">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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