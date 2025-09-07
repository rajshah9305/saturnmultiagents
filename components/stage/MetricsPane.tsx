import React from 'react';
import { Variant } from '../../types';

interface MetricsPaneProps {
    variant: Variant;
}

const MetricBar: React.FC<{ label: string; score: number; max: number; color: string }> = ({ label, score, max, color }) => {
    const percentage = (score / max) * 100;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-neural-gray-700">{label}</span>
                <span className="text-sm font-bold text-neural-gray-900">{score.toFixed(2)} / {max}</span>
            </div>
            <div className="w-full bg-neural-gray-200 rounded-full h-4">
                <div
                    className="h-4 rounded-full animate-fill-bar"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                        '--bar-width': `${percentage}%`
                    } as React.CSSProperties}
                ></div>
            </div>
        </div>
    );
};


const MetricsPane = ({ variant }: MetricsPaneProps) => {
    return (
        <div className="text-neural-gray-900 p-6 max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                {variant.name} - Performance & Quality Metrics
            </h2>
            <div className="space-y-6">
                <MetricBar
                    label="Novelty Score"
                    score={variant.novelty || 0}
                    max={1.0}
                    color="var(--ai-purple-secondary)"
                />
                <MetricBar
                    label="Accessibility Score"
                    score={variant.accessibility_score || 0}
                    max={100}
                    color="var(--ai-emerald-success)"
                />
                 <div>
                    <h3 className="text-lg font-semibold mb-2 text-neural-gray-800">Dependencies</h3>
                    <div className="flex flex-wrap gap-2">
                         {(variant.dependencies && variant.dependencies.length > 0) ? (
                            variant.dependencies.map(dep => (
                                <span key={dep} className="px-3 py-1 bg-neural-gray-200 text-neural-gray-800 text-sm font-mono rounded-full">
                                    {dep}
                                </span>
                            ))
                        ) : (
                            <p className="text-neural-gray-500">None</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsPane;
