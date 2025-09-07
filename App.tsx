import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Agent, AgentRole, AgentStatus, WorkflowLog } from './types';
import { INITIAL_AGENTS } from './constants';
import { runAgentTaskStream } from './services/geminiService';
import ProjectInput from './components/ProjectInput';
import AgentCard from './components/AgentCard';
import WorkflowLogDisplay from './components/WorkflowLogDisplay';
import CodeOutput from './components/CodeOutput';
import { SparklesIcon } from './components/icons/SparklesIcon';

const getIntroMessage = (role: AgentRole): string => {
  switch (role) {
    case AgentRole.CEO:
      return "Alright team, let's get started. Here's the high-level plan.";
    case AgentRole.CTO:
      return "Got it. I'm drafting the technical spec now.";
    case AgentRole.SENIOR_ENGINEER:
      return "Okay, I'm starting to write the code for the main component.";
    case AgentRole.JUNIOR_ENGINEER:
      return "Let me review that code.";
    case AgentRole.DEVOPS:
      return "Code looks good. Preparing the deployment plan.";
    default:
      return "Starting task...";
  }
};


const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [workflowLogs, setWorkflowLogs] = useState<WorkflowLog[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState<number>(0);
  
  const logIdCounter = useRef(0);

  const addLog = useCallback((log: Omit<WorkflowLog, 'id'>) => {
    setWorkflowLogs(prev => [...prev, { ...log, id: logIdCounter.current++ }]);
  }, []);

  const resetState = useCallback(() => {
    setAgents(INITIAL_AGENTS);
    setWorkflowLogs([]);
    setGeneratedCode('');
    setIsGenerating(false);
    setCurrentAgentIndex(0);
    logIdCounter.current = 0;
  }, []);

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    resetState();
    addLog({ agentRole: 'User', message: prompt, type: 'prompt' });
    setIsGenerating(true);
  };
  
  const processWorkflow = useCallback(async () => {
    if (!isGenerating || currentAgentIndex >= agents.length) {
      if(isGenerating) {
          setIsGenerating(false);
          setAgents(prev => prev.map(a => a.status === 'WORKING' ? {...a, status: AgentStatus.COMPLETED} : a));
          addLog({ agentRole: 'System', message: 'Project generation complete!', type: 'system' });
      }
      return;
    }

    const currentAgent = agents[currentAgentIndex];
    setAgents(prev => prev.map((agent, index) => 
        index === currentAgentIndex ? { ...agent, status: AgentStatus.WORKING } : agent
    ));

    addLog({ agentRole: currentAgent.role, message: getIntroMessage(currentAgent.role), type: 'info' });
    
    const outputLogId = logIdCounter.current;
    addLog({ agentRole: currentAgent.role, message: '', type: 'output' });

    let fullResponse = '';
    try {
        const stream = runAgentTaskStream(currentAgent.role, prompt, workflowLogs, generatedCode);

        for await (const chunk of stream) {
            fullResponse += chunk;
            setWorkflowLogs(prev => prev.map(log => 
                log.id === outputLogId ? { ...log, message: fullResponse } : log
            ));
            if (currentAgent.role === AgentRole.SENIOR_ENGINEER) {
                setGeneratedCode(fullResponse);
            }
        }
        
        setAgents(prev => prev.map((agent, index) => 
            index === currentAgentIndex ? { ...agent, status: AgentStatus.COMPLETED } : agent
        ));

        if (currentAgentIndex + 1 < agents.length) {
          setAgents(prev => prev.map((agent, index) => 
              index === currentAgentIndex + 1 ? { ...agent, status: AgentStatus.THINKING } : agent
          ));
        }

        setCurrentAgentIndex(prev => prev + 1);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setWorkflowLogs(prev => prev.map(log => 
            log.id === outputLogId ? { ...log, message: `Error: ${errorMessage}`, type: 'error' } : log
        ));
        setAgents(prev => prev.map(agent => ({ ...agent, status: AgentStatus.IDLE })));
        setIsGenerating(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating, currentAgentIndex, agents, prompt, generatedCode, addLog]);
  
  useEffect(() => {
    if (isGenerating && currentAgentIndex < agents.length) {
        const timer = setTimeout(() => {
            processWorkflow();
        }, 1000); // reduced delay
        return () => clearTimeout(timer);
    } else if (isGenerating && currentAgentIndex >= agents.length) {
        processWorkflow();
    }
  }, [isGenerating, currentAgentIndex, processWorkflow]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Saturn AI
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Your Elite Multi-Agent Code Generation Team</p>
        </header>
        
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-2xl mb-8">
          <ProjectInput 
            prompt={prompt} 
            setPrompt={setPrompt} 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {agents.map((agent) => (
            <AgentCard key={agent.role} agent={agent} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
             <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-300">
                <SparklesIcon className="w-6 h-6 mr-2 text-indigo-400"/>
                Agent Workflow
             </h2>
            <WorkflowLogDisplay logs={workflowLogs} />
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
             <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                Generated Code
             </h2>
            <CodeOutput code={generatedCode} isGenerating={isGenerating && !generatedCode && agents.some(a => a.role === AgentRole.SENIOR_ENGINEER && a.status === AgentStatus.WORKING)} />
          </div>
        </div>
        
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        Built with React, TypeScript, and Gemini API. Inspired by Saturn.
      </footer>
    </div>
  );
};

export default App;