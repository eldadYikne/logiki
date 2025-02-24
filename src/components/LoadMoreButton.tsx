import { useState } from "react";

const LoadMoreButton = ({ loadMore }: { loadMore: () => void }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    loadMore();
    setTimeout(() => setLoading(false), 1000); // Simulate load time
  };

  return (
    <div className="flex w-full justify-center">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center justify-center px-4 w-1/2 py-2  bg-blue-600 text-white rounded-md shadow-md transition-all 
      hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
        ) : (
          "Load More"
        )}
      </button>
    </div>
  );
};

export default LoadMoreButton;
