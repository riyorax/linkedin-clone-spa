import { useEffect, useState } from 'react';
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import { ConnectionCard } from '../components/Connection/ConnectionCard'
import { Connection } from '@/type/Connection'
import { Card } from '@/components/ui/card';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/hooks/use-toast';

const ConnectionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [access, setAccess] = useState<string>('');
    const { profile, isLoading } = useProfile();
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
                    const apiData: Connection[] = response.data.body.listConnection;
                    const mappedData = apiData.map((item) => ({
                        id: item.id,
                        full_name: item.full_name || "Unknown",
                        username: item.username,
                        profile_photo: item.profile_photo,
                    }));

                    setConnections(mappedData);
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
    }, [id]);

    const handleAction = async (id: string) => {
        try {
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
                })
            }
        } catch (error) {
            console.error(`Error during unconnect action:`, error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-8 lg:px-40 space-y-2">
            <div className="flex justify-between">
                <aside className="hidden sm:block mr-2">
                    <ProfileSidebar
                        profile={profile}
                        isLoading={isLoading}
                    />
                </aside>
                <Card className="border-gray-300 w-full text-bluelinkedin overflow-hidden">
                    <h1 className="p-4 text-sm sm:text-xl font-semibold text-center">Connection</h1>
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
            </div>
        </div>
    );
}

export default ConnectionPage;