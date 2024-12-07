import { X } from "lucide-react";

interface ChatHeaderProps {
    selectedUser: any | null;
    setSelectedUser: (user: any) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedUser, setSelectedUser }) => {
    if (!selectedUser) return null;

    return (
        <div className="p-2.5 border-b border-neutral-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img
                                src={selectedUser.profile_photo_path || "/avatar.png"}
                                alt={selectedUser.full_name}
                            />
                        </div>
                    </div>
                </div>

                 {/* User info */}
                <div>
                    <h3 className="font-medium">{selectedUser.full_name}</h3>
                </div>

                {/* Close button */}
                <button onClick={() => setSelectedUser(null)}>
                    <X />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;