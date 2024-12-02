import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

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
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        refetchProfile: fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
