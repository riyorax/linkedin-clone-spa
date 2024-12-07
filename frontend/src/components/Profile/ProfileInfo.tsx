import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, LogIn, UserMinus, UserPlus, Timer } from "lucide-react";
import { EditProfileModal } from "./EditProfileModal";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ProfileData } from "@/type/Profile";
import ErrorPage from "../Error/ErrorPage";

interface ProfileProps {
  id: string;
  access: string;
  status_request: string;
  name: string;
  username: string;
  profile_photo: string;
  connection_count: number;
  work_history: string;
  skills: string;
  onProfileUpdate: (updatedData: Partial<ProfileData>) => void;
}

const ProfileInfo: React.FC<ProfileProps> = ({ id, access, status_request, name, username, profile_photo, work_history, skills, connection_count, onProfileUpdate }) => {
  const [acc, setAcc] = useState(access);
  const [status, setStatus] = useState(status_request);
  const [error, setError] = useState<string | null>(null);
  const [respStatus, setRespStatus] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleAction = async (
    endpoint: string,
    method: "post" | "delete",
    newAcc: string,
    newStatus: string
  ) => {
    try {
      const url = `http://localhost:3000/api/connection/${endpoint}/${id}`;
      const response = method === "post" ? await axios.post(url, {}, { withCredentials: true }) : await axios.delete(url, { withCredentials: true });
      if (response.status === 200) {
        setAcc(newAcc);
        setStatus(newStatus);
        if (endpoint === "unconnect") {
          onProfileUpdate({ connection_count: connection_count - 1 })
        }
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

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const buttonStyles = {
    default: "w-full sm:w-auto border-2 border-bluelinkedin text-bluelinkedin bg-white rounded-full hover:bg-bluelinkedin hover:text-white hover:scale-105",
    pending: "w-full sm:w-auto text-white bg-bluelinkedin rounded-full cursor-not-allowed hover:bg-bluehover",
    reject: "w-full sm:w-auto border-2 border-red-500 text-red-500 bg-white rounded-full hover:bg-red-500 hover:text-white hover:scale-105",
  };

  const renderButton = () => {
    if (status === "pending") {
      return (
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button className={buttonStyles.default} onClick={() => handleAction("accept", "post", "connected", "")}>
            <UserPlus size={20} />
            <span>Accept</span>
          </Button>
          <Button className={buttonStyles.reject} onClick={() => handleAction("reject", "delete", "unconnected", "")}>
            <UserMinus size={20} />
            <span>Reject</span>
          </Button>
        </div>
      );
    } else if (status === "sent") {
      return (
        <>
          <Button className={buttonStyles.pending} disabled>
            <Timer size={20} />
            <span>Pending</span>
          </Button>
        </>
      );
    }

    switch (acc) {
      case "owner":
        return (
          <>
            <Button className={buttonStyles.default} onClick={handleEdit}>
              <Edit size={20} />
              <span>Edit</span>
            </Button>
          </>
        );
      case "public":
        return (
          <>
            <Button className={buttonStyles.default} onClick={() => navigate("/login")}>
              <LogIn size={20} />
              <span>Login To Connect</span>
            </Button>
          </>
        );
      case "connected":
        return (
          <>
            <Button className={buttonStyles.default} onClick={() => handleAction("unconnect", "delete", "unconnected", "")}>
              <UserMinus size={20} />
              <span>Unconnect</span>
            </Button>
          </>
        );
      default:
        return (
          <>
            <Button className={buttonStyles.default} onClick={() => handleAction("request", "post", "unconnected", "sent")}>
              <UserPlus size={20} />
              <span>Connect</span>
            </Button>
          </>
        );
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
      <>
        <Card className="overflow-hidden shadow-none border-gray-300 border">
          <div className="relative h-32 sm:h-48">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none">
              <rect width="100%" height="100%" fill="#EAEAEA" rx="3" />
            </svg>
          </div>
          <CardContent className="relative pt-16 sm:pt-20 pb-4">
            <Avatar className="absolute -top-12 sm:-top-16 left-4 w-24 h-24 sm:w-32 sm:h-32 border-4 border-white">
              <AvatarImage src={profile_photo} alt={name} />
              <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="space-y-1 mb-4 sm:mb-0">
                <h2 className="text-sm sm:text-xl font-bold">{name}</h2>
                <div className="flex items-center text-muted-foreground text-gray-500 text-[12px] sm:text-sm">
                  <span>@{username}</span>
                </div>
                <div className="flex items-center text-bluelinkedin font-semibold text-[12px] sm:text-sm">
                  <Link to={`/connection/list/${id}`} className="text-bluelinkedin hover:text-bluehover hover:scale-105">
                    {connection_count} connections
                  </Link>
                </div>
              </div>
              {renderButton()}
            </div>
          </CardContent>
        </Card>
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userId={id}
          initialData={{
            username: username,
            name: name,
            workHistory: work_history,
            skills: skills,
            profile_photo:
              profile_photo !== "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Sample_User_Icon.png/120px-Sample_User_Icon.png"
                ? profile_photo
                : undefined,
          }}
          onProfileUpdate={onProfileUpdate}
        />
      </>
    )
  };
};

export default ProfileInfo;
