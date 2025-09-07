import React from 'react';
import { AgentStatus } from '../types';
import { AGENTS } from '../constants';

interface AgentWorkflowProps {
    statuses: Record<string, AgentStatus>;
    onCancel: () => void;
}

const AgentWorkflow = ({ statuses, onCancel }: AgentWorkflowProps) => {

    const connections: [number, number][] = [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]
    ];

    const centerAgent = AGENTS[0];
    const orbitalAgents = AGENTS.slice(1);
    const radius = 35; // as a percentage of height
    const agentPositions = [
        { top: '50%', left: '50%' }, // Orchestrator
        ...orbitalAgents.map((_, index) => {
            const angle = (index / orbitalAgents.length) * 2 * Math.PI - (Math.PI / 2); // Start from top
            const top = 50 + radius * Math.sin(angle);
            const left = 50 + (radius * 1.1) * Math.cos(angle); // Use 1.1 ratio for wider ellipse
            return { top: `${top}%`, left: `${left}%` };
        })
    ];

    const getNodeClasses = (status: AgentStatus) => {
        const base = 'agent-node';
        const statusClass = `status-${status}`;
        const isActive = status !== 'dormant' && status !== 'completed';
        
        let colorClass = 'border-neural-gray-700/50';
        let glowStyle = {};

        switch (status) {
            case 'initializing':
            case 'analyzing':
                colorClass = 'border-ai-blue-primary';
                glowStyle = { 'color': 'var(--ai-blue-primary)', 'boxShadow': '0 0 24px var(--ai-blue-primary), inset 0 0 8px var(--ai-blue-primary)'};
                break;
            case 'creating':
                colorClass = 'border-ai-purple-secondary';
                glowStyle = { 'color': 'var(--ai-purple-secondary)', 'boxShadow': '0 0 24px var(--ai-purple-secondary), inset 0 0 8px var(--ai-purple-secondary)' };
                break;
            case 'validating':
                colorClass = 'border-ai-amber-warning';
                glowStyle = { 'color': 'var(--ai-amber-warning)', 'boxShadow': '0 0 24px var(--ai-amber-warning), inset 0 0 8px var(--ai-amber-warning)'};
                break;
            case 'optimizing':
                colorClass = 'border-ai-cyan-accent';
                glowStyle = { 'color': 'var(--ai-cyan-accent)', 'boxShadow': '0 0 24px var(--ai-cyan-accent), inset 0 0 8px var(--ai-cyan-accent)'};
                break;
            case 'completed':
                colorClass = 'border-ai-emerald-success';
                break;
            case 'error':
                colorClass = 'border-ai-red-error';
                glowStyle = { 'color': 'var(--ai-red-error)', 'boxShadow': '0 0 24px var(--ai-red-error), inset 0 0 8px var(--ai-red-error)'};
                break;
        }

        return {
            wrapper: `${base} ${statusClass} ${isActive ? 'status-active' : ''}`,
            ring: `${colorClass} ${isActive ? 'agent-glow' : ''}`,
            glowStyle: isActive ? glowStyle : {}
        };
    };

    return (
        <div className="fixed inset-0 bg-neural-gray-900/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fade-in">
            <div className="absolute inset-0 workflow-grid-bg"></div>
            <div className="w-full h-full relative">
                
                {/* Connections and Pulses */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" style={{ transform: 'scale(1.1)' }}>
                    <defs>
                        <linearGradient id="path-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
                            <stop offset="0%" stopColor="var(--ai-cyan-accent)" />
                            <stop offset="100%" stopColor="var(--ai-purple-secondary)" />
                        </linearGradient>
                         <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <g transform={`translate(-${50} -${50}) scale(${window.innerWidth / 100} ${window.innerHeight / 100})`}>
                        {connections.map(([from, to]) => {
                            const fromAgent = AGENTS[from];
                            const toAgent = AGENTS[to];
                            const pathId = `path-${from}-${to}`;
                            const isActive = statuses[fromAgent.id] && statuses[fromAgent.id] !== 'dormant' && statuses[toAgent.id] && statuses[toAgent.id] !== 'dormant';
                            
                            const p1 = { x: parseFloat(agentPositions[from].left), y: parseFloat(agentPositions[from].top) };
                            const p2 = { x: parseFloat(agentPositions[to].left), y: parseFloat(agentPositions[to].top) };

                            return (
                                <g key={pathId} className={`transition-opacity duration-500 ${isActive ? 'opacity-50' : 'opacity-0'}`}>
                                    <line
                                        x1={p1.x} y1={p1.y}
                                        x2={p2.x} y2={p2.y}
                                        stroke="var(--neural-gray-700)"
                                        strokeWidth="0.1"
                                    />
                                     {isActive && (
                                        <line
                                            x1={p1.x} y1={p1.y}
                                            x2={p2.x} y2={p2.y}
                                            stroke="url(#path-gradient)"
                                            strokeWidth="0.2"
                                            className="data-flow-path"
                                            filter="url(#glow)"
                                        />
                                     )}
                                </g>
                            );
                        })}
                    </g>
                </svg>

                {/* Agent Nodes */}
                {AGENTS.map((agent, index) => {
                    const status = statuses[agent.id] || 'dormant';
                    const { wrapper, ring, glowStyle } = getNodeClasses(status);
                    
                    return (
                        <div
                            key={agent.id}
                            className={`absolute -translate-x-1/2 -translatey-1/2 w-36 h-36 ${wrapper}`}
                            style={agentPositions[index]}
                        >
                            <div className="relative w-full h-full flex flex-col items-center justify-center p-3 text-center">
                                <div className="absolute inset-0 rounded-full agent-node-core"></div>
                                <div className={`agent-node-ring ${ring}`} style={glowStyle}></div>
                                
                                <div className="relative z-10 flex flex-col items-center justify-center">
                                    <agent.icon className="w-8 h-8 text-quantum-white mb-1.5" />
                                    <h3 className="font-bold text-sm text-quantum-white leading-tight">{agent.role.split(' ')[0]}</h3>
                                    <p className="text-xs text-neural-gray-300 capitalize">{status}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-10 text-center text-neural-gray-200">
                <p className="text-lg font-bold">AI Agent Workflow is in Progress</p>
                <p className="text-sm text-neural-gray-300">The multi-agent team is collaborating to generate your component.</p>
            </div>

            <button onClick={onCancel} className="absolute top-6 right-6 px-4 py-2 bg-neural-gray-800/80 text-neural-gray-200 rounded-lg hover:bg-neural-gray-700 transition-colors text-sm">
                Cancel Generation
            </button>
        </div>
    );
};

export default AgentWorkflow;