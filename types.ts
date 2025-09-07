export enum AgentRole {
  CEO = 'CEO',
  CTO = 'CTO',
  SENIOR_ENGINEER = 'Senior Engineer',
  JUNIOR_ENGINEER = 'Junior Engineer',
  DEVOPS = 'DevOps Engineer',
}

export enum AgentStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  WORKING = 'WORKING',
  COMPLETED = 'COMPLETED',
}

export interface Agent {
  role: AgentRole;
  name: string;
  status: AgentStatus;
  avatar: string;
}

export interface WorkflowLog {
  id: number;
  agentRole: AgentRole | 'User' | 'System';
  message: string;
  type: 'info' | 'output' | 'error' | 'system' | 'prompt';
}