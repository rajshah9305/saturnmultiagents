import React from 'react';

export type AgentStatus = 'idle' | 'working' | 'thinking' | 'completed' | 'error';
export type AgentMood = 'focused' | 'inspired' | 'analytical' | 'contemplative' | 'determined' | 'vigilant' | 'enlightened';
export type SystemState = 'idle' | 'initializing' | 'analyzing' | 'planning' | 'generating' | 'completed' | 'error';

export interface Agent {
  id: string;
  name: string;
  role: string;
  personality: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  model: string;
  conversationalStyle: string;
  mood: AgentMood;
  systemPrompt: string;
  specialties: string[];
  status: AgentStatus;
  currentTask: string;
  lastThought: string;
  workingMemory: { prompt: string; response: string; timestamp: string }[];
}

export interface GeneratedFile {
    name: string;
    content: string;
    agent: string;
    agentId: string;
    timestamp: string;
    size: number;
}

export interface BlueprintNode {
    fileName: string;
    description: string;
}

// FIX: Added missing types to resolve import errors.
export interface Workflow {
  name: string;
  phases: string[];
  agents: string[];
  estimatedTime: string;
}

export enum AgentRole {
    CEO = 'Project CEO',
    CTO = 'Chief Technology Officer',
    SENIOR_ENGINEER = 'Senior Engineer',
    JUNIOR_ENGINEER = 'Junior Engineer',
    DEVOPS = 'DevOps Engineer',
}

export interface WorkflowLog {
  id: string;
  type: 'info' | 'prompt' | 'output' | 'error' | 'system';
  agentRole: AgentRole | 'User';
  message: string;
}
