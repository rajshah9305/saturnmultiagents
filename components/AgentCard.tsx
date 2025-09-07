

import React from 'react';
// FIX: Modified component props and logic to align with the project's defined types.
import { Agent, AgentStatus } from '../types';

interface AgentCardProps {
  agent: Agent;
  status: AgentStatus;
}

const getStatusStyles = (status: AgentStatus): { dot: string; text: string; pulse: boolean, card: string } => {
  switch (status) {
    case 'dormant':
      return { dot: 'bg-gray-500', text: 'text-gray-400', pulse: false, card: '' };
    case 'analyzing':
      return { dot: 'bg-yellow-400', text: 'text-yellow-300', pulse: true, card: 'border-yellow-500/50' };
    case 'creating':
      return { dot: 'bg-blue-400', text: 'text-blue-300', pulse: true, card: 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' };
    case 'completed':
      return { dot: 'bg-green-500', text: 'text-green-400', pulse: false, card: 'border-green-500/50' };
    case 'initializing':
      return { dot: 'bg-blue-400', text: 'text-blue-300', pulse: true, card: 'border-blue-500/50' };
    case 'validating':
      return { dot: 'bg-orange-400', text: 'text-orange-300', pulse: true, card: 'border-orange-500/50' };
    case 'optimizing':
      return { dot: 'bg-teal-400', text: 'text-teal-300', pulse: true, card: 'border-teal-500/50' };
    case 'error':
      return { dot: 'bg-red-500', text: 'text-red-400', pulse: false, card: 'border-red-500/50' };
    default:
      return { dot: 'bg-gray-500', text: 'text-gray-400', pulse: false, card: '' };
  }
};

const AgentCard: React.FC<AgentCardProps> = ({ agent, status }) => {
  const { dot, text, pulse, card } = getStatusStyles(status);

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center text-center transition-all transform hover:scale-105 hover:border-indigo-500 ${card}`}>
      <div className="w-16 h-16 rounded-full mb-3 border-2 border-gray-600 flex items-center justify-center">
        <agent.icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-3">{agent.role}</h3>
      <div className="flex items-center">
        <span className={`relative flex h-3 w-3 mr-2`}>
            <span className={`${dot} rounded-full h-full w-full`}></span>
            {pulse && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dot} opacity-75`}></span>}
        </span>
        <span className={`text-xs font-medium ${text} capitalize`}>{status}</span>
      </div>
    </div>
  );
};

export default AgentCard;
