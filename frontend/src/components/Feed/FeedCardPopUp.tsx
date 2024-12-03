import React from 'react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FeedCardPopUp: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };
    
  return  (
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
            onClick={() => console.log("Update clicked")}
          >
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            onClick={() => console.log("Delete clicked")}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FeedCardPopUp