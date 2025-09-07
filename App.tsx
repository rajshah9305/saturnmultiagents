import React, { useReducer, useEffect, useCallback, useRef } from 'react';
import { Variant, AgentStatus, StyleDNA, AppState, Action } from './types';
import { PROMPT_TEMPLATES, STYLE_DNA_LIBRARY } from './constants';
import { generateUiVariants, refineUiVariant } from './services/geminiService';
import Header from './components/Header';
import Stage from './components/Stage';
import Console from './components/Console';
import AgentWorkflow from './components/AgentWorkflow';
import Toast from './components/Toast';

declare const DOMPurify: any;

const initialState: AppState = {
    workflowPhase: 'idle',
    agentStatuses: {},
    variants: [],
    selectedVariantId: null,
    prompt: PROMPT_TEMPLATES[0],
    activeStyleDna: STYLE_DNA_LIBRARY[0],
    error: null,
    refinementPrompt: '',
};

function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'START_GENERATION':
            return { ...state, workflowPhase: 'generating', variants: [], error: null, agentStatuses: {} };
        case 'START_REFINEMENT':
            return { ...state, workflowPhase: 'refining', error: null, agentStatuses: {} };
        case 'SET_VARIANTS':
            return { ...state, variants: action.payload, selectedVariantId: action.payload[0]?.id || null };
        case 'UPDATE_VARIANT':
            return {
                ...state,
                variants: state.variants.map(v => v.id === action.payload.id ? action.payload : v),
            };
        case 'WORKFLOW_STEP':
            return { ...state, agentStatuses: { ...state.agentStatuses, [action.payload.agentId]: action.payload.status } };
        case 'WORKFLOW_COMPLETE':
            const finalStatus = action.payload.success ? 'completed' : 'dormant';
            const finalPhase = action.payload.success ? 'idle' : state.workflowPhase;
            return {
                ...state,
                workflowPhase: finalPhase,
                refinementPrompt: '',
                agentStatuses: Object.keys(state.agentStatuses).reduce((acc, key) => ({ ...acc, [key]: finalStatus }), {}),
            };
        case 'SET_SELECTED_VARIANT':
            return { ...state, selectedVariantId: action.payload };
        case 'SET_PROMPT':
            return { ...state, prompt: action.payload };
        case 'SET_REFINEMENT_PROMPT':
            return { ...state, refinementPrompt: action.payload };
        case 'SET_STYLE_DNA':
            return { ...state, activeStyleDna: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, workflowPhase: 'idle' };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
}

const App = () => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const workflowInterval = useRef<NodeJS.Timeout | null>(null);

    const cleanupWorkflow = useCallback(() => {
        if (workflowInterval.current) {
            clearInterval(workflowInterval.current);
            workflowInterval.current = null;
        }
    }, []);

    useEffect(() => {
        return cleanupWorkflow;
    }, [cleanupWorkflow]);

    const runWorkflowSimulation = useCallback((onComplete: () => void, refinement = false) => {
        const sequence: { agent: string, status: AgentStatus }[] = refinement ? [
            { agent: 'orchestrator', status: 'analyzing' },
            { agent: 'code_generator', status: 'creating' },
            { agent: 'qa_guardian', status: 'validating' },
            { agent: 'performance_optimizer', status: 'optimizing' },
        ] : [
            { agent: 'orchestrator', status: 'initializing' },
            { agent: 'orchestrator', status: 'analyzing' },
            { agent: 'design_architect', status: 'creating' },
            { agent: 'aesthetic_curator', status: 'creating' },
            { agent: 'code_generator', status: 'creating' },
            { agent: 'qa_guardian', status: 'validating' },
            { agent: 'performance_optimizer', status: 'optimizing' },
            { agent: 'security_auditor', status: 'validating' },
        ];
        
        let step = 0;
        
        const updateStatus = () => {
            if (step < sequence.length) {
                const { agent, status } = sequence[step];
                dispatch({ type: 'WORKFLOW_STEP', payload: { agentId: agent, status } });
                step++;
            } else {
                cleanupWorkflow();
                onComplete();
            }
        };
        
        updateStatus();
        workflowInterval.current = setInterval(updateStatus, 1500);
    }, [cleanupWorkflow]);
    
    const handleGenerate = useCallback(async () => {
        dispatch({ type: 'START_GENERATION' });
        
        const apiCallPromise = generateUiVariants(state.prompt, state.activeStyleDna)
            .then(generatedVariants => {
                const sanitizedVariants = generatedVariants.map(v => ({
                    ...v,
                    preview: DOMPurify.sanitize(v.preview, { USE_PROFILES: { html: true } })
                }));
                dispatch({ type: 'SET_VARIANTS', payload: sanitizedVariants });
                return true;
            })
            .catch(err => {
                console.error("Generation failed:", err);
                dispatch({ type: 'SET_ERROR', payload: `Generation failed: ${err.message}` });
                return false;
            });
            
        runWorkflowSimulation(() => {
            apiCallPromise.then((success) => {
                dispatch({ type: 'WORKFLOW_COMPLETE', payload: { success } });
            });
        });

    }, [state.prompt, state.activeStyleDna, runWorkflowSimulation]);

    const handleRefine = useCallback(async () => {
        const selectedVariant = state.variants.find(v => v.id === state.selectedVariantId);
        if (!selectedVariant || !state.refinementPrompt) return;

        dispatch({ type: 'START_REFINEMENT' });

        const apiCallPromise = refineUiVariant(state.refinementPrompt, state.activeStyleDna, selectedVariant)
            .then(refinedVariant => {
                const sanitizedVariant = {
                    ...refinedVariant,
                    preview: DOMPurify.sanitize(refinedVariant.preview, { USE_PROFILES: { html: true } })
                };
                dispatch({ type: 'UPDATE_VARIANT', payload: sanitizedVariant });
                return true;
            })
            .catch(err => {
                console.error("Refinement failed:", err);
                dispatch({ type: 'SET_ERROR', payload: `Refinement failed: ${err.message}` });
                return false;
            });

        runWorkflowSimulation(() => {
            apiCallPromise.then((success) => {
                dispatch({ type: 'WORKFLOW_COMPLETE', payload: { success } });
            });
        }, true);

    }, [state.refinementPrompt, state.activeStyleDna, state.variants, state.selectedVariantId, runWorkflowSimulation]);


    const handleCancel = () => {
        cleanupWorkflow();
        dispatch({ type: 'WORKFLOW_COMPLETE', payload: { success: false }});
    }

    return (
        <main className="h-screen w-screen bg-neural-gray-900 flex flex-col font-sans">
            <Header />
            <div className="flex-grow flex flex-col overflow-hidden">
                <Stage
                    variants={state.variants}
                    selectedVariantId={state.selectedVariantId}
                    setSelectedVariantId={(id) => dispatch({ type: 'SET_SELECTED_VARIANT', payload: id })}
                    isGenerating={state.workflowPhase === 'generating'}
                />
                <Console
                    prompt={state.prompt}
                    setPrompt={(p) => dispatch({ type: 'SET_PROMPT', payload: p })}
                    refinementPrompt={state.refinementPrompt}
                    setRefinementPrompt={(p) => dispatch({ type: 'SET_REFINEMENT_PROMPT', payload: p })}
                    activeStyleDna={state.activeStyleDna}
                    setActiveStyleDna={(d) => dispatch({ type: 'SET_STYLE_DNA', payload: d })}
                    onGenerate={handleGenerate}
                    onRefine={handleRefine}
                    isProcessing={state.workflowPhase === 'generating' || state.workflowPhase === 'refining'}
                    hasVariants={state.variants.length > 0}
                />
            </div>
            {(state.workflowPhase === 'generating' || state.workflowPhase === 'refining') && (
                <AgentWorkflow 
                    statuses={state.agentStatuses} 
                    onCancel={handleCancel} 
                />
            )}
            {state.error && (
                <Toast 
                    message={state.error} 
                    onClose={() => dispatch({ type: 'CLEAR_ERROR' })} 
                />
            )}
        </main>
    );
};

export default App;