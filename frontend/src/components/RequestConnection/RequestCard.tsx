import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ConnectionRequest } from "@/type/ConnectionRequest"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { UserMinus, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface ConnectionRequestCardProps {
    request: ConnectionRequest;
    handleAction: (endpoint: string, method: "post" | "delete", id: string) => void;
}

export function ConnectionRequestCard({ request, handleAction }: ConnectionRequestCardProps) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const renderButton = () => {
        return (
            <div className="flex flex-col space-y-2">
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAction("accept", "post", request.id);
                    }}
                    onMouseEnter={() => {
                        setIsHovered(true);
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false);
                    }}
                    className="text-[10px] sm:text-sm h-8 w-auto border-2 border-bluelinkedin text-bluelinkedin bg-white rounded-full hover:bg-bluelinkedin hover:text-white hover:scale-105"
                >
                    <UserPlus size={20} />
                    <span>Accept</span>
                </Button>
                <Button
                    variant="outline"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAction("reject", "delete", request.id);
                    }}
                    onMouseEnter={() => {
                        setIsHovered(true);
                    }}
                    onMouseLeave={() => {
                        setIsHovered(false);
                    }}
                    className="text-[10px] md:text-sm h-8 w-auto border-2 border-red-500 text-red-500 bg-white rounded-full hover:bg-red-500 hover:text-white hover:scale-105"
                >
                    <UserMinus size={20} />
                    <span>Reject</span>
                </Button>
            </div>
        );
    }

    return (
        <Card className="border-none shadow-none">
            <CardContent
                onClick={() => navigate(`/profile/${request.id}`)}
                className={`cursor-pointer text-sm sm:text-lg p-6 sm:flex items-center justify-between border-t-2 hover:bg-gray-100 ${isHovered ? "hover:bg-transparent" : ""
                    }`}
            >
                <div className="flex items-center space-x-4">
                    <div>
                        <Avatar className="w-14 h-14 sm:w-20 sm:h-20 border-4 border-white">
                            <AvatarImage src={request.profile_photo_path} alt="default" />
                            <AvatarFallback>{(request.full_name).split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h2 className="text-sm sm:text-l font-semibold">{request.full_name}</h2>
                        <p className="text-[10px] sm:text-sm text-gray-500">@{request.username}</p>
                        <p className="text-[10px] sm:text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                {renderButton()}
            </CardContent>
        </Card>
    );
}
