import { Loader2 } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-900">
      <Loader2 className="h-16 w-16 animate-spin text-green-200" />
      <p className="mt-4 text-lg font-semibold text-green-200">Loading...</p>
    </div>
  );
};

export default LoadingPage;
