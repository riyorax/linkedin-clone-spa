import { Link, NavLink } from "react-router-dom";
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
  Home,
  Users,
  List,
  Network,
  MessageSquare,
  Search,
  Menu,
} from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Profile {
  name: string;
  username: string;
  profile_photo: string;
  id: number;
}
const fetchSelfProfile = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/self/profile", {
      withCredentials: true,
    });
    return response.data.body;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

export function Header() {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchSelfProfile,
  });

  const profileHeader = (profile: Profile | null, isLoading: boolean) => {
    if (!profile || isLoading) {
      return (
        <div className="flex items-center space-x-2">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button
              size="sm"
              className="bg-bluelinkedin rounded-full hover:bg-bluehover hover:text-white"
            >
              Join now
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.profile_photo} alt="@shadcn" />
                <AvatarFallback>Loading</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.name}
                </p>
                <p
                  className="text-xs leading-none text-muted-foreground"
                  color="gray"
                >
                  @{profile?.username}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/profile/${profile?.id}" className="flex-shrink-0">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/logout" className="flex-shrink-0">
                Sign Out
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
                <Home className="mr-2 h-3 lg:h-5 w-3 lg:w-5" />
                Home
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-5 w-5" />
                Users
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Network className="mr-2 h-5 w-5" />
                Request
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-5 w-5" />
                Messages
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full z-10 border-b bg-white">
      <div className="container mx-auto px-8 lg:px-60">
        <div className="flex items-center justify-between lg:gap-20 h-12">
          {/* Logo and Search */}
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
                    placeholder="Search"
                    className="h-8 w-60 pl-10 text-xs placeholder:text-l"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-2">
            <NavLink
              to="/"
              className="flex-shrink-0 hover:bg-gray-200 p-2 rounded-md"
            >
              <Home className="h-5 w-5" color="gray" />
            </NavLink>
            <NavLink
              to="/"
              className="flex-shrink-0 hover:bg-gray-200 p-2 rounded-md"
            >
              <Users className="h-5 w-5" color="gray" />
            </NavLink>
            <NavLink
              to="/"
              className="flex-shrink-0 hover:bg-gray-200 p-2 rounded-md"
            >
              <List className="h-5 w-5" color="gray" />
            </NavLink>
            <NavLink
              to="/"
              className="flex-shrink-0 hover:bg-gray-200 p-2 rounded-md"
            >
              <Network className="h-5 w-5" color="gray" />
            </NavLink>
            <NavLink
              to="/"
              className="flex-shrink-0 hover:bg-gray-200 p-2 rounded-md"
            >
              <MessageSquare className="h-5 w-5" color="gray" />
            </NavLink>
          </nav>

          {/* Profile & Mobile Menu */}
          {profileHeader(profile, profileLoading)}
        </div>
      </div>
    </header>
  );
}
