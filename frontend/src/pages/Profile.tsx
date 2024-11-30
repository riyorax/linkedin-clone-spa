import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import Skills from "@/components/Profile/Skills";
import Experience from "@/components/Profile/Experience";

interface ProfileData {
  access: string;
  status_request: string;
  username: string;
  name: string;
  work_history: string;
  skills: string;
  connection_count: number;
  profile_photo: string;
  relevant_posts: string[] | null;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) {
        setError("Profile ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`http://localhost:3000/api/profile/${id}`, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.success) {
          const apiData = response.data.body;

          const mappedData: ProfileData = {
            access: apiData.access || "",
            status_request: apiData.status_request || "",
            username: apiData.username || "",
            name: apiData.name || "",
            work_history: apiData.work_history || "",
            skills: apiData.skills || "",
            connection_count: Number(apiData.connection_count) || 0,
            profile_photo: apiData.profile_photo || "",
            relevant_posts: apiData.relevant_posts || null,
          };

          setProfileData(mappedData);
        } else {
          throw new Error(response.data.message || "Failed to fetch profile data.");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred.";
        console.error("Error fetching profile:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  const renderPage = () => {
    if (loading) {
      return <p>Loading profile...</p>;
    } else if (error) {
      return <p>Error: {error}</p>;
    } else if (!profileData) {
      return <p>Profile not found.</p>;
    } else {
      return (
        <>
          <ProfileInfo
            id={id as string}
            access={profileData.access}
            status_request={profileData.status_request}
            name={profileData.name}
            username={profileData.username}
            profile_photo={profileData.profile_photo}
            connection_count={profileData.connection_count}
          />
          <Experience experience={profileData.work_history} />
          <Skills skills={profileData.skills} />
        </>
      );
    }
  };

  return (
    <div className="container mx-auto px-8 lg:px-60 space-y-2">
      {renderPage()}
    </div>
  );
};

export default ProfilePage;