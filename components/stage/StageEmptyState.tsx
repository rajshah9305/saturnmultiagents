import React from 'react';
import * as Icons from '../icons';

const StageEmptyState = () => (
    <div className="w-full h-full flex items-center justify-center text-neural-gray-700">
        <div className="text-center p-8">
            <div className="relative inline-block">
                <Icons.Network className="w-20 h-20 mx-auto text-neural-gray-800" />
                <Icons.Sparkles className="w-8 h-8 absolute top-0 right-0 text-ai-blue-primary animate-quantum-pulse" />
            </div>
            <p className="mt-6 text-xl font-bold text-neural-gray-800">AI Component Stage</p>
            <p className="text-neural-gray-500">Describe a component and select a Style DNA to begin.</p>
        </div>
    </div>
);

export default StageEmptyState;
