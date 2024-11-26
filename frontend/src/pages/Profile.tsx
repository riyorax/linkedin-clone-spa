import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import Skills from "@/components/Profile/Skills";
import Experience from "@/components/Profile/Experience";

interface ProfileData {
  id: string;
  username: string;
  full_name: string;
  email: string;
  work_history: { role: string; company: string; duration: string }[] | null;
  skills: string[] | null;
  profile_photo_path: string;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/profile/${id}`);
        const apiData = response.data.data;

        const mappedData: ProfileData = {
          id: apiData.id,
          username: apiData.username,
          full_name: apiData.full_name,
          email: apiData.email,
          work_history: apiData.work_history || [],
          skills: apiData.skills || [],
          profile_photo_path: apiData.profile_photo_path,
        };

        setProfileData(mappedData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profileData) {
    return <p>Profile not found</p>;
  }

  return (
    <div className="mx-auto px-8 lg:px-60 space-y-6">
      <ProfileInfo
        full_name={profileData.full_name}
        email={profileData.email}
        username={profileData.username}
        profile_photo_path={profileData.profile_photo_path}
      />
      {profileData.work_history && <Experience work_history={profileData.work_history} />}
      {profileData.skills && <Skills skills={profileData.skills} />}
    </div>
  );
};

export default ProfilePage;

