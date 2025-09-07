import React from 'react';
import * as Icons from './icons';

const Header = () => (
    <header className="h-[64px] bg-neural-gray-900/80 backdrop-blur-sm border-b border-neural-gray-700/50 flex items-center justify-between px-6 z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-neural-gray-800 rounded-lg border border-neural-gray-700">
                <Icons.Network className="w-6 h-6 text-ai-blue-primary" />
            </div>
            <div>
                 <h1 className="text-xl font-black">
                    <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--ai-glow)' }}>
                        Enterprise AI
                    </span>
                </h1>
                <p className="text-sm text-neural-gray-300 -mt-1">UI Component Generation Studio</p>
            </div>
        </div>
    </header>
);

export default Header;