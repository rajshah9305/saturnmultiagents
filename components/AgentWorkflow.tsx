import React from 'react';
import { AgentStatus } from '../types';
import { AGENTS } from '../constants';

interface AgentWorkflowProps {
    statuses: Record<string, AgentStatus>;
    onCancel: () => void;
}

const AgentWorkflow = ({ statuses, onCancel }: AgentWorkflowProps) => {
    const positions = [
      { top: '15%', left: '50%', transform: 'translateX(-50%)' }, // Orchestrator
      { top: '35%', left: '25%', transform: 'translate(-50%, -50%)' }, // Design Architect
      { top: '35%', left: '75%', transform: 'translate(-50%, -50%)' }, // Aesthetic Curator
      { top: '65%', left: '25%', transform: 'translate(-50%, -50%)' }, // Code Generator
      { top: '65%', left: '75%', transform: 'translate(-50%, -50%)' }, // QA Guardian
      { top: '85%', left: '40%', transform: 'translate(-50%, -50%)' }, // Performance
      { top: '85%', left: '60%', transform: 'translate(-50%, -50%)' }, // Security
    ];
    
    // [from, to] indices of agents in the AGENTS array
    const connections = [
        [0, 1], [0, 2], // Orchestrator to Design/Aesthetic
        [1, 3], [2, 3], // Design/Aesthetic to Code Gen
        [3, 4], [3, 5], [3, 6] // Code Gen to QA/Perf/Sec
    ];

    const getStatusStyles = (status: AgentStatus) => {
        switch (status) {
            case 'initializing': return 'border-ai-blue-primary/80 shadow-[0_0_20px_var(--ai-blue-primary)] animate-pulse';
            case 'analyzing': return 'border-ai-blue-primary/80 shadow-[0_0_20px_var(--ai-blue-primary)]';
            case 'creating': return 'border-ai-purple-secondary/80 shadow-[0_0_25px_var(--ai-purple-secondary)] animate-quantum-pulse';
            case 'validating': return 'border-ai-amber-warning/80 shadow-[0_0_20px_var(--ai-amber-warning)]';
            case 'optimizing': return 'border-ai-cyan-accent/80 shadow-[0_0_20px_var(--ai-cyan-accent)]';
            case 'completed': return 'border-ai-emerald-success/80';
            case 'error': return 'border-ai-red-error/80 shadow-[0_0_20px_var(--ai-red-error)]';
            default: return 'border-neural-gray-700'; // dormant
        }
    };
    
    return (
      <div className="fixed inset-0 bg-neural-gray-900/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fade-in">
        <div className="w-full h-full relative">
            {/* Neural Lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--ai-blue-primary)" />
                        <stop offset="100%" stopColor="var(--ai-purple-secondary)" />
                    </linearGradient>
                </defs>
                {connections.map(([from, to], i) => {
                    const fromAgent = AGENTS[from];
                    const toAgent = AGENTS[to];
                     if (!statuses[fromAgent.id] || statuses[fromAgent.id] === 'dormant' || !statuses[toAgent.id] || statuses[toAgent.id] === 'dormant') {
                        return null;
                     }
                    return (
                        <line
                            key={`${from}-${to}`}
                            x1={positions[from].left} y1={positions[from].top}
                            x2={positions[to].left} y2={positions[to].top}
                            stroke="url(#line-gradient)"
                            strokeWidth="2"
                            opacity="0.5"
                            className="neural-line"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    );
                })}
            </svg>
            
            {/* Agent Cards */}
            {AGENTS.map((agent, index) => (
                <div key={agent.id}
                     className={`absolute w-48 h-24 bg-neural-gray-800/80 rounded-lg border-2 p-3 flex flex-col justify-center text-center transition-all duration-500 ${getStatusStyles(statuses[agent.id])}`}
                     style={positions[index]}>
                    <div className="flex items-center justify-center gap-2">
                        <agent.icon className="w-5 h-5 text-quantum-white" />
                        <h3 className="font-bold text-sm text-quantum-white">{agent.role.split(' ')[0]}</h3>
                    </div>
                    <p className="text-xs text-neural-gray-200 capitalize mt-1">{statuses[agent.id] || 'dormant'}</p>
                     {statuses[agent.id] === 'validating' && <div className="holographic-scan-line"></div>}
                </div>
            ))}
        </div>
        <button onClick={onCancel} className="absolute bottom-10 px-6 py-2 bg-ai-red-error/80 text-white rounded-lg hover:bg-ai-red-error">
            Cancel Generation
        </button>
      </div>
    );
};

export default AgentWorkflow;
