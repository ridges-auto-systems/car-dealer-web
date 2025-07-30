// src/components/ui/LoadingAnimation.tsx
import React from "react";
import { Car } from "lucide-react";

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-64 h-12 bg-gray-200 rounded-lg overflow-hidden">
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 animate-moveCar">
          <Car className="h-8 w-8 text-red-600" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
          <div className="absolute top-0 left-0 right-0 h-full bg-gray-400 animate-roadLine"></div>
        </div>
      </div>
      <p className="text-gray-600">Loading your data...</p>
    </div>
  );
};

export default LoadingAnimation;
