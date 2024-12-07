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
        <aside className="h-full w-24 lg:w-72 border-r border-neutral-300 flex flex-col transition-all duration-200">
            <div className="border-b border-neutral-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <span className="font-medium block">Contacts</span>
                </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
            {users.map((user) => (
                <button
                    key={user.id} // Use 'id' from API
                    className={`w-full p-3 flex items-center gap-3 cursor-pointer ${
                        selectedUser?.id === user.id ? "bg-neutral-100" : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                >
                    <div className="relative mx-auto lg:mx-0">
                        <img
                            src={user.profile_photo_path || "/vite.svg"} // Use 'profile_photo_path'
                            alt={user.full_name} // Use 'full_name'
                            className="rounded-full size-12 object-cover"
                        />
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
