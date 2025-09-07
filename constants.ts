
import { Agent, AgentRole, AgentStatus } from './types';

export const INITIAL_AGENTS: Agent[] = [
  {
    role: AgentRole.CEO,
    name: 'Orion',
    status: AgentStatus.IDLE,
    avatar: 'https://i.pravatar.cc/150?u=ceo',
  },
  {
    role: AgentRole.CTO,
    name: 'Lyra',
    status: AgentStatus.IDLE,
    avatar: 'https://i.pravatar.cc/150?u=cto',
  },
  {
    role: AgentRole.SENIOR_ENGINEER,
    name: 'Leo',
    status: AgentStatus.IDLE,
    avatar: 'https://i.pravatar.cc/150?u=senior',
  },
  {
    role: AgentRole.JUNIOR_ENGINEER,
    name: 'Cygnus',
    status: AgentStatus.IDLE,
    avatar: 'https://i.pravatar.cc/150?u=junior',
  },
  {
    role: AgentRole.DEVOPS,
    name: 'Aquila',
    status: AgentStatus.IDLE,
    avatar: 'https://i.pravatar.cc/150?u=devops',
  },
];
