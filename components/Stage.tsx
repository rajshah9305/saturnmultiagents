import React, { useState, useEffect, useRef } from 'react';
import { Variant } from '../types';
import * as Icons from './icons';

declare const hljs: any;

interface StageProps {
    variants: Variant[];
    selectedVariant: string | null;
    setSelectedVariant: (id: string) => void;
}

const Stage = ({ variants, selectedVariant, setSelectedVariant }: StageProps) => {
    const [activeTab, setActiveTab] = useState('Preview');
    const [viewport, setViewport] = useState('desktop');
    const codeRef = useRef<HTMLElement>(null);

    const activeVariant = variants.find(v => v.id === selectedVariant) || variants[0];

    useEffect(() => {
        if (activeVariant && activeTab === 'Code' && codeRef.current) {
            codeRef.current.textContent = activeVariant.code;
            hljs.highlightElement(codeRef.current);
        }
    }, [activeVariant, activeTab]);

    const getViewportSize = () => {
        if (viewport === 'mobile') return 'w-[375px] h-[667px]';
        if (viewport === 'tablet') return 'w-[768px] h-[1024px]';
        return 'w-full h-full';
    };

    if (!variants.length) {
        return (
            <div className="flex-grow flex items-center justify-center text-neural-gray-700">
                <div className="text-center">
                    <Icons.Palette className="w-16 h-16 mx-auto" />
                    <p className="mt-4 text-xl font-semibold">AI Component Stage</p>
                    <p>Generated components will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow flex flex-col bg-neural-gray-800 overflow-hidden">
            {/* Toolbar */}
            <div className="flex-shrink-0 h-14 bg-neural-gray-900 flex items-center justify-between px-4 border-b border-neural-gray-700/50">
                <div className="flex items-center gap-2">
                    {variants.map(v => (
                        <button
                            key={v.id}
                            onClick={() => setSelectedVariant(v.id)}
                            className={`px-3 py-1 text-sm rounded-md ${selectedVariant === v.id ? 'bg-ai-blue-primary text-white' : 'bg-neural-gray-800 hover:bg-neural-gray-700'}`}
                        >
                            {v.name}
                        </button>
                    ))}
                </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-neural-gray-800 p-1 rounded-md">
                         <button onClick={() => setViewport('mobile')} className={`p-1 rounded ${viewport === 'mobile' ? 'bg-ai-blue-primary' : ''}`}><Icons.Smartphone /></button>
                         <button onClick={() => setViewport('tablet')} className={`p-1 rounded ${viewport === 'tablet' ? 'bg-ai-blue-primary' : ''}`}><Icons.Tablet /></button>
                         <button onClick={() => setViewport('desktop')} className={`p-1 rounded ${viewport === 'desktop' ? 'bg-ai-blue-primary' : ''}`}><Icons.Laptop /></button>
                    </div>
                     <div className="flex items-center gap-2 text-sm">
                        <button onClick={() => setActiveTab('Preview')} className={activeTab === 'Preview' ? 'text-ai-blue-primary font-semibold' : ''}>Preview</button>
                        <button onClick={() => setActiveTab('Code')} className={activeTab === 'Code' ? 'text-ai-blue-primary font-semibold' : ''}>Code</button>
                        <button onClick={() => setActiveTab('Metrics')} className={activeTab === 'Metrics' ? 'text-ai-blue-primary font-semibold' : ''}>Metrics</button>
                     </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow p-4 bg-neural-gray-50 overflow-auto">
                {activeTab === 'Preview' && (
                     <div className="w-full h-full flex items-center justify-center">
                        <iframe
                            title="Preview"
                            srcDoc={activeVariant.preview}
                            className={`bg-white rounded-md shadow-lg transition-all duration-300 ${getViewportSize()}`}
                            sandbox="allow-scripts"
                        />
                    </div>
                )}
                {activeTab === 'Code' && (
                     <div className="h-full bg-[#282c34] rounded-lg overflow-hidden">
                        <pre className="h-full m-0">
                            <code ref={codeRef} className="language-jsx p-4 block h-full overflow-auto">
                                {/* Content is set by highlight.js */}
                            </code>
                        </pre>
                    </div>
                )}
                 {activeTab === 'Metrics' && (
                    <div className="text-neural-gray-900 p-4">
                        <h2 className="text-xl font-bold mb-4">{activeVariant.name} - Performance Metrics</h2>
                        <ul className="space-y-2">
                           <li><strong>Novelty Score:</strong> {activeVariant.novelty || 'N/A'}</li>
                           <li><strong>Accessibility Score:</strong> {activeVariant.accessibility_score || 'N/A'}</li>
                           <li><strong>Dependencies:</strong> {(activeVariant.dependencies || []).join(', ') || 'None'}</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stage;
