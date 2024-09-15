// components/SkeletonCard.tsx
export default function SkeletonCard() {
    return (
      <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden animate-pulse">
        <div className="bg-gray-700 h-48 w-full"></div>
        <div className="p-6">
          <div className="bg-gray-700 h-6 w-3/4 mb-4"></div>
          <div className="bg-gray-700 h-4 w-1/2 mb-4"></div>
          <div className="bg-gray-700 h-4 w-3/4 mb-6"></div>
          <div className="bg-gray-700 h-4 w-1/2"></div>
        </div>
      </div>
    );
  }
  