import { useEffect, useState } from 'react';
import { ConnectionCard } from '../components/Connection/ConnectionCard'
import { Connection } from '@/type/Connection'
import { Card } from '@/components/ui/card';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import RecommendSidebar from '@/components/Recommendation/Recommendation';
import { useProfile } from '@/context/ProfileContext';
import LoadingPage from '@/components/Loading/Loading';
import ErrorPage from '@/components/Error/ErrorPage';

const ConnectionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<number | null>(null);
    const [access, setAccess] = useState<string>('');
    const [name, setName] = useState<string>('');
    const { refetchProfile } = useProfile()
    const toast = useToast();

    useEffect(() => {
        const fetchConnectionRequest = async () => {
            if (!id) {
                setError("Profile ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    `http://localhost:3000/api/connection/list/${id}`,
                    { withCredentials: true }
                );

                if (response.status === 200 && response.data.success) {
                    const access = response.data.body.access;
                    setAccess(access);
                    const name = response.data.body.name;
                    setName(name);
                    const apiData: Connection[] = response.data.body.listConnection;
                    const mappedData = apiData.map((item) => ({
                        id: item.id,
                        full_name: item.full_name,
                        username: item.username,
                        profile_photo_path: item.profile_photo_path,
                    }));

                    setConnections(mappedData);
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
    }, [id]);

    const handleAction = async (id: string) => {
        try {
            refetchProfile();
            setLoading(true);
            const response = await axios.delete(`http://localhost:3000/api/connection/unconnect/${id}`, {
                withCredentials: true
            })
            if (response.status === 200) {
                setConnections(connections.filter(connections => connections.id !== id));
                toast.toast({
                    title: "Success",
                    description: "unconnect connection",
                    duration: 2000,
                })
            } else {
                toast.toast({
                    title: "Failed",
                    description: "unconnect connection",
                    duration: 2000,
                    variant: "destructive"
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
                        <h1 className="p-4 text-sm sm:text-xl font-semibold text-center">{name}'s Connection</h1>
                        {loading ? (
                            <p className="mb-10 sm:mt-16 text-[10px] sm:text-sm text-center text-muted-foreground">Loading...</p>
                        ) : error ? (
                            <p className="mb-10 sm:mt-16 text-[10px] sm:text-sm text-center text-red-500">{error}</p>
                        ) : connections.length === 0 ? (
                            <p className="mb-10 sm:mt-16 text-[10px] sm:text-sm text-center text-muted-foreground">No connection at the moment.</p>
                        ) : (
                            <ul>
                                {connections.map((connection) => (
                                    <li className="border-none" key={connection.id}>
                                        <ConnectionCard
                                            access={access}
                                            connection={connection}
                                            handleAction={handleAction}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                    <aside className="hidden md:flex">
                        <RecommendSidebar />
                    </aside>
                </div>
            </div>
        )
    };
}

export default ConnectionPage;