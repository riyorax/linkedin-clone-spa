import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';

interface ProfileProps {
  full_name: string;
  email: string;
  username: string;
  profile_photo_path: string;
}

const Profile: React.FC<ProfileProps> = ({ full_name, email, username, profile_photo_path }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="200" fill="none">
          <rect width="1200" height="1200" fill="#EAEAEA" rx="3" />
        </svg>
      </div>
      <CardContent className="relative pt-20 pb-4">
        <Avatar className="absolute -top-16 left-4 w-32 h-32 border-4 border-white">
          <AvatarImage src={profile_photo_path} alt={full_name} />
          <AvatarFallback>{full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{full_name}</h2>
            <p className="text-xl text-muted-foreground">{email}</p>
            <div className="flex items-center text-muted-foreground">
              <MapPin size={16} className="mr-1" />
              <span>{username}</span>
            </div>
          </div>
          <Button>Connect</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;

