import { Agent, AgentRole, StyleDNA } from './types';
import * as Icons from './components/icons';

// The elite multi-agent team for UI component generation.
export const AGENTS: Agent[] = [
    {
        id: 'orchestrator',
        role: AgentRole.Orchestrator,
        icon: Icons.Network,
        systemPrompt: "You are the Neural Orchestrator, managing the entire UI generation workflow.",
    },
    {
        id: 'design_architect',
        role: AgentRole.DesignArchitect,
        icon: Icons.Brain,
        systemPrompt: "You are the Design Architect AI, creating innovative and user-centric UI structures.",
    },
    {
        id: 'aesthetic_curator',
        role: AgentRole.StyleCurator,
        icon: Icons.Palette,
        systemPrompt: "You are the Aesthetic Curator, ensuring the visual design is modern and appealing.",
    },
    {
        id: 'code_generator',
        role: AgentRole.CodeGenerator,
        icon: Icons.Code,
        systemPrompt: "You are the Code Synthesis Engine, writing clean, efficient, and production-ready code.",
    },
    {
        id: 'qa_guardian',
        role: AgentRole.QualityAssurance,
        icon: Icons.Shield,
        systemPrompt: "You are the Quality & Accessibility Guardian, ensuring the component meets WCAG standards.",
    },
    {
        id: 'performance_optimizer',
        role: AgentRole.PerformanceOptimizer,
        icon: Icons.Activity,
        systemPrompt: "You are the Performance Optimization Specialist, ensuring the component is fast and lightweight.",
    },
    {
        id: 'security_auditor',
        role: AgentRole.SecurityAuditor,
        icon: Icons.TestTube,
        systemPrompt: "You are the Security Compliance Auditor, ensuring the code is secure and free of vulnerabilities.",
    },
];

// Pre-defined prompts to guide users.
export const PROMPT_TEMPLATES: string[] = [
    "A responsive pricing table with three tiers and a featured plan.",
    "An interactive dashboard sidebar with nested navigation links and a user profile section.",
    "A login form with fields for email, password, social media login buttons, and a 'remember me' checkbox.",
    "A product card for an e-commerce site, including an image carousel, title, price, and 'add to cart' button.",
];

// Library of stylistic profiles for generation.
export const STYLE_DNA_LIBRARY: StyleDNA[] = [
    {
        id: 'dna_quantum',
        name: 'Quantum Minimalism',
        description: 'Clean lines, ample whitespace, and subtle gradients.',
        keywords: 'minimalist, clean, modern, professional, subtle gradients, sharp, whitespace',
    },
    {
        id: 'dna_holographic',
        name: 'Holographic Glass',
        description: 'Translucent surfaces with neon accents.',
        keywords: 'glassmorphism, acrylic, translucent, blur, neon, vibrant, futuristic, holographic',
    },
    {
        id: 'dna_brutalist',
        name: 'Neo-Brutalism',
        description: 'Bold typography, high contrast, and sharp edges.',
        keywords: 'brutalist, bold, high-contrast, sharp, blocky, raw, strong shadows',
    },
    {
        id: 'dna_organic',
        name: 'Organic & Soft',
        description: 'Rounded corners, soft shadows, and natural tones.',
        keywords: 'organic, soft, rounded, friendly, approachable, natural, calm, material design',
    }
];
