import { Loader2 } from "lucide-react";
import { LoadingPickle } from "../LoadingPickle";

const LoadingPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-900">
      <Loader2 className="h-16 w-16 animate-spin text-green-200" />
      <LoadingPickle />
    </div>
  );
};

export default LoadingPage;
