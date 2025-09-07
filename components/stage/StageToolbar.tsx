import React from 'react';
import { Variant } from '../../types';
import * as Icons from '../icons';

type StageTab = 'Preview' | 'Code' | 'Metrics';
type Viewport = 'mobile' | 'tablet' | 'desktop';

interface StageToolbarProps {
    variants: Variant[];
    selectedVariantId: string | null;
    setSelectedVariantId: (id: string) => void;
    activeTab: StageTab;
    setActiveTab: (tab: StageTab) => void;
    viewport: Viewport;
    setViewport: (viewport: Viewport) => void;
    isContentVisible: boolean;
}

const StageToolbar = ({
    variants,
    selectedVariantId,
    setSelectedVariantId,
    activeTab,
    setActiveTab,
    viewport,
    setViewport,
    isContentVisible,
}: StageToolbarProps) => {

    const TabButton: React.FC<{ name: StageTab, icon: React.ReactElement<React.SVGProps<SVGSVGElement>> }> = ({ name, icon }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm ${activeTab === name ? 'bg-neural-gray-700 text-quantum-white' : 'text-neural-gray-200 hover:bg-neural-gray-700/50'}`}
        >
            {React.cloneElement(icon, { className: 'w-4 h-4' })}
            {name}
        </button>
    );

    const ViewportButton: React.FC<{ name: Viewport, icon: React.ReactElement<React.SVGProps<SVGSVGElement>> }> = ({ name, icon }) => (
         <button onClick={() => setViewport(name)} className={`p-1.5 rounded-md transition-colors ${viewport === name ? 'bg-ai-blue-primary text-white' : 'text-neural-gray-300 hover:bg-neural-gray-700'}`}>
            {React.cloneElement(icon, { className: 'w-5 h-5' })}
         </button>
    );

    return (
        <div className="flex-shrink-0 h-14 bg-neural-gray-900 flex items-center justify-between px-4 border-b border-neural-gray-700/50 z-10">
            <div className="flex items-center gap-2">
                {variants.map(v => (
                    <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-4 py-1.5 text-sm rounded-md transition-colors font-semibold ${selectedVariantId === v.id ? 'bg-ai-blue-primary text-white' : 'bg-neural-gray-800 text-neural-gray-200 hover:bg-neural-gray-700'}`}
                    >
                        {v.name}
                    </button>
                ))}
            </div>
            {isContentVisible && (
                <div className="flex items-center gap-6">
                    {activeTab === 'Preview' && (
                        <div className="flex items-center gap-1 bg-neural-gray-800 p-1 rounded-lg">
                             <ViewportButton name="mobile" icon={<Icons.Smartphone />} />
                             <ViewportButton name="tablet" icon={<Icons.Tablet />} />
                             <ViewportButton name="desktop" icon={<Icons.Laptop />} />
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm bg-neural-gray-800 p-1 rounded-lg">
                        <TabButton name="Preview" icon={<Icons.Palette />} />
                        <TabButton name="Code" icon={<Icons.Code />} />
                        <TabButton name="Metrics" icon={<Icons.BarChart />} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StageToolbar;