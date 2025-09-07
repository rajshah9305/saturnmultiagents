import React from 'react';
import { StyleDNA } from '../types';
import { STYLE_DNA_LIBRARY } from '../constants';
import * as Icons from './icons';

interface ConsoleProps {
    prompt: string;
    setPrompt: (p: string) => void;
    refinementPrompt: string;
    setRefinementPrompt: (p: string) => void;
    activeStyleDna: StyleDNA;
    setActiveStyleDna: (dna: StyleDNA) => void;
    onGenerate: () => void;
    onRefine: () => void;
    isProcessing: boolean;
    hasVariants: boolean;
}

const Console = ({
    prompt,
    setPrompt,
    refinementPrompt,
    setRefinementPrompt,
    activeStyleDna,
    setActiveStyleDna,
    onGenerate,
    onRefine,
    isProcessing,
    hasVariants,
}: ConsoleProps) => {
    const isRefiningMode = !isProcessing && hasVariants;

    const handleSubmit = () => {
        if (isRefiningMode) {
            onRefine();
        } else {
            onGenerate();
        }
    };
    
    return (
        <div className="h-[240px] bg-neural-gray-800/80 backdrop-blur-sm border-t border-neural-gray-700/50 p-6 flex z-20 flex-shrink-0">
            <div className="flex-grow flex gap-6 items-start">
                {/* Left Side: Prompt Input */}
                <div className="w-1/3 h-full flex flex-col">
                    <label className="text-sm font-medium text-neural-gray-200 mb-2">
                        {isRefiningMode ? "Refinement Instructions" : "Component Description"}
                    </label>
                    <textarea
                        value={isRefiningMode ? refinementPrompt : prompt}
                        onChange={(e) => isRefiningMode ? setRefinementPrompt(e.target.value) : setPrompt(e.target.value)}
                        className="w-full flex-grow bg-neural-gray-900 border border-neural-gray-700 rounded-lg p-3 text-neural-gray-50 resize-none focus:ring-2 focus:ring-ai-blue-primary focus:outline-none transition-all"
                        placeholder={isRefiningMode ? "e.g., Make the primary button blue and add an icon..." : "e.g., A responsive pricing table with three tiers..."}
                        disabled={isProcessing}
                    />
                </div>

                {/* Right Side: Style Matrix & Action Button */}
                <div className="w-2/3 h-full flex flex-col">
                    <label className="text-sm font-medium text-neural-gray-200 mb-2">Style DNA</label>
                    <div className="grid grid-cols-4 gap-3 flex-grow">
                        {STYLE_DNA_LIBRARY.map(dna => (
                            <button
                                key={dna.id}
                                onClick={() => setActiveStyleDna(dna)}
                                disabled={isProcessing}
                                className={`style-matrix-card relative p-3 text-left rounded-lg transition-all border-2 overflow-hidden h-full flex flex-col
                                    ${activeStyleDna.id === dna.id ? 'border-ai-blue-primary' : 'border-neural-gray-700 hover:border-neural-gray-600'} 
                                    disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <div className="absolute inset-x-0 top-0 h-1" style={{ background: dna.gradient }}></div>
                                <p className="font-semibold text-sm text-quantum-white mt-2">{dna.name}</p>
                                <p className="text-xs text-neural-gray-300 mt-1 flex-grow">{dna.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {dna.keywords.split(', ').slice(0, 3).map(k => (
                                        <span key={k} className="text-[10px] bg-neural-gray-700/50 text-neural-gray-200 px-1.5 py-0.5 rounded-full">{k}</span>
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
             {/* Action Button */}
            <div className="ml-6 flex items-end">
                <button
                    onClick={handleSubmit}
                    disabled={isProcessing || (isRefiningMode ? !refinementPrompt.trim() : !prompt.trim())}
                    className="w-full px-6 py-3 bg-ai-blue-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-neural-gray-700 disabled:cursor-not-allowed transition-all flex items-center justify-center h-24 text-lg"
                >
                    {isProcessing ? (
                        <>
                            <Icons.Cpu className="animate-spin mr-3 h-6 w-6" />
                            <span>{hasVariants ? 'Refining...' : 'Generating...'}</span>
                        </>
                    ) : (
                        <>
                            <Icons.Sparkles className="mr-3 h-6 w-6" />
                            <span>{isRefiningMode ? 'Refine' : 'Generate'}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Console;