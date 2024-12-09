import React from "react";
import SidebarSkeleton from "../Skeleton/SidebarSekeleton";

interface ChatSidebarProps {
    users: any[];
    isUsersLoading: boolean;
    selectedUser: any | null;
    setSelectedUser: (user: any) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ users, isUsersLoading, selectedUser, setSelectedUser }) => {
    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-20 sm:w-24 lg:w-72 border-r border-neutral-300 flex flex-col transition-all duration-200">
            <div className="border-b border-neutral-300 w-full p-4 sm:p-7">
                <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium block">Contacts</span>
                </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
                {users.map((user) => (
                    <button
                        key={user.id}
                        className={`w-full p-3 flex items-center gap-3 cursor-pointer ${selectedUser?.id === user.id ? "bg-neutral-100" : ""
                            }`}
                        onClick={() => setSelectedUser(user)}
                    >
                        <div className="chat-image avatar">
                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border">
                                <img
                                    src={user.profile_photo_path || "/vite.svg"}
                                    alt="profile pic"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="hidden lg:block text-left min-w-0">
                            <div className="block text-left min-w-0">
                                <div className="font-medium truncate">
                                    {user.full_name}
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default ChatSidebar;
