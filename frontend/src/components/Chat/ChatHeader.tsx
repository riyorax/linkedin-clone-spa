import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ChatHeaderProps {
    selectedUser: any | null;
    setSelectedUser: (user: any) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedUser, setSelectedUser }) => {
    if (!selectedUser) return null;

    return (
        <div className="p-2 sm:p-4 border-b border-neutral-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Avatar */}
                    <Avatar className="w-8 h-8 sm:w-11 sm:h-11 text-[8px] sm:text-sm flex items-center justify-center object-cover rounded-full border-2 border-white shadow-md bg-neutral-100">
                        <AvatarImage src={selectedUser.profile_photo_path} alt={selectedUser.full_name} />
                        <AvatarFallback>{selectedUser.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    {/* User info */}
                    <div>
                        <h3 className="text-sm sm:text-l font-medium">{selectedUser.full_name}</h3>
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={() => setSelectedUser(null)}
                    className="p-1 sm:p-2 hover:bg-neutral-100 rounded-full transition-colors duration-200"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;