import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import { Profile } from "@/type/Profile";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";

interface ProfileSidebarProps {
  profile: Profile | null;
  isLoading: boolean;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profile, isLoading }) => {
  const navigate = useNavigate();
  const handleNavigate = (id: number) => {
    navigate(`/profile/${id}`);
  };

  if (!profile || isLoading) {
    return (
      <Card className="overflow-hidden border-gray-300 border w-[225px]">
        <div className="p-4 justify-between items-start space-y-6">
          <p className="text-sm text-gray-500">Connect with more people now!</p>
        <Button className="w-full sm:w-auto border-2 border-bluelinkedin text-bluelinkedin bg-white rounded-full hover:bg-bluelinkedin hover:text-white hover:scale-105" onClick={() => navigate("/login")}>
          <LogIn size={20} />
          <span>Login To Connect</span>
        </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-gray-300 border w-[225px]">
      <div className="relative h-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="58" fill="none">
          <rect width="1200" height="1200" fill="#EAEAEA" rx="3" />
        </svg>
      </div>
      <CardContent className="cursor-pointer relative pt-10 pb-4" onClick={() => handleNavigate(profile?.id)}>
        <Avatar className="absolute -top-12 left-6 w-20 h-20 border-4 border-white shadow-md">
          <AvatarImage src={profile.profile_photo} alt={profile.name} />
          <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font text-xl font-semibold">{profile.name}</h2>
            <div className="text-sm text-gray-500 flex items-center text-muted-foreground">
              @{profile.username}
            </div>
            <p className="pt-10 text-sm text-gray-500">Connect with more people now!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSidebar;
