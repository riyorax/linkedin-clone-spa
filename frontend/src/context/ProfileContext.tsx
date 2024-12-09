import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface Profile {
  id: number;
  name: string;
  username: string;
  profile_photo: string;
}

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  refetchProfile: () => void;
  socket: Socket | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

let socketInstance: Socket | null = null;

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/api/self/profile", {
        withCredentials: true,
      });
      setProfile(response.data.body);

      // Establish or reuse socket connection
      if (!socketInstance) {
        socketInstance = io("http://localhost:3000", {
          query: { userId: response.data.body.id },
          withCredentials: true,
        });

        // Handle socket events
        socketInstance.on("connect", () => {
          console.log("Socket connected:", socketInstance?.id);
        });

        socketInstance.on("disconnect", () => {
          console.log("Socket disconnected");
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile or connect socket:", error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
      }
    };
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        refetchProfile: fetchProfile,
        socket: socketInstance,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
