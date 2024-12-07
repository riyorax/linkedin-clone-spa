import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    Menu,
    GitPullRequest,
    User,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { useState, useEffect } from "react";

interface Profile {
    id: number;
    name: string;
    username: string;
    profile_photo: string;
}

export function Header() {
    const { profile, isLoading } = useProfile();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get("search");
        if (location.pathname !== "/users") {
            setSearchQuery("");
        } else if (query) {
            setSearchQuery(query);
        }
    }, [location]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        navigate(`/users?search=${encodeURIComponent(query)}`);
    };

    const profileHeader = (profile: Profile | null, isLoading: boolean) => {
        if (!profile || isLoading) {
            return (
                <div className="flex items-center space-x-2">
                    <Link to="/users">
                        <Button
                            className="text-[10px] sm:text-sm text-bluelinkedin bg-white rounded-full hover:bg-bluelinkedin hover:text-white hover:scale-105"
                            variant="ghost"
                            size="sm">
                            User List
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button
                            className="text-[10px] sm:text-sm text-bluelinkedin bg-white rounded-full hover:bg-bluelinkedin hover:text-white hover:scale-105"
                            variant="ghost"
                            size="sm">
                            Sign In
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button
                            className="text-[10px] sm:text-sm shadow-none text-bluelinkedin bg-white rounded-full hover:bg-bluelinkedin hover:text-white hover:scale-105"
                            size="sm"
                        >
                            Join Now
                        </Button>
                    </Link>
                </div>
            );
        }

        return (
            <>
                {/* Navigation */}
                <nav className="hidden lg:flex items-center space-x-4">
                    {/* Home */}
                    <NavLink
                        to="/feed"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center rounded-md ${isActive ? "text-black" : "text-gray-400"
                            } hover:text-black`
                        }
                    >
                        <div className="flex flex-col items-center text-[10px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="mercado-match"
                                width="24"
                                height="24"
                                focusable="false"
                            >
                                <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
                            </svg>
                            <span>Home</span>
                        </div>
                    </NavLink>

                    {/* Network */}
                    <NavLink
                        to={`/connection/list/${profile.id}`}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center rounded-md ${isActive ? "text-black" : "text-gray-400"
                            } hover:text-black`
                        }
                    >
                        <div className="flex flex-col items-center text-[10px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="mercado-match"
                                width="24"
                                height="24"
                                focusable="false"
                            >
                                <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
                            </svg>
                            My Network
                        </div>
                    </NavLink>
                    {/* Request */}
                    <NavLink
                        to="/connection/request"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center rounded-md ${isActive ? "text-black" : "text-gray-400"
                            } hover:text-black`
                        }
                    >
                        <div className="flex flex-col items-center text-[10px]">
                            <GitPullRequest />
                            Request
                        </div>
                    </NavLink>
                    {/* Users */}
                    <NavLink
                        to="/users"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center rounded-md ${isActive ? "text-black" : "text-gray-400"
                            } hover:text-black`
                        }
                    >
                        <div className="flex flex-col items-center text-[10px]">
                            <User />
                            User List
                        </div>
                    </NavLink>
                    {/* Notification */}
                    <NavLink
                        to="/notification"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center rounded-md ${isActive ? "text-black" : "text-gray-400"
                            } hover:text-black`
                        }
                    >
                        <div className="flex flex-col items-center text-[10px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="mercado-match"
                                width="24"
                                height="24"
                                focusable="false"
                            >
                                <path d="M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z"></path>
                            </svg> Notification
                        </div>
                    </NavLink>
                    {/* Message */}
                    <NavLink
                        to="/chat"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center rounded-md ${isActive ? "text-black" : "text-gray-400"
                            } hover:text-black`
                        }
                    >
                        <div className="flex flex-col items-center text-[10px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="mercado-match"
                                width="24"
                                height="24"
                                focusable="false"
                            >
                                <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
                            </svg>Message
                        </div>
                    </NavLink>
                </nav>
                <div className="flex items-center space-x-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={profile.profile_photo} alt={profile.name} />
                                    <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-[10px] sm:text-sm font-medium leading-none">{profile.name}</p>
                                    <p className="text-[10px] sm:text-xs leading-none text-gray-500">
                                        @{profile.username}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to={`/profile/${profile.id}`} className="flex-shrink-0 text-[10px] sm:text-sm w-full">Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/logout" className="flex-shrink-0 text-[10px] sm:text-sm w-full">Sign Out
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="lg:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40" align="end" forceMount>
                                <DropdownMenuItem>
                                    {/* Home */}
                                    <NavLink
                                        to="/feed"
                                        className={({ isActive }) =>
                                            `flex flex-col items-center justify-center rounded-md ${isActive ? "text-black" : "text-gray-400"
                                            } hover:text-black`
                                        }
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                data-supported-dps="24x24"
                                                fill="currentColor"
                                                className="mercado-match"
                                                width="16"
                                                height="16"
                                                focusable="false"
                                            >
                                                <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7 5 3.18V2h3v5.09z"></path>
                                            </svg>
                                            Home
                                        </div>
                                    </NavLink>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    {/* Network */}
                                    <NavLink
                                        to={`/connection/list/${profile.id}`}
                                        className={({ isActive }) =>
                                            `flex flex-col items-center justify-center rounded-md ${isActive ? "text-black" : "text-gray-400"
                                            } hover:text-black`
                                        }
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                data-supported-dps="24x24"
                                                fill="currentColor"
                                                className="mercado-match"
                                                width="16"
                                                height="16"
                                                focusable="false"
                                            >
                                                <path d="M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z"></path>
                                            </svg>
                                            Network
                                        </div>
                                    </NavLink>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    {/* Request */}
                                    <NavLink
                                        to="/connection/request"
                                        className={({ isActive }) =>
                                            `flex flex-col items-center justify-center rounded-md ${isActive ? "text-black" : "text-gray-400"
                                            } hover:text-black`
                                        }
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <GitPullRequest className="h-4 w-4" />
                                            Request
                                        </div>
                                    </NavLink>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    {/* Users */}
                                    <NavLink
                                        to="/users"
                                        className={({ isActive }) =>
                                            `flex flex-col items-center justify-center rounded-md ${isActive ? "text-black" : "text-gray-400"
                                            } hover:text-black`
                                        }
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <User className="h-4 w-4" />
                                            User List
                                        </div>
                                    </NavLink>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    {/* Message */}
                                    <NavLink
                                        to="/notification"
                                        className={({ isActive }) =>
                                            `flex flex-col items-center justify-center rounded-md ${isActive ? "text-black" : "text-gray-400"
                                            } hover:text-black`
                                        }
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="mercado-match"
                                                width="16"
                                                height="16"
                                                focusable="false"
                                            >
                                                <path d="M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z"></path>
                                            </svg> Notification
                                        </div>
                                    </NavLink>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    {/* Message */}
                                    <NavLink
                                        to="/chat"
                                        className={({ isActive }) =>
                                            `flex flex-col items-center justify-center rounded-md ${isActive ? "text-black" : "text-gray-400"
                                            } hover:text-black`
                                        }
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" className="mercado-match" width="16" height="16" focusable="false">
                                                <path d="M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z"></path>
                                            </svg>
                                            Messages
                                        </div>
                                    </NavLink>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </>
        );
    };

    return (
        <header className="fixed top-0 left-0 w-full z-10 border-b bg-white">
            <div className="container mx-auto px-8 lg:px-40">
                <div className="flex items-center justify-between lg:gap-20 h-12">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <svg
                                className="text-blue-600 h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </Link>
                        <div className="hidden lg:block ml-6">
                            <div className="flex items-center">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        value={searchQuery}
                                        placeholder="Search"
                                        className="h-8 w-60 pl-10 text-xs placeholder:text-l"
                                        onChange={handleSearch}
                                        onClick={() => navigate(`/users`)}
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {profileHeader(profile, isLoading)}
                </div>
            </div>
        </header>
    );
}
