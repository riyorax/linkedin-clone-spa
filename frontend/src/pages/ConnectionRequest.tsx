import { useEffect, useState } from 'react';
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import { ConnectionRequestCard } from '../components/RequestConnection/RequestCard'
import { ConnectionRequest } from '@/type/ConnectionRequest'
import { Card } from '@/components/ui/card';
import axios from 'axios';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/hooks/use-toast';

const ConnectionRequestPage: React.FC = () => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile, isLoading } = useProfile();
  const toast = useToast();

  useEffect(() => {
    const fetchConnectionRequest = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<{ success: boolean; message: string; body: { listConnRequest: ConnectionRequest[] } }>(
          `http://localhost:3000/api/connection/request`,
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.success) {
          const apiData = response.data.body.listConnRequest;
          const mappedData = apiData.map((item) => ({
            id: item.id,
            full_name: item.full_name,      
            username: item.username,
            profile_photo_path: item.profile_photo_path,
            created_at: item.created_at,      
          }));          
          setRequests(mappedData);
        } else {
          throw new Error(response.data.message || "Failed to fetch connection requests.");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        console.error("Error fetching connection requests:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchConnectionRequest();
  }, []);

  const handleAction = async (
    endpoint: string,
    method: "post" | "delete",
    id: string,
  ) => {
    try {
      setLoading(true);
      const url = `http://localhost:3000/api/connection/${endpoint}/${id}`;
      const response = method === "post" ? await axios.post(url, {}, { withCredentials: true }) : await axios.delete(url, { withCredentials: true });
      if (response.status === 200) {
        setRequests(requests.filter(request => request.id !== id));
        toast.toast({
          title: "Success",
          description: `${endpoint} connection`,
          duration: 2000,
        })
      } else {
        toast.toast({
          title: "Failed",
          description: `${endpoint} connection`,
          duration: 2000,
        })
      }
    } catch (error) {
      console.error(`Error during ${endpoint} action:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-8 lg:px-60 space-y-2">
      <div className="flex justify-between">
        <aside className="hidden sm:block mr-2">
          <ProfileSidebar
            profile={profile}
            isLoading={isLoading}
          />
        </aside>
        <Card className="border-gray-300 w-full text-bluelinkedin overflow-hidden">
          <h1 className="p-4 text-sm sm:text-xl font-semibold text-center">Connection Request</h1>
          {loading ? (
            <p className="mb-10 sm:mt-16 text-[10px] sm:text-sm text-center text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="mb-10 sm:mt-16 text-[10px] sm:text-sm text-center text-red-500">{error}</p>
          ) : requests.length === 0 ? (
            <p className="mb-10 sm:mt-16 text-[10px] sm:text-sm text-center text-muted-foreground">No connection requests at the moment.</p>
          ) : (
            <ul>
              {requests.map((request) => (
                <li className="border-none" key={request.id}>
                  <ConnectionRequestCard
                    request={request}
                    handleAction={handleAction}
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ConnectionRequestPage;