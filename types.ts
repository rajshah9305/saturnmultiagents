import React from 'react';

// The distinct phases of the application's workflow.
export type WorkflowPhase = 'idle' | 'generating' | 'refining' | 'error';

// The operational status of an individual AI agent.
export type AgentStatus = 
  | 'dormant'      // Not activated
  | 'initializing' // Starting up
  | 'analyzing'    // Processing input
  | 'creating'     // Active generation
  | 'validating'   // Quality check
  | 'optimizing'   // Enhancement phase
  | 'completed'    // Task finished
  | 'error';       // Failed state

// Defines the role of an agent within the AI team.
export enum AgentRole {
  Orchestrator = "Neural Orchestrator",
  DesignArchitect = "Design Architect AI",
  StyleCurator = "Aesthetic Curator",
  CodeGenerator = "Code Synthesis Engine",
  QualityAssurance = "Quality & Accessibility Guardian",
  PerformanceOptimizer = "Performance Optimization Specialist",
  SecurityAuditor = "Security Compliance Auditor"
}

// Represents an AI agent in the system.
export interface Agent {
  id: string;
  role: AgentRole;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  systemPrompt: string;
}

// Represents a single generated UI component variant.
export interface Variant {
  id: string;
  name: string;
  style: string;
  novelty: number;
  accessibility_score: number;
  preview: string; // Sanitized HTML string
  code: string; // Raw React component code string
  dependencies: string[];
}

// Represents a stylistic profile that guides the generation process.
export interface StyleDNA {
  id: string;
  name: string;
  description: string;
  keywords: string;
}

// Represents the entire application state, managed by a reducer.
export interface AppState {
  workflowPhase: WorkflowPhase;
  agentStatuses: Record<string, AgentStatus>;
  variants: Variant[];
  selectedVariantId: string | null;
  prompt: string;
  activeStyleDna: StyleDNA;
  error: string | null;
  refinementPrompt: string;
}

// Represents all possible actions for the app reducer.
export type Action =
  | { type: 'START_GENERATION' }
  | { type: 'START_REFINEMENT' }
  | { type: 'SET_VARIANTS'; payload: Variant[] }
  | { type: 'UPDATE_VARIANT'; payload: Variant }
  | { type: 'WORKFLOW_STEP'; payload: { agentId: string; status: AgentStatus } }
  | { type: 'WORKFLOW_COMPLETE'; payload: { success: boolean } }
  | { type: 'SET_SELECTED_VARIANT'; payload: string }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_REFINEMENT_PROMPT'; payload: string }
  | { type: 'SET_STYLE_DNA'; payload: StyleDNA }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

// Represents a message in the chat console history.
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

// FIX: Added WorkflowLog type, which was used in WorkflowLogDisplay but not defined.
// Represents a log entry in the workflow display.
export interface WorkflowLog {
  id: string;
  type: 'info' | 'prompt' | 'output' | 'error' | 'system';
  agentRole: AgentRole | 'User';
  message: string;
}
