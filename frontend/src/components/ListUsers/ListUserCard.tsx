import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ArrowUpRightFromSquareIcon } from "lucide-react";
import { useState } from "react";

interface Profile {
    access: string;
    id: number;
    profile_photo: string;
    name: string;
    username: string;
    status: string;
}

export const ListUserCard: React.FC<Profile> = ({ access, id, profile_photo, name, username, status }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card className="border-none shadow-none">
            <CardContent
                onClick={() => navigate(`/profile/${id}`)}
                className={`cursor-pointer text-sm sm:text-lg p-4 sm:flex items-center justify-between border-t-2 hover:bg-gray-100 ${isHovered ? "hover:bg-transparent" : ""
                    }`}
            >
                <div className="flex items-center space-x-4">
                    <div>
                        <Avatar className="w-14 h-14 sm:w-20 sm:h-20 border-4 border-white">
                            <AvatarImage src={profile_photo} alt="default" />
                            <AvatarFallback>{(name).split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h2 className="text-sm sm:text-l font-semibold">{name}</h2>
                        <p className="text-[10px] sm:text-sm text-gray-500">@{username}</p>
                        <p className="text-[10px] sm:text-sm text-gray-500">@{status}</p>
                    </div>
                </div>

                <div className="mt-4 flex space-x-2">
                    {access !== "public" &&
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/profile/${id}`);
                            }}
                            onMouseEnter={() => {
                                setIsHovered(true);
                            }}
                            onMouseLeave={() => {
                                setIsHovered(false);
                            }}
                            className="text-[10px] sm:text-sm h-4 sm:h-8 w-full sm:w-auto border-2 border-bluelinkedin text-bluelinkedin bg-white rounded-full hover:bg-bluelinkedin hover:text-white hover:scale-105"
                        >
                            <ArrowUpRightFromSquareIcon size={20} />
                            <span>Message</span>
                        </Button>
                    }
                </div>
            </CardContent>
        </Card>
    );
}
