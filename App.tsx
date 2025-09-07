import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Agent, GeneratedFile, SystemState, BlueprintNode, AgentStatus } from './types';
import { NEXUS_AGENTS } from './constants';
import { callGeminiApi } from './services/geminiService';
import * as Icons from './components/icons';

// Since highlight.js is loaded from a script tag, we need to declare it for TypeScript
declare const hljs: any;

// --- CORE UI COMPONENTS ---

const Header = () => (
  <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-30">
    <div className="flex items-center">
      <Icons.Network width={28} height={28} className="text-purple-600 mr-3" />
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
          Nexus Core
        </h1>
        <p className="text-slate-500 text-sm -mt-1">AI Code Synthesis</p>
      </div>
    </div>
  </header>
);

const NexusCore = ({ systemState, onInitiate, projectDescription, setProjectDescription }) => {
    const getCoreState = () => {
        switch(systemState) {
            case 'initializing': return { text: 'Initializing...', glow: 'animate-pulse-glow', icon: <Icons.Cpu className="animate-spin" /> };
            case 'analyzing': return { text: 'Analyzing...', glow: 'animate-pulse-glow', icon: <Icons.Cpu className="animate-spin" /> };
            case 'planning': return { text: 'Blueprint...', glow: 'animate-pulse-glow', icon: <Icons.Brain /> };
            case 'generating': return { text: 'Synthesizing...', glow: 'animate-pulse-glow', icon: <Icons.Sparkles /> };
            case 'completed': return { text: 'Complete', glow: '', icon: <Icons.Check /> };
            case 'error': return { text: 'Error', glow: '', icon: <Icons.Zap /> };
            default: return { text: 'Awaiting Idea', glow: '', icon: <Icons.Lightbulb /> };
        }
    };
    const coreState = getCoreState();

    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className={`relative w-96 h-96 rounded-full flex items-center justify-center transition-all duration-500 ${coreState.glow}`}>
                <div className="absolute inset-0 bg-white/50 backdrop-blur-xl rounded-full border-2 border-purple-200/50"></div>
                <div className="absolute inset-5 bg-white rounded-full shadow-2xl shadow-purple-200"></div>
                <div className="relative z-10 w-full px-12 text-center">
                    {systemState === 'idle' ? (
                        <>
                            <textarea
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                className="w-full h-32 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl resize-none focus:outline-none focus:border-purple-400 transition-colors"
                                placeholder="Describe your application vision... e.g., a real-time collaborative whiteboard."
                                aria-label="Project Description"
                            />
                            <button
                                onClick={onInitiate}
                                disabled={!projectDescription}
                                className="w-full mt-4 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-lg"
                            >
                                <Icons.Sparkles className="mr-2" width={20} height={20} />
                                Initiate Synthesis
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-purple-600">
                                {React.cloneElement(coreState.icon, {width: 48, height: 48})}
                            </div>
                            <p className="text-2xl font-bold mt-4 text-slate-700">{coreState.text}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AgentConstellation = ({ agents }) => {
    const positions = [
        { transform: 'translate(0, -28rem)' },        // Top (Nexus Architect)
        { transform: 'translate(18rem, -21.4rem)' },   // (Luna Frontend)
        { transform: 'translate(27.5rem, -4.8rem)' },  // (Pixel Weaver)
        { transform: 'translate(27.5rem, 4.8rem)' },   // (Atlas Backend)
        { transform: 'translate(18rem, 21.4rem)' },    // (Sage Database)
        { transform: 'translate(0, 28rem)' },         // (Schema Scribe)
        { transform: 'translate(-18rem, 21.4rem)' },   // (Phoenix DevOps)
        { transform: 'translate(-27.5rem, 4.8rem)' },  // (Sentinel QA)
        { transform: 'translate(-27.5rem, -4.8rem)' }, // (Quantum Optimizr)
        { transform: 'translate(0, 0) scale(0.8)' }   // Center (Oracle)
    ];


    const getStatusStyles = (status: Agent['status']) => {
        switch (status) {
            case 'working': return 'border-blue-500 shadow-lg shadow-blue-500/50 scale-110';
            case 'thinking': return 'border-yellow-500 shadow-lg shadow-yellow-500/50 scale-110';
            case 'completed': return 'opacity-80';
            case 'error': return 'border-red-500 shadow-lg shadow-red-500/50';
            default: return 'border-gray-300 opacity-60';
        }
    };
    
    return (
        <div className="absolute inset-0 flex items-center justify-center -z-10">
            {NEXUS_AGENTS.map((baseAgent, index) => {
                const activeAgent = agents.find(a => a.id === baseAgent.id) || { ...baseAgent, status: 'idle' };
                const position = positions[index] || positions[0]; // Fallback to first position

                return (
                    <div
                        key={activeAgent.id}
                        className={`absolute bg-white/80 backdrop-blur-md rounded-full w-32 h-32 p-4 shadow-md border-2 flex flex-col items-center justify-center text-center transition-all duration-700 ${getStatusStyles(activeAgent.status)}`}
                        style={{ ...position }}
                    >
                        <div className={`p-2 rounded-full bg-gradient-to-r ${activeAgent.color} mb-1`}>
                           <activeAgent.icon width={24} height={24} className="text-white" />
                        </div>
                        <h3 className="font-bold text-xs text-slate-800">{activeAgent.name}</h3>
                        <p className="text-[10px] text-slate-500 truncate">{activeAgent.status}</p>
                    </div>
                );
            })}
        </div>
    );
};

const BlueprintDisplay = ({ blueprint, files, projectName }) => {
    if (!blueprint.length) return null;
    return (
        <div className="absolute bottom-6 left-6 w-80 bg-white/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-200/50 shadow-lg animate-fade-in">
            <h2 className="text-lg font-bold flex items-center text-slate-800"><Icons.Workflow className="mr-2" /> Project Blueprint</h2>
            <p className="text-sm text-slate-500 mb-3">Plan for <span className="font-semibold">{projectName}</span></p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {blueprint.map(node => {
                    const file = files.find(f => f.name === node.fileName);
                    const status = file ? 'complete' : 'pending';
                    return (
                        <div key={node.fileName} className="flex items-center text-sm">
                            {status === 'complete' 
                                ? <Icons.Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                : <Icons.Clock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                            }
                            <span className={`truncate ${status === 'complete' ? 'text-slate-700' : 'text-slate-500'}`}>{node.fileName}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CodeRepository = ({ files, onFileSelect }) => {
    if (!files.length) return null;
    return (
        <div className="absolute top-24 right-6 w-80 bg-white/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-200/50 shadow-lg animate-fade-in">
            <h2 className="text-lg font-bold flex items-center text-slate-800"><Icons.Folder className="mr-2 text-purple-600" /> Code Repository</h2>
            <div className="space-y-2 mt-3 max-h-96 overflow-y-auto">
                {files.map((file) => (
                    <button onClick={() => onFileSelect(file)} key={file.name} className="w-full text-left group bg-gray-50 rounded-lg p-2 border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors">
                        <div className="flex items-center">
                            <Icons.FileCode className="mr-2 text-blue-500 flex-shrink-0" width={18} height={18} />
                            <div className="flex-1">
                                <p className="font-mono text-xs font-semibold text-slate-800 truncate">{file.name}</p>
                            </div>
                            <Icons.Check className="text-green-500 ml-2" width={16} height={16} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

const CodeViewerModal = ({ file, onClose }) => {
    const codeRef = useRef<HTMLElement>(null);
    useEffect(() => {
        if (file && codeRef.current) {
            codeRef.current.textContent = file.content;
            hljs.highlightElement(codeRef.current);
        }
    }, [file]);

    if (!file) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="bg-white w-3/4 h-3/4 max-w-4xl rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                        <Icons.FileCode className="mr-3 text-blue-600" />
                        <h3 className="font-mono font-semibold text-slate-800">{file.name}</h3>
                    </div>
                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close code viewer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div className="flex-1 overflow-auto bg-[#282c34]">
                    <pre className="h-full m-0">
                        <code ref={codeRef} className={`language-${file.name.split('.').pop()} p-4 block`}>
                            {/* Content is set by highlight.js */}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

// --- Helper to select agent based on file name ---
const selectAgentForFile = (fileName: string, agents: Agent[]): Agent => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const name = fileName.toLowerCase();
    const path = fileName.toLowerCase();

    let agentId: string;

    // --- New Specialist Agent Logic ---
    if (path.includes('components/') && ['tsx', 'jsx', 'vue', 'svelte'].includes(extension)) {
        // Pixel Weaver handles specific UI components inside a components folder
        agentId = 'pixel_weaver_ui';
    } else if (path.includes('migrations/') && ['sql', 'ts', 'js'].includes(extension)) {
        // Schema Scribe handles database migrations
        agentId = 'schema_scribe_db';
    } 
    // --- Existing Generalist Agent Logic ---
    else if (['html', 'css', 'scss', 'less', 'svg'].includes(extension)) {
        agentId = 'luna_frontend';
    } else if (['tsx', 'jsx', 'ts', 'js', 'vue', 'svelte'].includes(extension)) {
        if (name.includes('test') || name.includes('spec')) {
            agentId = 'sentinel_qa';
        } else if (name.includes('server') || name.includes('api') || name.includes('backend')) {
            agentId = 'atlas_backend';
        } else {
            // Luna handles general frontend files (e.g., pages, main app file)
            agentId = 'luna_frontend';
        }
    } else if (['py', 'go', 'rb', 'php', 'java', 'cs'].includes(extension)) {
        agentId = 'atlas_backend';
    } else if (['sql', 'prisma'].includes(extension)) {
        // Sage handles general database tasks like schema definitions
        agentId = 'sage_database';
    } else if (name.includes('dockerfile') || ['yml', 'yaml'].includes(extension)) {
        agentId = 'phoenix_devops';
    } else {
        // Architect handles root config files like package.json, tsconfig.json, etc.
        agentId = 'nexus_architect';
    }
    
    // Find the agent by ID, defaulting to the architect if not found
    return agents.find(a => a.id === agentId) || agents.find(a => a.id === 'nexus_architect')!;
};


// --- MAIN APP COMPONENT ---

const App = () => {
    const [systemState, setSystemState] = useState<SystemState>('idle');
    const [projectDescription, setProjectDescription] = useState('');
    const [agents, setAgents] = useState<Agent[]>([]);
    const [blueprint, setBlueprint] = useState<BlueprintNode[]>([]);
    const [files, setFiles] = useState<GeneratedFile[]>([]);
    const [projectName, setProjectName] = useState('');
    const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
    const [systemError, setSystemError] = useState<string | null>(null);

    // Initialize agents on mount
    useEffect(() => {
        const initialAgents: Agent[] = NEXUS_AGENTS.map(agent => ({
            ...agent,
            status: 'idle',
            currentTask: '',
            lastThought: '',
            workingMemory: [],
        }));
        setAgents(initialAgents);
    }, []);

    const updateAgentStatus = (agentId: string, status: AgentStatus, task: string = '') => {
        setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status, currentTask: task } : a));
    };

    const handleInitiate = useCallback(async () => {
        if (!projectDescription || !agents.length) return;

        // Reset previous state
        setSystemState('initializing');
        setBlueprint([]);
        setFiles([]);
        setProjectName('');
        setSystemError(null);
        setAgents(prev => prev.map(a => ({ ...a, status: 'idle', currentTask: '' })));
        
        const workedAgentIds = new Set<string>();

        try {
            // == 1. ANALYSIS ==
            setSystemState('analyzing');
            const oracle = agents.find(a => a.id === 'oracle_ai');
            if (!oracle) throw new Error("Oracle AI agent not found");
            updateAgentStatus(oracle.id, 'working', 'Analyzing project idea...');
            
            const analysisPrompt = `Analyze the following project description and extract key information.
            Project Description: "${projectDescription}"
            Provide a short, catchy project name and a brief, one-sentence summary of the core concept.
            Format your response as a JSON object with keys "projectName" and "summary".`;

            const analysisResultRaw = await callGeminiApi(oracle, analysisPrompt, projectDescription, { isJson: true });
            
            let analysisResult: { projectName: string; summary: string; };
            try {
                analysisResult = JSON.parse(analysisResultRaw);
            } catch (e) {
                throw new Error(`Oracle AI provided an invalid analysis format. Response: "${analysisResultRaw}"`);
            }

            const currentProjectName = analysisResult.projectName || "Unnamed Project";
            setProjectName(currentProjectName);
            updateAgentStatus(oracle.id, 'completed');
            workedAgentIds.add(oracle.id);

            // == 2. PLANNING ==
            setSystemState('planning');
            const architect = agents.find(a => a.id === 'nexus_architect');
            if (!architect) throw new Error("Nexus Architect agent not found");
            updateAgentStatus(architect.id, 'working', 'Creating project blueprint...');

            const blueprintPrompt = `Based on the project description, create a detailed file structure blueprint.
            Project Name: ${currentProjectName}
            Description: "${projectDescription}"
            Analysis: "${analysisResult.summary}"
            List all necessary files for a robust, modern full-stack application. For each file, provide a brief, one-sentence description of its purpose.
            Return this as a JSON array of objects, where each object has "fileName" and "description" keys.
            Example: [{"fileName": "src/index.tsx", "description": "The main entry point for the React application."}]`;
            
            const blueprintResultRaw = await callGeminiApi(architect, blueprintPrompt, projectDescription, { isJson: true });
            
            let blueprintResult: BlueprintNode[];
            try {
                blueprintResult = JSON.parse(blueprintResultRaw);
            } catch (e) {
                throw new Error(`Nexus Architect provided an invalid blueprint format. Response: "${blueprintResultRaw}"`);
            }

            setBlueprint(blueprintResult);
            updateAgentStatus(architect.id, 'completed');
            workedAgentIds.add(architect.id);

            // == 3. GENERATION ==
            setSystemState('generating');
            const context = `Project: ${currentProjectName}\nDescription: "${projectDescription}"\nOverall Plan: Each file should be complete and functional. Use modern best practices. Do not use placeholders.`;

            for (const node of blueprintResult) {
                const agent = selectAgentForFile(node.fileName, agents);
                updateAgentStatus(agent.id, 'working', `Generating ${node.fileName}`);
                workedAgentIds.add(agent.id);

                const codePrompt = `Generate the complete code for the file "${node.fileName}".
                File Purpose: ${node.description}
                Return ONLY the raw code for this file. Do not include any explanations, markdown formatting, or anything else. Just the code.`;

                const fileContent = await callGeminiApi(agent, codePrompt, context);

                const newFile: GeneratedFile = {
                    name: node.fileName,
                    content: fileContent,
                    agent: agent.name,
                    agentId: agent.id,
                    timestamp: new Date().toISOString(),
                    size: fileContent.length,
                };
                setFiles(prev => [...prev, newFile]);
                updateAgentStatus(agent.id, 'idle'); // Ready for next task
            }

            // == 4. COMPLETION ==
            setSystemState('completed');
            setAgents(prev => prev.map(a => workedAgentIds.has(a.id) ? { ...a, status: 'completed' } : a));


        } catch (error) {
            console.error("An error occurred during synthesis:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            setSystemError(errorMessage);
            setSystemState('error');
            const workingAgent = agents.find(a => a.status === 'working');
            if(workingAgent) {
                updateAgentStatus(workingAgent.id, 'error');
            }
        }
    }, [projectDescription, agents]);

    return (
        <main className="relative h-screen w-screen bg-gray-50 overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
            <Header />
            <AgentConstellation agents={agents} />
            <NexusCore
                systemState={systemState}
                onInitiate={handleInitiate}
                projectDescription={projectDescription}
                setProjectDescription={setProjectDescription}
            />
            {systemError && (
                 <div className="absolute bottom-6 right-6 w-80 bg-red-100/80 backdrop-blur-lg rounded-2xl p-4 border border-red-300/50 shadow-lg animate-fade-in text-red-800 z-20">
                    <h2 className="text-lg font-bold flex items-center"><Icons.Zap className="mr-2" /> System Error</h2>
                    <p className="text-sm mt-2">{systemError}</p>
                 </div>
            )}
            {(systemState !== 'idle' && systemState !== 'initializing') && (
                <>
                    <BlueprintDisplay blueprint={blueprint} files={files} projectName={projectName} />
                    <CodeRepository files={files} onFileSelect={setSelectedFile} />
                </>
            )}
            <CodeViewerModal file={selectedFile} onClose={() => setSelectedFile(null)} />
        </main>
    );
};

export default App;