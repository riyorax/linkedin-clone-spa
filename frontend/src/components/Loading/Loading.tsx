import { Card, CardContent } from '../ui/card';

const LoadingPage = () => {
    return (
        <div className="container mx-auto py-20 px-8 lg:px-40 mx-auto flex flex-col items-center justify-center space-y-6">
            <Card className="overflow-hidden w-full max-w-md bg-transparant border-none shadow-none rounded-lg">
                <CardContent className="space-y-6">
                        <div className="text-center space-y-6">
                            <p className="text-[12px] sm:text-sm">Loading...</p>
                        </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoadingPage;
