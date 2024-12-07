import { Card, CardContent } from "@/components/ui/card";
import { Recommendation } from "@/type/Recommendation";
import { useEffect, useState } from "react";
import axios from "axios";
import { RecommendationList } from "./ListRecommendation";

const RecommendSidebar = () => {
    const [recommendation, setRecommendation] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get<{ success: boolean; message: string; body: { recommendation: Recommendation[] } }>(
                    `http://localhost:3000/api/connection/recommendation`,
                    { withCredentials: true }
                );

                if (response.status === 200 && response.data.success) {
                    const apiData = response.data.body.recommendation;
                    const mappedData = apiData.map((item) => ({
                        level: item.level,
                        id: item.id,
                        full_name: item.full_name,
                        username: item.username,
                        profile_photo_path: item.profile_photo_path,
                    }));
                    setRecommendation(mappedData);
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

        fetchRecommendations();
    }, []);

    return (
        <Card className="overflow-hidden border-gray-300 border w-[225px]">
            <CardContent className="relative p-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-sm sm:text-xl font-semibold text-center my-2.5">Recommendations</h1>
                        {loading ? (
                            <p className="mb-10 sm:mt-16 text-[10px] sm:text-sm text-center text-muted-foreground">Loading...</p>
                        ) : error ? (
                            <p className="mb-10 sm:mt-16 text-[10px] sm:text-sm text-center text-red-500">{error}</p>
                        ) : recommendation.length === 0 ? (
                            <p className="mb-10 sm:mt-16 text-[10px] sm:text-sm text-center text-muted-foreground">No connection recommendation at the moment.</p>
                        ) : (
                            <>
                                <p className="text-sm text-gray-500 py-2.5">Here is recommendation for you</p>
                                <ul>
                                    {recommendation.map((profile) => (
                                        <li className="border-none" key={profile.id}>
                                            <RecommendationList
                                                profile={profile}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecommendSidebar;
