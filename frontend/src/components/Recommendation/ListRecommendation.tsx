import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Recommendation } from '@/type/Recommendation';
import { ArrowUpRightFromSquare } from 'lucide-react';

interface RecommendationProps {
    profile: Recommendation;
}

export function RecommendationList({ profile }: RecommendationProps) {
    const navigate = useNavigate();

    return (
        <Card className="border-none shadow-none mb-3">
            <CardContent
                className="cursor-pointer text-sm sm:text-lg p-2 sm:flex items-center justify-between"
            >
                <div className="flex items-top space-x-4">
                    <div className="relative inline-block">
                        <Avatar className="w-14 h-14 sm:w-10 sm:h-10 border-4 border-white">
                            <AvatarImage src={profile.profile_photo_path} alt="default" />
                            <AvatarFallback>{(profile.full_name).split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="text-[8px] absolute top-0 right-0 bg-blue-500 text-white font-bold w-6 h-4 rounded-full flex items-center justify-center">
                            {profile.level === 2 ? "2nd" : "3rd"}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-sm sm:text-[12px] font-semibold">{profile.full_name}</h2>
                        {/* <p className="text-[10px] sm:text-[10px] text-gray-500">@{profile.username}</p> */}
                        <Button
                            onClick={() => navigate(`/profile/${profile.id}`)}
                            className="mt-1 text-[10px] sm:text-sm w-full sm:w-auto border-2 border-bluelinkedin text-bluelinkedin bg-white rounded-full hover:bg-bluelinkedin hover:text-white hover:scale-105"
                        >
                            <ArrowUpRightFromSquare size={20} />
                            <span>View Details</span>
                        </Button>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
