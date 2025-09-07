
import React from 'react';

export type AgentStatus = 'idle' | 'working' | 'thinking' | 'completed' | 'error';
export type AgentMood = 'focused' | 'inspired' | 'analytical' | 'contemplative' | 'determined' | 'vigilant' | 'enlightened';
export type SystemState = 'idle' | 'initializing' | 'running' | 'analyzing' | 'deploying' | 'completed' | 'error' | 'stopping' | 'ready';

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
  lastThought: string;
  workingMemory: { prompt: string; response: string; timestamp: string }[];
}

export interface ProjectConfig {
    name: string;
    description: string;
    type: 'fullstack' | 'frontend' | 'api';
    framework: 'react' | 'vue' | 'next' | 'nuxt' | 'svelte';
    database: 'postgresql' | 'mongodb' | 'mysql' | 'sqlite' | 'supabase';
    features: string[];
    complexity: 'simple' | 'intermediate' | 'advanced' | 'enterprise';
    deployment: 'vercel' | 'netlify' | 'railway' | 'aws' | 'docker';
    aiPersonality: 'collaborative' | 'innovative' | 'conservative' | 'experimental';
}

export interface NlpInsights {
    features: string[];
    complexity: string;
    suggestedTech: string[];
    userTypes: string[];
    businessGoals: string[];
    risks: string[];
    opportunities: string[];
    timeline: string;
    scalabilityNeeds: string;
    securityRequirements: string;
}

export interface GeneratedFile {
    name: string;
    content: string;
    agent: string;
    agentId: string;
    timestamp: string;
    size: number;
    planning: string;
    reflection: string;
    collaborators: string[];
}

export interface Message {
    id: number;
    agent: string;
    agentId: string;
    message: string;
    timestamp: string;
    type: 'info' | 'working' | 'thinking' | 'success' | 'error' | 'system' | 'planning';
    color: string;
}

export interface AgentConversation {
    message: string;
    type: 'thought' | 'planning' | 'reflection' | 'error';
    timestamp: string;
    id: number;
}

export interface Collaboration {
    from: string;
    to: string;
    type: 'created' | 'reviewed' | 'consulted';
    timestamp: string;
}

export interface CodebaseAnalysis {
    qualityScore?: number;
    architectureStrength?: string;
    securityScore?: string;
    maintainability?: string;
}

export interface ProjectInsight {
    type: 'opportunity' | 'risk' | 'innovation';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
}

export interface Workflow {
    name: string;
    phases: string[];
    agents: string[];
    estimatedTime: string;
}

// FIX: Added missing AgentRole enum for WorkflowLogDisplay component.
export enum AgentRole {
    CEO = 'CEO',
    CTO = 'CTO',
    SENIOR_ENGINEER = 'Senior Engineer',
    JUNIOR_ENGINEER = 'Junior Engineer',
    DEVOPS = 'DevOps',
}

// FIX: Added missing WorkflowLog interface for WorkflowLogDisplay component.
export interface WorkflowLog {
  id: number;
  agentRole: AgentRole | 'User';
  type: 'info' | 'prompt' | 'output' | 'error' | 'system';
  message: string;
}
