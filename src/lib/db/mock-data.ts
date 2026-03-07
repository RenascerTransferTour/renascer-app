/**
 * @fileoverview Mock Database Seed Data
 * 
 * This file contains all the initial data for the application's mock database.
 * It acts as a seeder, populating the in-memory data structures that the
 * repository layer will interact with.
 */

import { subDays, addDays, setHours, setMinutes, subMinutes } from 'date-fns';
import type { 
    Operator, Contact, Channel, Lead, Conversation, Message, Quote, Reservation, CalendarEvent, Deal, 
    AiSettings, AiFlowPermission, AiProviderConfig, AiPrompt, AuditLog, KnowledgeBaseArticle
} from './data-model';

const now = new Date();

// --- Seed Data (immutable originals) ---

export const originalOperators: Operator[] = [
    { id: 'op-1', fullName: 'Cláudia Vaz', email: 'claudia@renascer.ai', role: 'admin', active: true, avatar: 'https://picsum.photos/seed/99/100/100', createdAt: subDays(now, 30).toISOString(), updatedAt: now.toISOString() },
    { id: 'op-2', fullName: 'Carlos', email: 'carlos@renascer.ai', role: 'agent', active: true, avatar: 'https://picsum.photos/seed/98/100/100', createdAt: subDays(now, 30).toISOString(), updatedAt: now.toISOString() },
    { id: 'IA', fullName: 'Assistente IA', email: 'ia@renascer.ai', role: 'agent', active: true, avatar: '', createdAt: subDays(now, 30).toISOString(), updatedAt: now.toISOString() },
];

export const originalContacts: Contact[] = [
  {
    id: 'contact-1',
    fullName: 'Ana Silva',
    email: 'ana.silva@example.com',
    phone: '+55 11 98765-4321',
    avatar: 'https://picsum.photos/seed/1/100/100',
    language: 'pt-BR',
    isInternal: false,
    createdAt: subDays(now, 2).toISOString(),
    updatedAt: subDays(now, 2).toISOString(),
  },
  {
    id: 'contact-2',
    fullName: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    phone: '+55 21 91234-5678',
    avatar: 'https://picsum.photos/seed/2/100/100',
    language: 'pt-BR',
    isInternal: false,
    createdAt: subDays(now, 5).toISOString(),
    updatedAt: subDays(now, 5).toISOString(),
  },
  {
    id: 'contact-3',
    fullName: 'Carla Dias (Empresa S.A.)',
    email: 'carla.dias@empresa.com',
    phone: '+55 31 99999-8888',
    avatar: 'https://picsum.photos/seed/3/100/100',
    language: 'pt-BR',
    isInternal: false,
    createdAt: subDays(now, 1).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
  },
  {
    id: 'contact-4',
    fullName: 'Daniel Martins',
    email: 'daniel.martins@example.com',
    phone: '+55 81 98888-7777',
    avatar: 'https://picsum.photos/seed/4/100/100',
    language: 'pt-BR',
    isInternal: false,
    createdAt: subDays(now, 10).toISOString(),
    updatedAt: subDays(now, 10).toISOString(),
  },
];

export const originalChannels: Channel[] = [
    { id: 'channel-wa', name: 'WhatsApp', type: 'whatsapp', status: 'awaiting_qr', aiEnabled: true, requiresHuman: false, provider: 'automatic', lastChecked: now.toISOString(), createdAt: subDays(now, 30).toISOString(), updatedAt: now.toISOString() },
    { id: 'channel-ig', name: 'Instagram', type: 'instagram', status: 'failing', aiEnabled: false, requiresHuman: true, provider: 'automatic', lastChecked: subDays(now, 1).toISOString(), lastError: 'Token de acesso inválido ou expirado.', createdAt: subDays(now, 30).toISOString(), updatedAt: subDays(now, 1).toISOString() },
    { id: 'channel-fb', name: 'Facebook', type: 'facebook', status: 'connected', aiEnabled: true, requiresHuman: true, provider: 'automatic', lastChecked: now.toISOString(), createdAt: subDays(now, 30).toISOString(), updatedAt: now.toISOString() },
    { id: 'channel-web', name: 'Website', type: 'website', status: 'connected', aiEnabled: true, requiresHuman: false, provider: 'gemini', lastChecked: now.toISOString(), createdAt: subDays(now, 30).toISOString(), updatedAt: now.toISOString() },
];

export const originalLeads: Lead[] = [];

export const originalMessages: Message[] = [
    { id: 'msg-1-1', conversationId: 'conv-1', senderType: 'user', content: 'Olá, gostaria de um orçamento para um transfer para o aeroporto de Guarulhos.', contentType: 'text', deliveryStatus: 'read', createdAt: subDays(now, 2).toISOString() },
    { id: 'msg-1-2', conversationId: 'conv-1', senderType: 'ai', authorName: "Assistente IA", content: 'Olá, Ana! Seja bem-vinda à Renascer. Para qual data e horário você precisa do transfer? E qual o local de partida?', contentType: 'text', deliveryStatus: 'read', createdAt: subDays(now, 2).toISOString() },
    { id: 'msg-1-3', conversationId: 'conv-1', senderType: 'user', content: 'Seria para o dia 28, às 15h. Partindo da Av. Paulista.', contentType: 'text', deliveryStatus: 'read', createdAt: subDays(now, 2).toISOString() },
    { id: 'msg-1-4', conversationId: 'conv-1', senderType: 'ai', authorName: "Assistente IA", content: 'Entendido, Ana. Coletei as informações. A Cláudia, nossa especialista em orçamentos, irá preparar sua proposta e entrará em contato em breve.', contentType: 'text', deliveryStatus: 'read', createdAt: subDays(now, 2).toISOString() },
    { id: 'msg-1-5', conversationId: 'conv-1', senderType: 'agent', authorName: 'Cláudia Vaz', content: 'Olá Ana, aqui é a Cláudia. Recebi sua solicitação. Preparei seu orçamento para o transfer executivo. Ele já está disponível para sua aprovação.', contentType: 'text', deliveryStatus: 'sent', createdAt: subDays(now, 1).toISOString() },
    { id: 'msg-2-1', conversationId: 'conv-2', senderType: 'user', content: 'Oi, vcs fazem viagens para Campos do Jordão? Saindo do Rio.', contentType: 'text', deliveryStatus: 'read', createdAt: subDays(now, 5).toISOString() },
    { id: 'msg-2-2', conversationId: 'conv-2', senderType: 'ai', authorName: "Assistente IA", content: 'Oi, Bruno! Fazemos sim. Uma excelente escolha de destino! Para quantas pessoas e qual data você estaria planejando?', contentType: 'text', deliveryStatus: 'read', createdAt: subDays(now, 5).toISOString() },
    { id: 'msg-3-1', conversationId: 'conv-3', senderType: 'user', content: 'PRECISO URGENTE de um contato para transporte de diretoria para um evento. Me liguem!', contentType: 'text', deliveryStatus: 'read', createdAt: subDays(now, 1).toISOString() },
    { id: 'msg-3-2', conversationId: 'conv-3', senderType: 'ai', authorName: "Assistente IA", content: 'Entendido, Carla. Sua solicitação foi marcada como urgente. Um de nossos especialistas em atendimento corporativo entrará em contato em breve. Poderia nos informar o nome da empresa, por favor?', contentType: 'text', deliveryStatus: 'read', createdAt: subDays(now, 1).toISOString() },
    { id: 'msg-3-3', conversationId: 'conv-3', senderType: 'user', content: 'Empresa S.A. O telefone é (31) 99999-8888', contentType: 'text', deliveryStatus: 'read', createdAt: subDays(now, 1).toISOString() },
    { id: 'msg-4-1', conversationId: 'conv-4', senderType: 'user', content: 'Qual o email de vocês?', contentType: 'text', deliveryStatus: 'read', createdAt: subDays(now, 10).toISOString() },
    { id: 'msg-4-2', conversationId: 'conv-4', senderType: 'ai', authorName: "Assistente IA", content: 'Olá! Nosso e-mail para contato é contato@renascertour.com.br. Em que podemos ajudar?', contentType: 'text', deliveryStatus: 'read', createdAt: subDays(now, 10).toISOString() },
];

export const originalConversations: Conversation[] = [
  {
    id: 'conv-1',
    contactId: 'contact-1',
    channelId: 'channel-wa',
    status: 'aguardando humano',
    priority: 'medium',
    isAiActive: false,
    humanOwnerId: 'op-1', // Cláudia
    aiMode: 'assisted',
    lastMessage: 'Olá Ana, aqui é a Cláudia. Recebi sua solicitação. Preparei seu orçamento...',
    lastMessageAt: subDays(now, 1).toISOString(),
    startedAt: subDays(now, 2).toISOString(),
    createdAt: subDays(now, 2).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
  },
  {
    id: 'conv-2',
    contactId: 'contact-2',
    channelId: 'channel-ig',
    status: 'IA assistida',
    priority: 'low',
    isAiActive: true,
    aiMode: 'assisted',
    lastMessage: 'Oi, Bruno! Fazemos sim. Uma excelente escolha de destino! Para quantas pessoas e qual data você estaria planejando?',
    lastMessageAt: subDays(now, 5).toISOString(),
    startedAt: subDays(now, 5).toISOString(),
    createdAt: subDays(now, 5).toISOString(),
    updatedAt: subDays(now, 5).toISOString(),
  },
  {
    id: 'conv-3',
    contactId: 'contact-3',
    channelId: 'channel-fb',
    status: 'open',
    priority: 'high',
    isAiActive: false,
    aiMode: 'off',
    humanOwnerId: 'op-2', // Carlos
    lastMessage: 'Empresa S.A. O telefone é (31) 99999-8888',
    lastMessageAt: subDays(now, 1).toISOString(),
    startedAt: subDays(now, 1).toISOString(),
    createdAt: subDays(now, 1).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
  },
  {
    id: 'conv-4',
    contactId: 'contact-4',
    channelId: 'channel-web',
    status: 'closed',
    priority: 'low',
    isAiActive: true,
    aiMode: 'full_autonomous',
    lastMessage: 'Olá! Nosso e-mail para contato é contato@renascertour.com.br. Em que podemos ajudar?',
    lastMessageAt: subDays(now, 10).toISOString(),
    startedAt: subDays(now, 10).toISOString(),
    createdAt: subDays(now, 10).toISOString(),
    updatedAt: subDays(now, 10).toISOString(),
  },
  {
    id: 'conv-5',
    contactId: 'contact-2',
    channelId: 'channel-wa',
    status: 'canceled',
    priority: 'low',
    isAiActive: false,
    aiMode: 'off',
    humanOwnerId: 'op-1', // Cláudia
    lastMessage: 'Infelizmente precisei cancelar a viagem. Fica para a próxima.',
    lastMessageAt: subDays(now, 3).toISOString(),
    startedAt: subDays(now, 4).toISOString(),
    createdAt: subDays(now, 4).toISOString(),
    updatedAt: subDays(now, 3).toISOString(),
  },
  {
    id: 'conv-6',
    contactId: 'contact-4',
    channelId: 'channel-ig',
    status: 'unconfirmed',
    priority: 'medium',
    isAiActive: false,
    aiMode: 'assisted',
    humanOwnerId: 'op-1', // Cláudia
    lastMessage: 'Ainda estou aguardando a confirmação do meu voo para fechar o transfer.',
    lastMessageAt: subDays(now, 4).toISOString(),
    startedAt: subDays(now, 5).toISOString(),
    createdAt: subDays(now, 5).toISOString(),
    updatedAt: subDays(now, 4).toISOString(),
  },
];

export const originalQuotes: Quote[] = [
  { id: 'quote-1', leadId: 'lead-1', contactId: 'contact-1', conversationId: 'conv-1', status: 'enviado', summary: 'Transfer Executivo: Av. Paulista para Aeroporto GRU', priceRange: [280, 350], finalValue: 320, createdAt: subDays(now, 1).toISOString(), updatedAt: subDays(now, 1).toISOString(), approvedByAi: false, approvedByHumanId: 'op-1', ownerId: 'op-1' },
  { id: 'quote-2', leadId: 'lead-2', contactId: 'contact-2', conversationId: 'conv-2', status: 'rascunho', summary: 'Viagem privativa: RJ para Campos do Jordão (2 pessoas)', priceRange: [1800, 2200], createdAt: subDays(now, 4).toISOString(), updatedAt: subDays(now, 4).toISOString(), approvedByAi: true, ownerId: 'IA' },
  { id: 'quote-3', leadId: 'lead-3', contactId: 'contact-3', conversationId: 'conv-3', status: 'aprovado', summary: 'Transporte Corporativo: Van para diretoria (12 pessoas)', priceRange: [1200, 1500], finalValue: 1450, createdAt: subDays(now, 1).toISOString(), updatedAt: now.toISOString(), approvedByAi: false, approvedByHumanId: 'op-1', ownerId: 'op-1' },
  { id: 'quote-4', leadId: 'lead-4', contactId: 'contact-4', conversationId: 'conv-6', status: 'não confirmado', summary: 'Transfer Aeroporto Congonhas (aguardando voo)', priceRange: [180, 220], createdAt: subDays(now, 4).toISOString(), updatedAt: subDays(now, 4).toISOString(), approvedByAi: false, ownerId: 'op-1' },
  { id: 'quote-5', leadId: 'lead-5', contactId: 'contact-2', conversationId: 'conv-5', status: 'cancelado', summary: 'Viagem para Angra dos Reis (cancelado pelo cliente)', priceRange: [2500, 3000], createdAt: subDays(now, 6).toISOString(), updatedAt: subDays(now, 3).toISOString(), approvedByAi: false, ownerId: 'op-1' },
  { id: 'quote-6', leadId: 'lead-6', contactId: 'contact-1', conversationId: 'conv-1', status: 'perdido', summary: 'Aluguel de van para evento (cliente optou por outro)', priceRange: [900, 1100], createdAt: subDays(now, 8).toISOString(), updatedAt: subDays(now, 7).toISOString(), approvedByAi: false, ownerId: 'op-1' },
  { id: 'quote-7', leadId: 'lead-7', contactId: 'contact-1', conversationId: 'conv-1', status: 'aguardando aprovação', summary: 'Transfer GRU (Aguardando cliente aprovar)', priceRange: [280, 350], createdAt: subDays(now, 1).toISOString(), updatedAt: subDays(now, 1).toISOString(), approvedByAi: true, ownerId: 'IA' },
];

export const originalReservations: Reservation[] = [
  { id: 'res-1', leadId: 'lead-3', quoteId: 'quote-3', contactId: 'contact-3', conversationId: 'conv-3', service: 'Transfer', scheduledDate: addDays(now, 15).toISOString(), scheduledTime: '09:00', status: 'confirmada', details: 'Van executiva para evento no WTC. Aguardando no lobby principal.', reservedBy: 'human', confirmationMode: 'manual', createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 'res-2', leadId: 'lead-1', quoteId: 'quote-1', contactId: 'contact-1', conversationId: 'conv-1', status: 'aguardando aprovação', details: 'Pré-reserva para GRU (Terminal 3), gerada pela IA, aguardando confirmação final.', reservedBy: 'ai', confirmationMode: 'manual', scheduledDate: addDays(now, 25).toISOString(), scheduledTime: '15:00', service: 'Transfer', createdAt: subDays(now, 1).toISOString(), updatedAt: subDays(now, 1).toISOString() },
  { id: 'res-3', leadId: 'lead-2', quoteId: 'quote-2', contactId: 'contact-2', conversationId: 'conv-2', service: 'Tour', scheduledDate: subDays(now, 2).toISOString(), scheduledTime: '10:00', status: 'concluída', details: 'Viagem para Campos do Jordão, motorista bilíngue solicitado.', reservedBy: 'human', confirmationMode: 'manual', createdAt: subDays(now, 3).toISOString(), updatedAt: subDays(now, 2).toISOString() },
  { id: 'res-4', leadId: 'lead-5', quoteId: 'quote-5', contactId: 'contact-2', conversationId: 'conv-5', service: 'Tour', scheduledDate: addDays(now, 50).toISOString(), scheduledTime: '09:00', status: 'cancelada', details: 'Viagem para Angra dos Reis (cancelado pelo cliente).', reservedBy: 'human', confirmationMode: 'manual', createdAt: subDays(now, 6).toISOString(), updatedAt: subDays(now, 3).toISOString() },
  { id: 'res-5', leadId: 'lead-4', quoteId: 'quote-4', contactId: 'contact-4', conversationId: 'conv-6', service: 'Transfer', scheduledDate: addDays(now, 10).toISOString(), scheduledTime: '18:00', status: 'não confirmado', details: 'Transfer do Aeroporto de Congonhas, aguardando confirmação do voo do cliente.', reservedBy: 'human', confirmationMode: 'manual', createdAt: subDays(now, 4).toISOString(), updatedAt: subDays(now, 4).toISOString() },
  { id: 'res-6', leadId: 'lead-1', quoteId: 'quote-1', contactId: 'contact-1', conversationId: 'conv-1', service: 'Transfer', scheduledDate: addDays(now, 5).toISOString(), scheduledTime: '15:00', status: 'reagendada', details: 'Transfer para GRU. Cliente reagendou do dia 28 para o dia 30.', reservedBy: 'human', confirmationMode: 'manual', createdAt: subDays(now, 1).toISOString(), updatedAt: now.toISOString() },
  { id: 'res-7', leadId: 'lead-8', quoteId: 'quote-8', contactId: 'contact-1', conversationId: 'conv-1', service: 'Tour', scheduledDate: addDays(now, 3).toISOString(), scheduledTime: '11:00', status: 'pendente', details: 'Pré-reserva de Tour no centro histórico, gerada pela IA.', reservedBy: 'ai', confirmationMode: 'manual', createdAt: subDays(now, 1).toISOString(), updatedAt: subDays(now, 1).toISOString() },
];

export const originalCalendarEvents: CalendarEvent[] = [
  { id: 'ce-1', reservationId: 'res-1', title: 'Pickup Evento WTC (Empresa S.A)', eventType: 'Pickup', start: setMinutes(setHours(addDays(now, 15), 9), 0).toISOString(), end: setMinutes(setHours(addDays(now, 15), 18), 0).toISOString(), assignedTeamMemberId: 'op-2', status: 'confirmada', source: 'human', createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 'ce-2', reservationId: 'res-3', title: 'Viagem Campos do Jordão (B. Costa)', eventType: 'Tour', start: setMinutes(setHours(subDays(now, 2), 10), 0).toISOString(), end: setMinutes(setHours(addDays(subDays(now, 2), 2), 16), 0).toISOString(), assignedTeamMemberId: 'op-1', status: 'concluída', source: 'human', createdAt: subDays(now, 3).toISOString(), updatedAt: subDays(now, 2).toISOString() },
  { id: 'ce-3', reservationId: 'res-2', title: 'Transfer Ana Silva (GRU)', eventType: 'Transfer', start: setMinutes(setHours(addDays(now, 25), 15), 0).toISOString(), end: setMinutes(setHours(addDays(now, 25), 16), 30).toISOString(), assignedTeamMemberId: 'op-1', status: 'aguardando aprovação', source: 'ai', createdAt: subDays(now, 1).toISOString(), updatedAt: subDays(now, 1).toISOString() },
  { id: 'ce-4', title: 'Manutenção Van 01', eventType: 'Maintenance', start: setMinutes(setHours(addDays(now, 2), 8), 0).toISOString(), end: setMinutes(setHours(addDays(now, 2), 12), 0).toISOString(), status: 'confirmada', source: 'human', createdAt: addDays(now, 1).toISOString(), updatedAt: addDays(now, 1).toISOString() },
  { id: 'ce-5', reservationId: 'res-4', title: 'Viagem Angra (Cancelado)', eventType: 'Tour', start: setMinutes(setHours(addDays(now, 50), 9), 0).toISOString(), end: setMinutes(setHours(addDays(now, 52), 18), 0).toISOString(), status: 'cancelada', source: 'human', createdAt: subDays(now, 6).toISOString(), updatedAt: subDays(now, 3).toISOString() },
  { id: 'ce-6', reservationId: 'res-7', title: 'Tour C. Histórico (IA)', eventType: 'Tour', start: setMinutes(setHours(addDays(now, 3), 11), 0).toISOString(), end: setMinutes(setHours(addDays(now, 3), 13), 0).toISOString(), status: 'pendente', source: 'ai', createdAt: subDays(now, 1).toISOString(), updatedAt: subDays(now, 1).toISOString() }
];

export const originalDeals: Deal[] = [
  { id: 'deal-1', leadId: 'lead-1', contactId: 'contact-1', title: 'Transfer GRU - Ana Silva', pipelineStage: 'quote-sent', estimatedValue: 320, createdAt: subDays(now, 2).toISOString(), updatedAt: subDays(now, 2).toISOString(), ownerId: 'op-1', status: 'open' },
  { id: 'deal-2', leadId: 'lead-2', contactId: 'contact-2', title: 'Viagem Campos do Jordão - B. Costa', pipelineStage: 'qualified', estimatedValue: 2000, createdAt: subDays(now, 5).toISOString(), updatedAt: subDays(now, 5).toISOString(), ownerId: 'IA', status: 'open' },
  { id: 'deal-3', leadId: 'lead-3', contactId: 'contact-3', title: 'Contrato Corporativo - Empresa S.A.', pipelineStage: 'closed-won', estimatedValue: 15000, closedValue: 14500, createdAt: subDays(now, 1).toISOString(), updatedAt: now.toISOString(), ownerId: 'op-1', status: 'won' },
  { id: 'deal-4', leadId: 'lead-4', contactId: 'contact-4', title: 'Interesse em Turismo - Daniel Martins', pipelineStage: 'new-lead', estimatedValue: 800, createdAt: subDays(now, 10).toISOString(), updatedAt: subDays(now, 10).toISOString(), ownerId: 'IA', status: 'open' },
  { id: 'deal-5', leadId: 'lead-5', contactId: 'contact-2', title: 'Viagem Angra (Cancelado)', pipelineStage: 'canceled', estimatedValue: 2750, createdAt: subDays(now, 6).toISOString(), updatedAt: subDays(now, 3).toISOString(), ownerId: 'op-1', status: 'canceled' },
  { id: 'deal-6', leadId: 'lead-6', contactId: 'contact-4', title: 'Transfer Congonhas (Não confirmado)', pipelineStage: 'unconfirmed', estimatedValue: 200, createdAt: subDays(now, 4).toISOString(), updatedAt: subDays(now, 4).toISOString(), ownerId: 'op-1', status: 'open' },
  { id: 'deal-7', leadId: 'lead-7', contactId: 'contact-1', title: 'Aluguel de Van (Perdido)', pipelineStage: 'closed-lost', estimatedValue: 1000, createdAt: subDays(now, 8).toISOString(), updatedAt: subDays(now, 7).toISOString(), ownerId: 'op-1', status: 'lost' },
  { id: 'deal-8', leadId: 'lead-8', contactId: 'contact-1', title: 'Transfer para evento (Aguardando)', pipelineStage: 'aguardando fechamento', estimatedValue: 700, createdAt: subDays(now, 1).toISOString(), updatedAt: subDays(now, 1).toISOString(), ownerId: 'op-1', status: 'open' },
];

export const originalKnowledgeBaseArticles: KnowledgeBaseArticle[] = [
    { id: 'kb-1', category: 'Services', title: 'Tipos de Transfer', content: 'Oferecemos transfer executivo com sedans, SUVs e vans. Para grupos, dispomos de vans e micro-ônibus. A opção VIP inclui veículos de luxo e motoristas bilíngues.', language: 'pt-BR', active: true, createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'kb-2', category: 'Policies', title: 'Política de Cancelamento', content: 'Cancelamentos com até 48h de antecedência para transfers e 7 dias para viagens longas têm reembolso integral. Fora desse prazo, há uma taxa de 30%.', language: 'pt-BR', active: true, createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'kb-3', category: 'Destinations', title: 'Principais Destinos e Viagens', content: 'Atendemos todos os aeroportos de SP, Campos do Jordão, Litoral Norte, e viagens para todo o sudeste. Oferecemos pacotes de turismo para as principais cidades históricas de MG.', language: 'pt-BR', active: true, createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'kb-4', category: 'Company', title: 'Nossos Diferenciais', content: 'Frota moderna com Wi-Fi e água, motoristas profissionais com treinamento em direção defensiva, pontualidade e atendimento 24h via WhatsApp.', language: 'pt-BR', active: true, createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'kb-5', category: 'Bookings', title: 'Como fazer uma reserva', content: 'A reserva é confirmada após a aprovação do orçamento e o pagamento de 50% do valor. O restante pode ser pago até a data do serviço.', language: 'pt-BR', active: true, createdAt: now.toISOString(), updatedAt: now.toISOString() },
];


export const originalAiSettings: AiSettings = {
    id: 1,
    globalAiEnabled: true,
    aiMode: 'assisted',
    requireHumanApproval: true,
    isFallbackEnabled: true,
    fallbackHumanName: 'Cláudia Vaz',
    activeProvider: 'automatic',
    fallbackProvider: 'openai',
    commercialActivationKey: 'unauthorized',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
};

export const originalAiFlowPermissions: AiFlowPermission[] = [
    { id: 'flow-1', aiSettingsId: 1, flowName: 'welcome', enabled: true, requiresHumanApproval: false, provider: 'automatic', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'flow-2', aiSettingsId: 1, flowName: 'qualification', enabled: true, requiresHumanApproval: false, provider: 'automatic', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'flow-3', aiSettingsId: 1, flowName: 'faq', enabled: true, requiresHumanApproval: false, provider: 'automatic', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'flow-4', aiSettingsId: 1, flowName: 'quoteCreation', enabled: true, requiresHumanApproval: true, provider: 'automatic', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'flow-5', aiSettingsId: 1, flowName: 'bookingCreation', enabled: false, requiresHumanApproval: true, provider: 'automatic', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'flow-6', aiSettingsId: 1, flowName: 'crmUpdate', enabled: false, requiresHumanApproval: true, provider: 'automatic', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'flow-7', aiSettingsId: 1, flowName: 'saleClosing', enabled: false, requiresHumanApproval: true, provider: 'automatic', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'flow-8', aiSettingsId: 1, flowName: 'postSale', enabled: false, requiresHumanApproval: true, provider: 'automatic', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'flow-9', aiSettingsId: 1, flowName: 'summarization', enabled: true, requiresHumanApproval: false, provider: 'automatic', createdAt: now.toISOString(), updatedAt: now.toISOString() },
];

export const originalAiProviderConfigs: AiProviderConfig[] = [
    { id: 'prov-1', providerName: 'gemini', keyLabel: 'GEMINI_API_KEY', modelName: 'gemini-2.5-flash', enabled: true, isPrimary: true, createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: 'prov-2', providerName: 'openai', keyLabel: 'OPENAI_API_KEY', modelName: 'gpt-4-turbo', enabled: true, isPrimary: false, createdAt: now.toISOString(), updatedAt: now.toISOString() },
];

export const originalAiPrompts: AiPrompt[] = [
    { 
        id: 'prompt-draft-1', 
        versionName: 'v4 - Draft for testing', 
        promptType: 'master_prompt',
        status: 'draft',
        providerCompatibility: ['gemini', 'openai'],
        createdAt: now.toISOString(), 
        updatedAt: now.toISOString(),
        content: `You are a premium virtual assistant for "Renascer Transfer Tour", specializing in executive transport, transfers, and tours. Your tone is professional, welcoming, and efficient. You are a pre-service assistant. Your main goal is lead qualification and conversation organization.

Your primary goals are:
1.  **Welcome the user warmly**: Start with a professional and friendly greeting, introducing yourself as the virtual assistant for Renascer Transfer Tour.
2.  **Understand the user's need**: Quickly identify if they need a 'Transfer', 'Turismo', 'Transporte Executivo', 'Serviço para Eventos', or 'Viagem Longa'.
3.  **Extract Information**: Fill in the 'gatheredInformation' object with all relevant details you can find from the entire conversation. If a piece of information is not available or unclear, set the corresponding field to 'null'.
4.  **DO NOT PROVIDE PRICES OR QUOTES**: You are not authorized to give final prices or create quotes. Your role is to collect data.
5.  **Formulate a Handoff Response**: When the user requests a price or has provided enough information for a quote, your 'aiResponse' must state that you have gathered the necessary information and that a human specialist will take over.
    - Example response: "Obrigada pelas informações! Coletei tudo que preciso. A Cláudia, nossa especialista, irá preparar seu orçamento e entrará em contato em breve."
6.  **Decide on Escalation**: Set 'escalateToHuman' to 'true' in the following situations:
    - The user has provided enough information to generate a quote (e.g., origin, destination, date, number of passengers).
    - The customer explicitly requests to speak to a human (e.g., "quero falar com uma pessoa", "falar com atendente", "falar com Cláudia").
    - The inquiry is about a complaint, a very complex event, or a sensitive matter.
    - The customer expresses clear frustration or confusion.
    - You have already asked for key information twice and the customer has not provided it.
Otherwise, set 'escalateToHuman' to 'false' and continue the automated qualification service.`
    },
    { 
        id: 'prompt-published-1', 
        versionName: 'v3 - Handoff Rules', 
        promptType: 'master_prompt',
        status: 'published',
        providerCompatibility: ['gemini', 'openai'],
        createdAt: subDays(now, 5).toISOString(), 
        updatedAt: subDays(now, 5).toISOString(),
        content: `You are a premium virtual assistant for "Renascer Transfer Tour", specializing in executive transport, transfers, and tours. Your tone is professional, welcoming, and efficient. You are a pre-service assistant. Your main goal is lead qualification and conversation organization.

Your primary goals are:
1.  **Welcome the user warmly**: Start with a professional and friendly greeting, introducing yourself as the virtual assistant for Renascer Transfer Tour.
2.  **Understand the user's need**: Quickly identify if they need a 'Transfer', 'Turismo', 'Transporte Executivo', 'Serviço para Eventos', or 'Viagem Longa'.
3.  **Extract Information**: Fill in the 'gatheredInformation' object with all relevant details you can find from the entire conversation. If a piece of information is not available or unclear, set the corresponding field to 'null'.
4.  **DO NOT PROVIDE PRICES OR QUOTES**: You are not authorized to give final prices or create quotes. Your role is to collect data.
5.  **Formulate a Handoff Response**: When the user requests a price or has provided enough information for a quote, your 'aiResponse' must state that you have gathered the necessary information and that a human specialist will take over.
    - Example response: "Obrigada pelas informações! Coletei tudo que preciso. A Cláudia, nossa especialista, irá preparar seu orçamento e entrará em contato em breve."
6.  **Decide on Escalation**: Set 'escalateToHuman' to 'true' in the following situations:
    - The user has provided enough information to generate a quote (e.g., origin, destination, date, number of passengers).
    - The customer explicitly requests to speak to a human (e.g., "quero falar com uma pessoa", "falar com atendente", "falar com Cláudia").
    - The inquiry is about a complaint, a very complex event, or a sensitive matter.
    - The customer expresses clear frustration or confusion.
    - You have already asked for key information twice and the customer has not provided it.
Otherwise, set 'escalateToHuman' to 'false' and continue the automated qualification service.`
    }
];

export let originalAuditLogs: AuditLog[] = [
    {
        id: 'log-ana-1',
        timestamp: subDays(now, 2).toISOString(),
        actor: 'Ana Silva',
        actorType: 'customer',
        channel: 'whatsapp',
        entityType: 'conversation',
        entityId: 'conv-1',
        eventType: 'mensagem_recebida',
        source: 'whatsapp',
        contactId: 'contact-1',
    },
    {
        id: 'log-ana-2',
        timestamp: subMinutes(subDays(now, 2), -5).toISOString(),
        actor: 'Assistente IA',
        actorType: 'ai',
        channel: 'whatsapp',
        entityType: 'conversation',
        entityId: 'conv-1',
        eventType: 'sugestão_ia_gerada',
        notes: 'IA qualificou o lead e preparou o handoff.',
        source: 'ai_flow',
        contactId: 'contact-1',
    },
     {
        id: 'log-ana-3',
        timestamp: subMinutes(subDays(now, 1), -30).toISOString(),
        actor: 'Assistente IA',
        actorType: 'ai',
        entityType: 'quote',
        entityId: 'quote-1',
        eventType: 'orçamento_rascunho_criado',
        notes: 'Rascunho de orçamento para Transfer GRU gerado pela IA.',
        source: 'ai_flow',
        after: { status: 'rascunho', summary: 'Transfer Executivo: Av. Paulista para Aeroporto GRU', priceRange: [280, 350] },
        contactId: 'contact-1',
    },
    {
        id: 'log-ana-4',
        timestamp: subDays(now, 1).toISOString(),
        actor: 'Cláudia Vaz',
        actorType: 'human',
        channel: 'whatsapp',
        entityType: 'quote',
        entityId: 'quote-1',
        eventType: 'finalizado_manual',
        notes: 'Orçamento revisado e enviado ao cliente.',
        source: 'app',
        approvedBy: 'op-1',
        before: { status: 'rascunho' },
        after: { status: 'enviado' },
        contactId: 'contact-1',
    }
];


// --- Mutable State (the "database") ---
// Deep clone the original data to create a mutable state
const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export let operators: Operator[] = deepClone(originalOperators);
export let contacts: Contact[] = deepClone(originalContacts);
export let channels: Channel[] = deepClone(originalChannels);
export let leads: Lead[] = deepClone(originalLeads);
export let messages: Message[] = deepClone(originalMessages);
export let conversations: Conversation[] = deepClone(originalConversations);
export let quotes: Quote[] = deepClone(originalQuotes);
export let reservations: Reservation[] = deepClone(originalReservations);
export let calendarEvents: CalendarEvent[] = deepClone(originalCalendarEvents);
export let deals: Deal[] = deepClone(originalDeals);
export let knowledgeBaseArticles: KnowledgeBaseArticle[] = deepClone(originalKnowledgeBaseArticles);
export let aiSettings: AiSettings = deepClone(originalAiSettings);
export let aiFlowPermissions: AiFlowPermission[] = deepClone(originalAiFlowPermissions);
export let aiProviderConfigs: AiProviderConfig[] = deepClone(originalAiProviderConfigs);
export let aiPrompts: AiPrompt[] = deepClone(originalAiPrompts);
export let auditLogs: AuditLog[] = deepClone(originalAuditLogs);

// --- System-wide Operations ---
const deepCloneReset = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const system = {
    resetOperationalData: () => {
        db.conversations = deepCloneReset(db.originalConversations);
        db.messages = deepCloneReset(db.originalMessages);
        db.leads = deepCloneReset(db.originalLeads);
        db.quotes = deepCloneReset(db.originalQuotes);
        db.reservations = deepCloneReset(db.originalReservations);
        db.deals = deepCloneReset(db.originalDeals);
        db.calendarEvents = deepCloneReset(db.originalCalendarEvents);
        db.auditLogs = [];
        return { success: true, message: "Operational data has been reset." };
    },
    resetAllData: () => {
        // Resets operational data
        system.resetOperationalData();
        
        // Also resets settings data
        db.aiSettings = deepCloneReset(db.originalAiSettings);
        db.aiFlowPermissions = deepCloneReset(db.originalAiFlowPermissions);
        db.aiPrompts = deepCloneReset(db.originalAiPrompts);
        db.channels = deepCloneReset(db.originalChannels);

        return { success: true, message: "All local mock data has been reset to defaults." };
    }
}

const db = {
    operators,
    contacts,
    channels,
    leads,
    messages,
    conversations,
    quotes,
    reservations,
    calendarEvents,
    deals,
    knowledgeBaseArticles,
    aiSettings,
    aiFlowPermissions,
    aiProviderConfigs,
    aiPrompts,
    auditLogs,
    originalOperators,
    originalContacts,
    originalChannels,
    originalLeads,
    originalMessages,
    originalConversations,
    originalQuotes,
    originalReservations,
    originalCalendarEvents,
    originalDeals,
    originalKnowledgeBaseArticles,
    originalAiSettings,
    originalAiFlowPermissions,
    originalAiProviderConfigs,
    originalAiPrompts,
    originalAuditLogs,
    system
};

    











