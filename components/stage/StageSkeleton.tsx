import React from 'react';

const StageSkeleton = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full p-4">
            <div className="w-full h-full bg-neural-gray-200 rounded-lg animate-pulse-bg">
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-neural-gray-500">
                         <svg className="animate-spin mx-auto h-10 w-10 text-neural-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 font-semibold">AI team is generating variants...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default StageSkeleton;
