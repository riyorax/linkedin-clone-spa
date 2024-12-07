import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ConnectionRequest } from "@/type/ConnectionRequest"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface ConnectionRequestCardProps {
    request: ConnectionRequest;
    handleAction: (endpoint: string, method: "post" | "delete", id: string) => void;
}

export function ConnectionRequestCard({ request, handleAction }: ConnectionRequestCardProps) {
    const navigate = useNavigate();

    return (
        <Card className="border-none shadow-none">
            <CardContent 
            onClick={() => navigate(`/profile/${request.id}`)}
            className="cursor-pointer text-sm sm:text-lg p-4 sm:flex items-center justify-between border-t-2 hover:bg-gray-100"
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

                <div className="mt-4 flex space-x-2">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation(); 
                            handleAction("accept", "post", request.id);
                        }}
                        className="text-[10px] sm:text-sm h-4 sm:h-8 w-full sm:w-auto border-2 border-bluelinkedin text-bluelinkedin bg-white rounded-full hover:bg-bluelinkedin hover:text-white hover:scale-105"
                    >
                        Accept
                    </Button>
                    <Button
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation(); 
                            handleAction("reject", "delete", request.id);
                        }}
                        className="text-[10px] sm:text-sm h-4 sm:h-8 w-full sm:w-auto border-2 border-red-500 text-red-500 bg-white rounded-full hover:bg-red-500 hover:text-white hover:scale-105"
                    >
                        Reject
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
