import React, { useState, useEffect } from 'react';
import { Variant } from '../types';
import StageToolbar from './stage/StageToolbar';
import StageEmptyState from './stage/StageEmptyState';
import StageSkeleton from './stage/StageSkeleton';
import PreviewPane from './stage/PreviewPane';
import CodePane from './stage/CodePane';
import MetricsPane from './stage/MetricsPane';

interface StageProps {
    variants: Variant[];
    selectedVariantId: string | null;
    setSelectedVariantId: (id: string) => void;
    isGenerating: boolean;
}

type StageTab = 'Preview' | 'Code' | 'Metrics';
type Viewport = 'mobile' | 'tablet' | 'desktop';

const Stage = ({ variants, selectedVariantId, setSelectedVariantId, isGenerating }: StageProps) => {
    const [activeTab, setActiveTab] = useState<StageTab>('Preview');
    const [viewport, setViewport] = useState<Viewport>('desktop');

    const activeVariant = variants.find(v => v.id === selectedVariantId);
    
    // Reset to preview tab when variants change
    useEffect(() => {
        setActiveTab('Preview');
    }, [variants]);

    const renderContent = () => {
        if (!activeVariant) {
            return isGenerating ? <StageSkeleton /> : <StageEmptyState />;
        }

        switch (activeTab) {
            case 'Preview':
                return <PreviewPane variant={activeVariant} viewport={viewport} />;
            case 'Code':
                return <CodePane variant={activeVariant} />;
            case 'Metrics':
                return <MetricsPane variant={activeVariant} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex-grow flex flex-col bg-neural-gray-800 overflow-hidden">
            <StageToolbar
                variants={variants}
                selectedVariantId={selectedVariantId}
                setSelectedVariantId={setSelectedVariantId}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                viewport={viewport}
                setViewport={setViewport}
                isContentVisible={!!activeVariant}
            />
            <div className="flex-grow p-4 bg-neural-gray-50 overflow-auto relative">
                {renderContent()}
            </div>
        </div>
    );
};

export default Stage;