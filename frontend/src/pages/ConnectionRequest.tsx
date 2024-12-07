import { useEffect, useState } from 'react';
import { ConnectionRequestCard } from '../components/RequestConnection/RequestCard'
import { ConnectionRequest } from '@/type/ConnectionRequest'
import { Card } from '@/components/ui/card';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import RecommendSidebar from '@/components/Recommendation/Recommendation';
import LoadingPage from '@/components/Loading/Loading';
import ErrorPage from '@/components/Error/ErrorPage';

const ConnectionRequestPage: React.FC = () => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
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
          setError("Internal server error: Data retrieval failed.");
        }
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          setStatus(e.response.status);
          const message = e.response.data.message || "An error occurred";
          setError(message);
        } else {
          setError((e as Error).message);
        }
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
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        setStatus(e.response.status);
        const message = e.response.data.message || "An error occurred";
        setError(message);
      } else {
        setError((e as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingPage />
    )
  } else if (error) {
    return (
      <ErrorPage
        statusCode={status || 500}
        message={error}
        description=""
      />
    );
  } else {
    return (
      <div className="container mx-auto px-8 lg:px-40 space-y-2">
        <div className="flex justify-between space-x-2">
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
          <aside className="hidden md:block">
            <RecommendSidebar />
          </aside>
        </div>
      </div>
    )
  };
}

export default ConnectionRequestPage;