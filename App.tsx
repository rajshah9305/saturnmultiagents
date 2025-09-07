
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Agent, ProjectConfig, NlpInsights, GeneratedFile, SystemState, Message, AgentConversation, Collaboration, CodebaseAnalysis, ProjectInsight, AgentStatus } from './types';
import { NEXUS_AGENTS, WORKFLOWS } from './constants';
import { callGeminiApi } from './services/geminiService';
import * as Icons from './components/icons';

// --- SUB-COMPONENTS ---

const Header = () => (
  <div className="text-center mb-10">
    <div className="flex items-center justify-center mb-4">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-4">
        {/* FIX: Replaced size prop with width and height */}
        <Icons.Network width={40} height={40} className="text-white" />
      </div>
      <div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Nexus CodeGen Ecosystem
        </h1>
        <p className="text-gray-300 text-xl">Elite AI-Powered Development Orchestration Platform</p>
      </div>
    </div>
  </div>
);

const SystemStatusDisplay = ({ systemState, currentWorkflowName }: { systemState: SystemState, currentWorkflowName: string | null }) => (
    <div className="flex items-center justify-center gap-4 mt-4">
        <div className={`flex items-center px-4 py-2 rounded-full border ${
            systemState === 'idle' ? 'border-gray-600 text-gray-400' :
            systemState === 'running' ? 'border-green-500 text-green-400 animate-pulse' :
            ['analyzing', 'ready'].includes(systemState) ? 'border-yellow-500 text-yellow-400' :
            systemState === 'completed' ? 'border-blue-500 text-blue-400' :
            'border-red-500 text-red-400'
        }`}>
            {/* FIX: Replaced size prop with width and height */}
            <Icons.Activity width={16} height={16} className="mr-2" />
            System Status: {systemState.charAt(0).toUpperCase() + systemState.slice(1)}
        </div>
        {currentWorkflowName && (
            <div className="flex items-center px-4 py-2 rounded-full border border-purple-500 text-purple-400">
                {/* FIX: Replaced size prop with width and height */}
                <Icons.Workflow width={16} height={16} className="mr-2" />
                {currentWorkflowName}
            </div>
        )}
    </div>
);


const ApiStatus = () => (
    <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-green-700/50 shadow-2xl">
        <div className="flex items-center mb-2">
            {/* FIX: Replaced size prop with width and height */}
            <Icons.Key className="mr-3 text-green-400" width={24} height={24} />
            <h2 className="text-2xl font-bold text-green-400">API Configuration</h2>
        </div>
        <div className="flex items-center text-gray-300 bg-gray-800/80 border border-green-600/50 rounded-xl px-4 py-3">
            <Icons.Check className="mr-3 text-green-400" />
            <span>Gemini API Key is securely configured in the environment.</span>
        </div>
    </div>
);

const App: React.FC = () => {
  // Core State Management
  const [systemState, setSystemState] = useState<SystemState>('idle');
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [agentConversations, setAgentConversations] = useState<Record<string, AgentConversation[]>>({});
  const [nlpInsights, setNlpInsights] = useState<NlpInsights | null>(null);

  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    name: '',
    description: '',
    type: 'fullstack',
    framework: 'react',
    database: 'postgresql',
    features: [],
    complexity: 'intermediate',
    deployment: 'vercel',
    aiPersonality: 'collaborative',
  });

  // Advanced State
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<keyof typeof WORKFLOWS | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [codebaseAnalysis, setCodebaseAnalysis] = useState<CodebaseAnalysis | null>(null);
  const [collaborationGraph, setCollaborationGraph] = useState<Collaboration[]>([]);
  const [projectInsights, setProjectInsights] = useState<ProjectInsight[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addMessage = useCallback((agent: {name: string, id?: string, color: string}, message: string, type: Message['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      agent: agent.name,
      agentId: agent.id || 'system',
      message,
      timestamp,
      type,
      color: agent.color
    }]);
  }, []);

  const createAgentConversation = useCallback((agentId: string, message: string, type: AgentConversation['type'] = 'thought') => {
    const timestamp = new Date().toLocaleTimeString();
    setAgentConversations(prev => ({
      ...prev,
      [agentId]: [
        ...(prev[agentId] || []),
        { message, type, timestamp, id: Date.now() + Math.random() }
      ]
    }));
  }, []);
  
  const updateAgentStatus = useCallback((agentId: string, status: Agent['status']) => {
    setActiveAgents(prev => 
      prev.map(agent => 
        agent.id === agentId ? { ...agent, status } : agent
      )
    );
  }, []);

  const processNaturalLanguage = async (description: string): Promise<NlpInsights | null> => {
    const oracleAgent = NEXUS_AGENTS.find(a => a.id === 'oracle_ai');
    if (!oracleAgent) return null;
    
    const nlpPrompt = `Analyze this project description and extract structured insights:

"${description}"

Extract and return a JSON object with:
- features: Array of specific features mentioned
- complexity: estimated complexity level (simple/intermediate/advanced/enterprise)
- suggestedTech: recommended technology stack (e.g. ["React", "Node.js", "PostgreSQL"])
- userTypes: identified user personas (e.g. ["Admin", "Content Creator"])
- businessGoals: inferred business objectives
- risks: potential challenges or risks
- opportunities: innovative possibilities
- timeline: estimated development timeline (e.g., "2-3 weeks")
- scalabilityNeeds: scaling requirements
- securityRequirements: security considerations

Be thorough and insightful in your analysis. Your response MUST be a valid JSON object.`;

    try {
      const response = await callGeminiApi(oracleAgent, nlpPrompt, '', true);
      const insights = JSON.parse(response);
      setNlpInsights(insights);
      return insights;
    } catch (error) {
      console.error('NLP Analysis failed:', error);
      addMessage({name: 'System', color: ''}, `NLP analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error')
      return null;
    }
  };

  const generateFile = async (agent: Agent, fileName: string, prompt: string, collaboratingAgents: string[] = []) => {
    try {
      updateAgentStatus(agent.id, 'working');
      {/* FIX: Changed 'thinking' to 'thought' to match the AgentConversation type */}
      createAgentConversation(agent.id, `Starting work on ${fileName}. Let me think about this...`, 'thought');
      addMessage(agent, `🔧 Analyzing requirements for ${fileName}...`, 'working');

      const collaborationContext = collaboratingAgents.map(aid => {
          const agentConv = agentConversations[aid] || [];
          return agentConv.slice(-3).map(msg => `${aid}: ${msg.message}`).join('\n');
      }).join('\n\n');

      const projectContext = JSON.stringify({
        ...projectConfig, nlpInsights, projectInsights, collaborationContext
      }, null, 2);

      const planningPrompt = `Before generating the file "${fileName}", think through the task. What are the key requirements? How does it fit into the architecture? What are potential challenges? Think out loud about your approach, then provide a concise plan.`;
      const planResponse = await callGeminiApi(agent, planningPrompt, projectContext);
      createAgentConversation(agent.id, planResponse, 'planning');
      addMessage(agent, `💭 ${agent.name} is planning ${fileName}...`, 'thinking');

      const generationPrompt = `${prompt}\n\nBased on my analysis, generate a complete, production-ready "${fileName}" file. Make it exceptional code. Follow best practices, include error handling, and add comments for complex logic. The code should be secure, performant, and scalable. DO NOT wrap the code in markdown backticks. Just provide the raw code.`;
      const fileContent = await callGeminiApi(agent, generationPrompt, projectContext);
      
      const reflectionPrompt = `I just generated "${fileName}". Reflect on the work: What are the key features implemented? What makes this code high-quality? Are there potential improvements? How does it integrate with the system? Provide a brief reflection.`;
      const reflection = await callGeminiApi(agent, reflectionPrompt, projectContext);
      createAgentConversation(agent.id, reflection, 'reflection');

      const file: GeneratedFile = { name: fileName, content: fileContent, agent: agent.name, agentId: agent.id, timestamp: new Date().toISOString(), size: fileContent.length, planning: planResponse, reflection: reflection, collaborators: collaboratingAgents };

      setGeneratedFiles(prev => [...prev, file]);
      addMessage(agent, `✅ Successfully created ${fileName}!`, 'success');
      updateAgentStatus(agent.id, 'completed');

      setCollaborationGraph(prev => [...prev, { from: agent.id, to: fileName, type: 'created', timestamp: new Date().toISOString() } ]);
      return file;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      createAgentConversation(agent.id, `Encountered an issue: ${errorMessage}`, 'error');
      addMessage(agent, `❌ Failed to generate ${fileName}: ${errorMessage}`, 'error');
      updateAgentStatus(agent.id, 'error');
      throw error;
    }
  };

  const initializeAdvancedProject = async () => {
    setSystemState('analyzing');
    const oracleAgent = NEXUS_AGENTS.find(a => a.id === 'oracle_ai')!;
    const architectAgent = NEXUS_AGENTS.find(a => a.id === 'nexus_architect')!;
    
    addMessage(oracleAgent, '🧠 Analyzing project requirements with advanced NLP...', 'working');
    
    const insights = await processNaturalLanguage(projectConfig.description);
    
    if (insights) {
      addMessage(oracleAgent, `✨ Extracted ${insights.features.length} features, complexity: ${insights.complexity}`, 'success');
      setProjectConfig(prev => ({ ...prev, features: insights.features, complexity: insights.complexity as ProjectConfig['complexity'] }));
    }

    const architecturePrompt = `Based on the NLP analysis, design the optimal architecture for "${projectConfig.name}". Insights: ${JSON.stringify(insights, null, 2)}. Think through the architecture pattern, technologies, key decisions, and development phases. Provide your architectural vision.`;
    const architecturalPlan = await callGeminiApi(architectAgent, architecturePrompt, '');
    createAgentConversation(architectAgent.id, architecturalPlan, 'planning');
    addMessage(architectAgent, `🏗️ Architectural plan drafted.`, 'planning');

    const projectInsightsPrompt = `Generate strategic insights for this project: innovation opportunities, competitive advantages, user experience priorities, technical challenges, and success metrics. Return as a JSON array of insight objects with: {type: string, title: string, description: string, priority: 'high'|'medium'|'low', impact: string}`;
    try {
      const insightsResponse = await callGeminiApi(oracleAgent, projectInsightsPrompt, JSON.stringify(insights), true);
      const insights_array = JSON.parse(insightsResponse);
      setProjectInsights(insights_array);
    } catch (error) {
      console.error('Failed to generate project insights:', error);
      addMessage(oracleAgent, 'Could not generate strategic insights.', 'error');
    }

    setSystemState('ready');
  };

  const startNexusGeneration = async () => {
    if (!projectConfig.name) {
      alert('Please configure your project name!');
      return;
    }

    setSystemState('initializing');
    // FIX: Correctly initialize agents to the full Agent type to prevent type errors later.
    const initialAgents: Agent[] = NEXUS_AGENTS.map(a => ({...a, status: 'idle', lastThought: '', workingMemory: []}));
    setActiveAgents(initialAgents);
    setMessages([]);
    setGeneratedFiles([]);
    setAgentConversations({});
    const systemAgent = { name: 'Nexus System', color: 'from-gradient-to-r from-blue-500 to-purple-600', id: 'system' };
    addMessage(systemAgent, `🚀 Initializing Nexus CodeGen Ecosystem for "${projectConfig.name}"`, 'system');

    try {
      await initializeAdvancedProject();
      setSystemState('running');
      setCurrentWorkflow('fullstack_generation');
      addMessage(systemAgent, '🤖 Agents are now collaborating to build your application...', 'system');

      // FIX: Use the fully-typed `initialAgents` array to find agents, ensuring they match the `Agent` type.
      const architect = initialAgents.find(a => a.id === 'nexus_architect')!;
      const db = initialAgents.find(a => a.id === 'sage_database')!;
      const backend = initialAgents.find(a => a.id === 'atlas_backend')!;
      const frontend = initialAgents.find(a => a.id === 'luna_frontend')!;
      const qa = initialAgents.find(a => a.id === 'sentinel_qa')!;
      const devops = initialAgents.find(a => a.id === 'phoenix_devops')!;
      const oracle = initialAgents.find(a => a.id === 'oracle_ai')!;
      
      await generateFile(architect, 'ARCHITECTURE.md', 'Create comprehensive architecture documentation.', ['sage_database']);
      await generateFile(db, 'prisma/schema.prisma', 'Design optimal database schema based on architectural decisions.', ['nexus_architect']);
      await generateFile(backend, 'server/index.ts', 'Create main server with all configurations and middleware.', ['nexus_architect', 'sage_database']);
      await generateFile(frontend, 'src/App.tsx', 'Create beautiful, responsive main application component.', ['atlas_backend']);
      await generateFile(qa, 'tests/e2e/user-flows.spec.ts', 'Build end-to-end user journey tests.', ['luna_frontend']);
      await generateFile(devops, 'docker-compose.yml', 'Create production-ready containerization setup.', ['nexus_architect']);
      await generateFile(oracle, 'README.md', 'Create compelling documentation that makes developers excited to use this project.');

      setSystemState('analyzing');
      addMessage(systemAgent, '📊 Performing final quality analysis...', 'system');
      
      const analysisPrompt = `Analyze the complete generated codebase and provide insights. Generated Files: ${generatedFiles.map(f => f.name).join(', ')}. Project Type: ${projectConfig.type}. Provide a comprehensive analysis including: code quality score (1-10), architecture strength assessment, security posture evaluation, performance optimization opportunities, maintainability rating, deployment readiness checklist, and recommended next steps. Return as structured JSON.`;
      const analysisJson = await callGeminiApi(oracle, analysisPrompt, JSON.stringify(generatedFiles), true);
      const analysisData = JSON.parse(analysisJson);
      setCodebaseAnalysis(analysisData);
      addMessage(oracle, `📊 Codebase Analysis Complete - Quality Score: ${analysisData.qualityScore || 'N/A'}/10`, 'success');

      setSystemState('completed');
      addMessage(systemAgent, `🎉 Nexus has successfully generated your application!`, 'success');

    } catch (error) {
      setSystemState('error');
      addMessage(systemAgent, `❌ Generation failed: ${error instanceof Error ? error.message : 'An unknown error occurred'}`, 'error');
    }
  };

  const stopNexusGeneration = () => {
    setSystemState('stopping');
    setTimeout(() => {
      setSystemState('idle');
      setCurrentWorkflow(null);
      setActiveAgents([]);
    }, 1500);
  };
  
  const downloadNexusProject = () => {
    const projectEcosystem = {
      metadata: { name: projectConfig.name, generatedAt: new new Date().toISOString(), version: '1.0.0', generator: 'Nexus CodeGen Ecosystem' },
      configuration: projectConfig,
      nlpInsights,
      projectInsights,
      files: generatedFiles,
      agentConversations,
      collaborationGraph,
      codebaseAnalysis
    };

    const blob = new Blob([JSON.stringify(projectEcosystem, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectConfig.name}-nexus-ecosystem.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white overflow-x-hidden font-sans">
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-6">
        <Header />
        <SystemStatusDisplay systemState={systemState} currentWorkflowName={currentWorkflow ? WORKFLOWS[currentWorkflow].name : null} />
        
        <div className="my-8">
            <ApiStatus />
        </div>

        {/* Elite Project Configuration */}
        <div className="bg-gradient-to-r from-gray-800/50 to-slate-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-700/50 shadow-2xl">
          <div className="flex items-center mb-6">
            {/* FIX: Replaced size prop with width and height */}
            <Icons.Settings className="mr-3 text-blue-400" width={24} height={24} />
            <h2 className="text-2xl font-bold">Elite Project Configuration</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-blue-400 mb-2">Project Name *</label>
              <input type="text" value={projectConfig.name} onChange={(e) => setProjectConfig(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600/50 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all" placeholder="my-awesome-app" />
            </div>
             <div>
              <label className="block text-sm font-semibold text-purple-400 mb-2">Project Type</label>
              <select value={projectConfig.type} onChange={(e) => setProjectConfig(p => ({ ...p, type: e.target.value as ProjectConfig['type'] }))} className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600/50 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all">
                <option value="fullstack">Full-Stack Application</option>
                <option value="frontend">Frontend SPA</option>
                <option value="api">Backend API</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-400 mb-2">Project Description & Requirements</label>
            <textarea value={projectConfig.description} onChange={(e) => setProjectConfig(p => ({ ...p, description: e.target.value }))} className="w-full px-4 py-4 bg-gray-700/80 border border-gray-600/50 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all h-32 resize-none" placeholder="Describe your vision in natural language..."></textarea>
          </div>
        </div>
        
        {/* Control Panel */}
        <div className="bg-gradient-to-r from-slate-800/60 to-gray-800/60 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-gray-700/50 shadow-2xl flex items-center justify-between">
           <div className="flex items-center">
              {/* FIX: Replaced size prop with width and height */}
              <Icons.Terminal className="mr-3 text-green-400" width={24} height={24} />
              <h2 className="text-2xl font-bold">Mission Control</h2>
            </div>
            <div className="flex gap-3">
              {systemState === 'idle' || systemState === 'completed' || systemState === 'error' || systemState === 'ready' ? (
                <button onClick={startNexusGeneration} disabled={!projectConfig.name || ['initializing', 'running', 'analyzing'].includes(systemState)} className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:shadow-none">
                  {/* FIX: Replaced size prop with width and height */}
                  <Icons.Play className="mr-2" width={18} height={18} />
                  Deploy Nexus Agents
                </button>
              ) : (
                <button onClick={stopNexusGeneration} className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                  {/* FIX: Replaced size prop with width and height */}
                  <Icons.Pause className="mr-2" width={18} height={18} />
                  Stop Mission
                </button>
              )}
              {generatedFiles.length > 0 && (
                <button onClick={downloadNexusProject} className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                  {/* FIX: Replaced size prop with width and height */}
                  <Icons.Download className="mr-2" width={18} height={18} />
                  Download Ecosystem
                </button>
              )}
            </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* FIX: Add a default status when mapping over NEXUS_AGENTS to avoid type errors. */}
            {(activeAgents.length > 0 ? activeAgents : NEXUS_AGENTS.map(a => ({...a, status: 'idle'}))).map(agent => (
                <div key={agent.id} className={`group relative bg-gradient-to-br from-gray-800/60 to-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 shadow-xl hover:shadow-2xl ${activeAgents.length === 0 ? 'opacity-70' : ''}`}>
                    <div className="flex items-start mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${agent.color} mr-4 shadow-lg`}>
                            {/* FIX: Replaced size prop with width and height */}
                            <agent.icon width={28} height={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-white">{agent.name}</h3>
                            <p className="text-sm text-gray-300 mb-2">{agent.personality}</p>
                             <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                                agent.status === 'working' ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30' :
                                agent.status === 'completed' ? 'bg-green-600/20 text-green-300 border border-green-500/30' :
                                agent.status === 'error' ? 'bg-red-600/20 text-red-300 border border-red-500/30' :
                                'bg-gray-600/20 text-gray-400 border border-gray-500/30'
                            }`}>{agent.status.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activity Log */}
            <div className="lg:col-span-2 bg-gradient-to-r from-gray-800/60 to-slate-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl">
                <div className="p-6 border-b border-gray-700/50">
                    {/* FIX: Replaced size prop with width and height */}
                    <h2 className="text-2xl font-bold flex items-center"><Icons.Activity className="mr-3 text-green-400" width={24} height={24} />System Activity Log</h2>
                </div>
                <div className="h-96 overflow-y-auto p-6">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-400 mt-12">
                            {/* FIX: Replaced size prop with width and height */}
                            <Icons.Network width={64} height={64} className="mx-auto mb-6 opacity-20" /><p className="text-lg">Nexus System Ready</p></div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className="mb-4 animate-fade-in flex items-start gap-4">
                               <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${ msg.type === 'system' ? 'bg-blue-500' : msg.type === 'working' ? 'bg-yellow-500 animate-pulse' : msg.type === 'success' ? 'bg-green-500' : msg.type === 'error' ? 'bg-red-500' : 'bg-purple-500' }`}></div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`font-bold bg-gradient-to-r ${msg.color} bg-clip-text text-transparent`}>{msg.agent}</span>
                                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                    </div>
                                    <p className={`leading-relaxed text-gray-300`}>{msg.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Generated Files */}
            <div className="lg:col-span-1 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-lg rounded-2xl border border-purple-700/30 shadow-2xl">
                 <div className="p-6 border-b border-purple-700/30">
                    {/* FIX: Replaced size prop with width and height */}
                    <h2 className="text-xl font-bold flex items-center text-purple-400"><Icons.FileCode className="mr-2" width={20} height={20} />Generated Files</h2>
                </div>
                <div className="h-96 overflow-y-auto p-4">
                    {generatedFiles.length === 0 ? (
                        <div className="text-center text-gray-400 mt-12">
                            {/* FIX: Replaced size prop with width and height */}
                            <Icons.Folder width={48} height={48} className="mx-auto mb-4 opacity-20" /><p>Files will appear here</p></div>
                    ) : (
                       <div className="space-y-3">
                        {generatedFiles.map((file, index) => (
                          <div key={index} className="group bg-gray-900/40 rounded-xl p-3 border border-gray-600/30">
                            <div className="flex items-center">
                              {/* FIX: Replaced size prop with width and height */}
                              <Icons.FileCode className="mr-3 text-blue-400 flex-shrink-0" width={20} height={20} />
                              <div className="flex-1">
                                <p className="font-mono text-sm font-semibold text-white truncate">{file.name}</p>
                                <p className="text-xs text-gray-400">by {file.agent} - {file.size} chars</p>
                              </div>
                               {/* FIX: Replaced size prop with width and height */}
                               <Icons.Check className="text-green-400 ml-2" width={16} height={16} />
                            </div>
                          </div>
                        ))}
                       </div>
                    )}
                </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
            <p>Nexus CodeGen Ecosystem - The future of AI-powered development is here</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
