import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Mail, Timer, UserMinus, UserPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import ErrorPage from "../Error/ErrorPage";

interface Profile {
    access: string;
    id: number;
    profile_photo: string;
    name: string;
    username: string;
    status_request: string;
}

export const ListUserCard: React.FC<Profile> = ({ access, id, profile_photo, name, username, status_request }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [status, setStatus] = useState(status_request);
    const [error, setError] = useState<string | null>(null);
    const [respStatus, setRespStatus] = useState<number | null>(null);
    const toast = useToast();

    const handleAction = async (
        endpoint: string,
        method: "post" | "delete",
        newStatus: string
    ) => {
        try {
            const url = `http://localhost:3000/api/connection/${endpoint}/${id}`;
            const response = method === "post" ? await axios.post(url, {}, { withCredentials: true }) : await axios.delete(url, { withCredentials: true });
            if (response.status === 200) {
                setStatus(newStatus);
                toast.toast({
                    title: `Success`,
                    description: `${endpoint} connection`,
                    duration: 2000,
                })
            } else {
                toast.toast({
                    title: `Failed`,
                    description: `${endpoint} connection`,
                    duration: 2000,
                })
            }
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                setRespStatus(e.response.status);
                const message = e.response.data.message || "An error occurred";
                setError(message);
            } else {
                setError((e as Error).message);
            }
        }
    };

    const renderButton = () => {
        switch (status) {
            case "pending":
                return (
                    <div className="flex flex-col space-y-2">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAction("accept", "post", "connected");
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
                                handleAction("reject", "delete", "unconnected")
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
            case "sent":
                return (
                    <div className="flex flex-col space-y-2">
                        <Button
                            className="w-full sm:w-auto text-white bg-bluelinkedin rounded-full cursor-not-allowed hover:bg-bluehover"
                            onMouseEnter={() => {
                                setIsHovered(true);
                            }}
                            onMouseLeave={() => {
                                setIsHovered(false);
                            }}
                            disabled
                        >
                            <Timer size={20} />
                            <span>Pending</span>
                        </Button>
                    </div>
                );
            case "connected":
                return (
                    <div className="flex flex-col space-y-2">
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
                            className="text-[10px] sm:text-sm h-8 w-auto border-2 border-bluelinkedin text-bluelinkedin bg-white rounded-full hover:bg-bluelinkedin hover:text-white hover:scale-105"
                        >
                            <Mail size={20} />
                            <span>Message</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAction("unconnect", "delete", "unconnected")
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
                            <span>Unconnect</span>
                        </Button>
                    </div>
                );
            case "unconnected":
                return (
                    <div className="flex flex-col space-y-2">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAction("request", "post", "sent");
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
                            <span>Connect</span>
                        </Button>
                    </div>
                );
            default:
                return (
                    <></>
                )
        }
    };

    if (error) {
        return (
            <ErrorPage
                statusCode={respStatus || 500}
                message={error}
                description=""
            />
        );
    } else {
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
                        </div>
                    </div>
                    {access !== "public" &&
                        renderButton()
                    }
                </CardContent>
            </Card>
        );
    }
}
