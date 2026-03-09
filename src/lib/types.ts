import { LucideIcon } from "lucide-react";

export type User = {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    role: 'Gerente' | 'Atendente' | 'Motorista' | 'IA' | 'System' | 'Cliente';
};

export type Message = {
    id: string;
    conversationId: string;
    sender: User;
    content: string;
    timestamp: string;
    type: 'text' | 'image' | 'audio' | 'file' | 'suggestion';
};

export type Conversation = {
    id: string;
    customerName: string;
    customerAvatar?: string;
    lastMessage: string;
    lastMessageTimestamp: string;
    channel: 'whatsapp' | 'instagram' | 'facebook' | 'website';
    status: 'open' | 'closed' | 'pending';
    agent: User;
};

export type Lead = {
    id: string;
    name: string;
    stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
    value: number;
    agent: User;
    source: 'whatsapp' | 'instagram' | 'facebook' | 'website' | 'email' | 'manual';
    priority: 'low' | 'medium' | 'high';
    lastUpdate: string;
    avatar?: string;
};

export type Booking = {
    id: string;
    customerName: string;
    service: string;
    date: string;
    driver: string;
    vehicle: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
    value: number;
};

export type Quote = {
    id: string;
    customerName: string;
    title: string;
    date: string;
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
    total: number;
};

export type CalendarEvent = {
    id: string;
    title: string;
    start: string;
    end: string;
    color: string;
    type: 'booking' | 'task' | 'reminder';
    bookingId?: string;
};

export type KnowledgeBaseArticle = {
    id: string;
    title: string;
    category: string;
    lastUpdated: string;
    author: string;
    summary: string;
};

export type NavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
    badge?: number;
};

export type Company = {
    id: string;
    name: string;
    logo?: string;
};

export type Plan = {
    name: string;
    price: string;
    features: string[];
    cta: string;
    popular?: boolean;
};

export type TeamMember = {
    id: string;
    name?: string;
    email: string;
    role: 'Gerente' | 'Atendente' | 'Motorista';
    status: 'active' | 'inactive' | 'pending';
};
