import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AtSign } from 'lucide-react';
interface ProfileProps {
    full_name: string;
    email: string;
    username: string;
    profile_photo_path: string;
  }
  

const ProfileSidebar: React.FC<ProfileProps> = ({ full_name, email, username, profile_photo_path }) => {
    return (
        <Card className="overflow-hidden border-gray-300 border mx-5 max-w-[225px]">
          <div className="relative h-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="58" fill="none">
              <rect width="1200" height="1200" fill="#EAEAEA" rx="3" />
            </svg>
          </div>
          <CardContent className="relative pt-10 pb-4">
            <Avatar className="absolute -top-12 left-6 w-20 h-20 border-4 border-white shadow-md">
              <AvatarImage src={profile_photo_path} alt={full_name} />
              <AvatarFallback>{full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="font text-xl font-semibold">{full_name}</h2>
                <p className="text-base text-muted-foreground">{email}</p>
                <div className="flex items-center text text-muted-foreground">
                    <AtSign size={16} className="mr-1" />
                  <span>{username}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
}

export default ProfileSidebar;