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
    isGenerating: boolean;
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
    isGenerating,
    hasVariants,
}: ConsoleProps) => {
    const isRefiningMode = !isGenerating && hasVariants;

    const handleSubmit = () => {
        if (isRefiningMode) {
            onRefine();
        } else {
            onGenerate();
        }
    };
    
    return (
        <div className="h-[240px] bg-neural-gray-800 border-t border-neural-gray-700/50 p-6 flex flex-col z-20 flex-shrink-0">
            <div className="flex-grow flex gap-6">
                <div className="w-1/2 flex flex-col">
                    <label className="text-sm font-medium text-neural-gray-200 mb-2">
                        {isRefiningMode ? "Refinement Instructions" : "Component Description"}
                    </label>
                    <textarea
                        value={isRefiningMode ? refinementPrompt : prompt}
                        onChange={(e) => isRefiningMode ? setRefinementPrompt(e.target.value) : setPrompt(e.target.value)}
                        className="w-full flex-grow bg-neural-gray-900 border border-neural-gray-700 rounded-lg p-3 text-neural-gray-50 resize-none focus:ring-2 focus:ring-ai-blue-primary focus:outline-none transition-all"
                        placeholder={isRefiningMode ? "e.g., Make the primary button blue and add an icon..." : "e.g., A responsive pricing table with three tiers..."}
                        disabled={isGenerating}
                    />
                </div>
                <div className="w-1/2 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-neural-gray-200">Style DNA</label>
                    </div>
                     <div className="grid grid-cols-2 gap-2">
                        {STYLE_DNA_LIBRARY.map(dna => (
                            <button
                                key={dna.id}
                                onClick={() => setActiveStyleDna(dna)}
                                disabled={isGenerating}
                                className={`px-4 py-2 text-left rounded-md transition-all border ${activeStyleDna.id === dna.id ? 'bg-ai-blue-primary/20 border-ai-blue-primary' : 'bg-neural-gray-700/50 border-neural-gray-700 hover:bg-neural-gray-700'} disabled:opacity-50`}
                            >
                                <p className="font-semibold text-sm text-quantum-white">{dna.name}</p>
                                <p className="text-xs text-neural-gray-200">{dna.description}</p>
                            </button>
                        ))}
                    </div>
                     <div className="mt-auto flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={isGenerating || (isRefiningMode ? !refinementPrompt : !prompt)}
                            className="px-8 py-3 bg-ai-blue-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-neural-gray-700 disabled:cursor-not-allowed transition-all flex items-center"
                        >
                             {isGenerating ? (
                                <>
                                    <Icons.Cpu className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                    {hasVariants ? 'Refining...' : 'Generating...'}
                                </>
                            ) : (
                                <>
                                    <Icons.Sparkles className="mr-2" />
                                    {isRefiningMode ? 'Refine Component' : 'Generate Variants'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Console;
