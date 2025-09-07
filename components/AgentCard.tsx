import React from 'react';
import { Agent, AgentStatus } from '../types';

interface AgentCardProps {
  agent: Agent;
}

const getStatusStyles = (status: AgentStatus): { dot: string; text: string; pulse: boolean, card: string } => {
  switch (status) {
    case AgentStatus.IDLE:
      return { dot: 'bg-gray-500', text: 'text-gray-400', pulse: false, card: '' };
    case AgentStatus.THINKING:
      return { dot: 'bg-yellow-400', text: 'text-yellow-300', pulse: true, card: 'border-yellow-500/50' };
    case AgentStatus.WORKING:
      return { dot: 'bg-blue-400', text: 'text-blue-300', pulse: true, card: 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' };
    case AgentStatus.COMPLETED:
      return { dot: 'bg-green-500', text: 'text-green-400', pulse: false, card: 'border-green-500/50' };
    default:
      return { dot: 'bg-gray-500', text: 'text-gray-400', pulse: false, card: '' };
  }
};

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const { dot, text, pulse, card } = getStatusStyles(agent.status);

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center text-center transition-all transform hover:scale-105 hover:border-indigo-500 ${card}`}>
      <img
        src={agent.avatar}
        alt={agent.name}
        className="w-16 h-16 rounded-full mb-3 border-2 border-gray-600"
      />
      <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
      <p className="text-sm text-indigo-400 mb-3">{agent.role}</p>
      <div className="flex items-center">
        <span className={`relative flex h-3 w-3 mr-2`}>
            <span className={`${dot} rounded-full h-full w-full`}></span>
            {pulse && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dot} opacity-75`}></span>}
        </span>
        <span className={`text-xs font-medium ${text}`}>{agent.status}</span>
      </div>
    </div>
  );
};

export default AgentCard;