export const DummyCard = () => (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-700"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-600 mb-2"></div>
        <div className="h-4 bg-gray-500 mb-4"></div>
        <div className="h-4 bg-gray-500 mb-6"></div>
        <div className="h-4 bg-gray-600"></div>
      </div>
    </div>
  );
  


export  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
        <div className="h-6 bg-gray-600 rounded w-1/2"></div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="mb-4">
          <div className="h-10 bg-gray-700 rounded-md mb-2"></div>
          <div className="pl-4 space-y-2">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="h-16 bg-gray-750 rounded-md"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  