import { Connection } from "@/type/Connection"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Mail, UserMinus } from "lucide-react";
import { useState } from "react";

interface ConnectionCardProps {
    access: string;
    connection: Connection;
    handleAction: (id: string) => void;
}

export function ConnectionCard({ access, connection, handleAction }: ConnectionCardProps) {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const renderButton = () => {
        if (access === "owner") {
            return (
                <>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/`);
                        }}
                        onMouseEnter={() => {
                            setIsHovered(true); 
                        }}
                        onMouseLeave={() => {
                            setIsHovered(false);
                        }}
                        className="text-[10px] sm:text-sm h-4 sm:h-8 w-full sm:w-auto border-2 border-bluelinkedin text-bluelinkedin bg-white rounded-full hover:bg-bluelinkedin hover:text-white hover:scale-105"
                    >
                        <Mail size={20} />
                        <span>Message</span>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction(connection.id);
                        }}
                        onMouseEnter={() => {
                            setIsHovered(true); 
                        }}
                        onMouseLeave={() => {
                            setIsHovered(false);
                        }}
                        className="text-[10px] sm:text-sm h-4 sm:h-8 w-full sm:w-auto border-2 border-red-500 text-red-500 bg-white rounded-full hover:bg-red-500 hover:text-white hover:scale-105"
                    >
                        <UserMinus size={20} />
                        <span>Unconnect</span>
                    </Button>
                </>
            );
        }
    }

    return (
        <Card className="border-none shadow-none">
            <CardContent
                onClick={() => navigate(`/profile/${connection.id}`)}
                className={`cursor-pointer text-sm sm:text-lg p-4 sm:flex items-center justify-between border-t-2 hover:bg-gray-100 ${
                    isHovered ? "hover:bg-transparent" : ""
                }`}
            >
                <div className="flex items-center space-x-4">
                    <div>
                        <Avatar className="w-14 h-14 sm:w-20 sm:h-20 border-4 border-white">
                            <AvatarImage src={connection.profile_photo} alt="default" />
                            <AvatarFallback>{(connection.full_name).split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h2 className="text-sm sm:text-l font-semibold">{connection.full_name}</h2>
                        <p className="text-[10px] sm:text-sm text-gray-500">@{connection.username}</p>
                    </div>
                </div>

                <div className="mt-4 flex space-x-2">
                    {renderButton()}
                </div>
            </CardContent>
        </Card>
    );
}
