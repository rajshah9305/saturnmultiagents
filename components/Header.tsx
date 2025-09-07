import React from 'react';
import * as Icons from './icons';

const Header = () => (
    <header className="h-[64px] bg-neural-gray-900/80 backdrop-blur-sm border-b border-neural-gray-700/50 flex items-center justify-between px-6 z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
            <Icons.Network className="w-7 h-7 text-ai-blue-primary" />
            <div>
                <h1 className="text-xl font-bold text-quantum-white">Enterprise AI</h1>
                <p className="text-sm text-neural-gray-200 -mt-1">UI Component Generation Studio</p>
            </div>
        </div>
    </header>
);

export default Header;
