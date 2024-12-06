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
        <aside className="h-full w-20 lg:w-72 border-r border-neutral-300 flex flex-col transition-all duration-200">
            <div className="border-b border-neutral-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <span className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
            </div>

            <div className="overflow-y-auto w-full py-3">
                {users.map((user) => (
                    <button
                        key={user._id}
                        className={`w-full p-3 flex items-center gap-3 cursor-pointer ${
                            selectedUser?._id === user._id ? "bg-neutral-100" : ""
                        }`}
                        onClick={() => setSelectedUser(user)}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user?.avatar || "/vite.svg"}
                                alt={user?.name}
                                className="rounded-full size-12 object-cover"
                            />
                        </div>

                        <div className="block text-left min-w-0">
                            <div className="font-medium truncate">{user.fullName}</div>
                        </div>
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default ChatSidebar;
