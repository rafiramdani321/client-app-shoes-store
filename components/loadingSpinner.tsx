import React from "react";

const LoadingSpinner = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[9999]">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
};

export default LoadingSpinner;
