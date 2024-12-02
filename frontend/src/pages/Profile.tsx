import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import Skills from "@/components/Profile/Skills";
import Experience from "@/components/Profile/Experience";
import FeedCard from "@/components/Feed/FeedCard"
import { Card, CardContent } from "@/components/ui/card";
import { PenBox } from "lucide-react";

interface Feed {
  id: number;
  content: string;
}

interface ProfileData {
  access: string;
  status_request: string;
  username: string;
  name: string;
  work_history: string;
  skills: string;
  connection_count: number;
  profile_photo: string;
  relevant_posts: Feed[];
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
  }, [id, profileData?.connection_count]);

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
          {profileData.access !== "public" &&
            <Card className="overflow-hidden shadow-none border-gray-300 border my-1">
              <CardContent className="p-4 sm:p-6 space-y-5">
                <h3 className="text-sm sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                  <PenBox size={20} className="mr-2" />
                  <span>10 Latest Feeds</span>
                </h3>
                {profileData.relevant_posts && profileData.relevant_posts.length > 0 ? (
                  profileData.relevant_posts.map((feed) => (
                    <FeedCard
                      key={feed.id}
                      user_name={profileData.name}
                      user_profile={profileData.profile_photo}
                      content={feed.content}
                    />
                  ))
                ) : (
                  <p className="text-[12px] sm:text-sm">No feeds listed yet.</p>
                )}
              </CardContent>
            </Card>
          }
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