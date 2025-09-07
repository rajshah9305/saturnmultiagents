
import React, { useRef, useEffect } from 'react';
// FIX: Added WorkflowLog and AgentRole to types.ts to resolve import error.
import { WorkflowLog, AgentRole } from '../types';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';

const getIconForRole = (role: WorkflowLog['agentRole']) => {
  switch (role) {
    case 'User':
      return <UserIcon className="w-6 h-6 text-indigo-400" />;
    default:
      return <BotIcon className="w-6 h-6 text-purple-400" />;
  }
};

const getLogStyles = (type: WorkflowLog['type']) => {
    switch(type) {
        case 'info': return 'text-blue-300 italic';
        case 'prompt': return 'text-gray-200';
        case 'output': return 'text-gray-200';
        case 'error': return 'text-red-400 font-semibold';
        case 'system': return 'text-green-400 font-bold text-center py-2';
        default: return 'text-gray-300';
    }
}

const ROLE_COLORS: Record<string, string> = {
    [AgentRole.CEO]: 'border-l-purple-400',
    [AgentRole.CTO]: 'border-l-blue-400',
    [AgentRole.SENIOR_ENGINEER]: 'border-l-teal-400',
    [AgentRole.JUNIOR_ENGINEER]: 'border-l-yellow-400',
    [AgentRole.DEVOPS]: 'border-l-orange-400',
    'User': 'border-l-indigo-400',
};


interface WorkflowLogDisplayProps {
  logs: WorkflowLog[];
}

const WorkflowLogDisplay: React.FC<WorkflowLogDisplayProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div ref={scrollRef} className="h-96 overflow-y-auto bg-gray-900 rounded-lg p-4 space-y-4">
      {logs.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          Workflow will appear here...
        </div>
      ) : (
        logs.map((log) => {
          const borderColor = ROLE_COLORS[log.agentRole] || 'border-l-gray-500';
          return (
            <div key={log.id} className={`flex items-start gap-3 animate-fade-in ${log.type === 'system' ? 'justify-center' : ''}`}>
               {log.type !== 'system' && (
                  <div className="flex-shrink-0 bg-gray-700 p-2 rounded-full">
                      {getIconForRole(log.agentRole)}
                  </div>
               )}
              <div className={`flex-grow ${log.type !== 'system' ? `bg-gray-700/50 rounded-lg p-3 border-l-4 ${borderColor}` : ''}`}>
                {log.type !== 'system' && <p className="font-bold text-sm text-indigo-300 mb-1">{log.agentRole}</p>}
                <p className={`text-sm whitespace-pre-wrap ${getLogStyles(log.type)}`}>
                    {log.message}
                    {log.type === 'output' && !log.message && <span className="inline-block w-1 h-4 bg-white animate-pulse ml-1" />}
                </p>
              </div>
            </div>
          );
        })
      )}
      <div ref={logEndRef} />
    </div>
  );
};

export default WorkflowLogDisplay;
