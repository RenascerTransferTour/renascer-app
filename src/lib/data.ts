import {
  Customer,
  Conversation,
  Message,
  Quote,
  Booking,
  CalendarEvent,
  PipelineDeal,
  KnowledgeBaseArticle,
} from './types';
import { subDays, addDays, setHours, setMinutes } from 'date-fns';

const now = new Date();

export const customers: Customer[] = [
  {
    id: 'customer-1',
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    phone: '+55 11 98765-4321',
    avatar: 'https://picsum.photos/seed/1/100/100',
    originChannel: 'WhatsApp',
    urgency: 'medium',
    interestLevel: 'high',
    serviceType: 'Transfer',
    destination: 'Aeroporto GRU',
    createdAt: subDays(now, 2).toISOString(),
  },
  {
    id: 'customer-2',
    name: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    phone: '+55 21 91234-5678',
    avatar: 'https://picsum.photos/seed/2/100/100',
    originChannel: 'Instagram',
    urgency: 'low',
    interestLevel: 'medium',
    serviceType: 'Passeio',
    destination: 'City Tour São Paulo',
    createdAt: subDays(now, 5).toISOString(),
  },
  {
    id: 'customer-3',
    name: 'Carla Dias',
    email: 'carla.dias@example.com',
    phone: '+55 31 99999-8888',
    avatar: 'https://picsum.photos/seed/3/100/100',
    originChannel: 'Facebook',
    urgency: 'high',
    interestLevel: 'high',
    serviceType: 'Reserva',
    createdAt: subDays(now, 1).toISOString(),
  },
  {
    id: 'customer-4',
    name: 'Daniel Martins',
    email: 'daniel.martins@example.com',
    phone: '+55 81 98888-7777',
    avatar: 'https://picsum.photos/seed/4/100/100',
    originChannel: 'Website',
    urgency: 'low',
    interestLevel: 'low',
    createdAt: subDays(now, 10).toISOString(),
  },
];

const messages: { [key: string]: Message[] } = {
  'conv-1': [
    { id: 'msg-1-1', role: 'user', content: 'Olá, gostaria de um orçamento para um transfer para o aeroporto de Guarulhos.', timestamp: subDays(now, 2).toISOString() },
    { id: 'msg-1-2', role: 'ai', content: 'Olá! Claro. Para qual data e horário você precisa do transfer? E qual o local de partida?', timestamp: subDays(now, 2).toISOString() },
    { id: 'msg-1-3', role: 'user', content: 'Seria para o dia 28, às 15h. Partindo da Av. Paulista.', timestamp: subDays(now, 2).toISOString() },
    { id: 'msg-1-4', role: 'agent', authorName: 'Carlos', content: 'Olá Ana, Carlos aqui. Já estou preparando seu orçamento. Só um momento.', timestamp: subDays(now, 1).toISOString() }
  ],
  'conv-2': [
    { id: 'msg-2-1', role: 'user', content: 'Oi, vcs fazem city tour? Queria saber o preço.', timestamp: subDays(now, 5).toISOString() },
    { id: 'msg-2-2', role: 'ai', content: 'Oi, Bruno! Fazemos sim. Nosso City Tour por São Paulo é incrível. Para quantas pessoas seria?', timestamp: subDays(now, 5).toISOString() },
  ],
  'conv-3': [
    { id: 'msg-3-1', role: 'user', content: 'PRECISO URGENTE de uma reserva para um evento corporativo. Me liguem!', timestamp: subDays(now, 1).toISOString() },
    { id: 'msg-3-2', role: 'ai', content: 'Entendido, Carla. Sua solicitação foi marcada como urgente. Um de nossos agentes entrará em contato em breve. Para agilizar, poderia nos informar seu telefone?', timestamp: subDays(now, 1).toISOString() },
    { id: 'msg-3-3', role: 'user', content: 'É (31) 99999-8888', timestamp: subDays(now, 1).toISOString() },
  ],
  'conv-4': [
    { id: 'msg-4-1', role: 'user', content: 'Qual o email de vocês?', timestamp: subDays(now, 10).toISOString() },
    { id: 'msg-4-2', role: 'ai', content: 'Olá! Nosso e-mail para contato é contato@renascer.com.br. Como posso ajudar?', timestamp: subDays(now, 10).toISOString() },
  ]
};

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    customerId: 'customer-1',
    channel: 'WhatsApp',
    status: 'open',
    priority: 'medium',
    isAiActive: false,
    lastMessage: 'Olá Ana, Carlos aqui. Já estou preparando seu orçamento. Só um momento.',
    lastMessageAt: subDays(now, 1).toISOString(),
    messages: messages['conv-1'],
  },
  {
    id: 'conv-2',
    customerId: 'customer-2',
    channel: 'Instagram',
    status: 'pending',
    priority: 'low',
    isAiActive: true,
    lastMessage: 'Oi, Bruno! Fazemos sim. Nosso City Tour por São Paulo é incrível. Para quantas pessoas seria?',
    lastMessageAt: subDays(now, 5).toISOString(),
    messages: messages['conv-2'],
  },
  {
    id: 'conv-3',
    customerId: 'customer-3',
    channel: 'Facebook',
    status: 'open',
    priority: 'high',
    isAiActive: false,
    lastMessage: 'É (31) 99999-8888',
    lastMessageAt: subDays(now, 1).toISOString(),
    messages: messages['conv-3'],
  },
  {
    id: 'conv-4',
    customerId: 'customer-4',
    channel: 'Website',
    status: 'closed',
    priority: 'low',
    isAiActive: true,
    lastMessage: 'Olá! Nosso e-mail para contato é contato@renascer.com.br. Como posso ajudar?',
    lastMessageAt: subDays(now, 10).toISOString(),
    messages: messages['conv-4'],
  },
];

export const quotes: Quote[] = [
  {
    id: 'quote-1',
    customerId: 'customer-1',
    conversationId: 'conv-1',
    status: 'sent',
    summary: 'Transfer da Av. Paulista para o Aeroporto GRU',
    priceRange: [180, 220],
    createdAt: subDays(now, 1).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
  },
  {
    id: 'quote-2',
    customerId: 'customer-2',
    conversationId: 'conv-2',
    status: 'draft',
    summary: 'City Tour em São Paulo para 2 pessoas',
    priceRange: [450, 600],
    createdAt: subDays(now, 4).toISOString(),
    updatedAt: subDays(now, 4).toISOString(),
  },
  {
    id: 'quote-3',
    customerId: 'customer-3',
    conversationId: 'conv-3',
    status: 'approved',
    summary: 'Serviço de van para evento corporativo - 12 pessoas',
    priceRange: [1200, 1500],
    createdAt: subDays(now, 1).toISOString(),
    updatedAt: now.toISOString(),
  }
];

export const bookings: Booking[] = [
  {
    id: 'booking-1',
    customerId: 'customer-3',
    quoteId: 'quote-3',
    service: 'Transfer',
    date: addDays(now, 15).toISOString(),
    status: 'confirmed',
    details: 'Van executiva para evento no WTC.',
    createdAt: now.toISOString(),
  },
  {
    id: 'booking-2',
    customerId: 'customer-1',
    quoteId: 'quote-1',
    service: 'Transfer',
    date: addDays(now, 25).toISOString(),
    status: 'pending',
    details: 'Transfer para GRU, aguardando pagamento.',
    createdAt: subDays(now, 1).toISOString(),
  },
];

export const calendarEvents: CalendarEvent[] = [
  { id: 'ce-1', title: 'Pickup Evento WTC', type: 'Pickup', start: setMinutes(setHours(addDays(now, 15), 9), 0), end: setMinutes(setHours(addDays(now, 15), 18), 0), team: 'Equipe A', status: 'Confirmed' },
  { id: 'ce-2', title: 'Tour com Família Costa', type: 'Tour', start: setMinutes(setHours(addDays(now, 5), 10), 0), end: setMinutes(setHours(addDays(now, 5), 16), 0), team: 'Equipe B', status: 'Planning' },
  { id: 'ce-3', title: 'Transfer Ana Silva (GRU)', type: 'Transfer', start: setMinutes(setHours(addDays(now, 25), 15), 0), end: setMinutes(setHours(addDays(now, 25), 16), 30), team: 'Equipe A', status: 'Pending' },
];

export const pipelineDeals: PipelineDeal[] = [
  { id: 'deal-1', customerId: 'customer-1', title: 'Transfer GRU - Ana Silva', stage: 'quote-sent', value: 200, createdAt: subDays(now, 2).toISOString() },
  { id: 'deal-2', customerId: 'customer-2', title: 'City Tour - Bruno Costa', stage: 'qualified', value: 500, createdAt: subDays(now, 5).toISOString() },
  { id: 'deal-3', customerId: 'customer-3', title: 'Evento Corporativo - Carla Dias', stage: 'closed-won', value: 1350, createdAt: subDays(now, 1).toISOString() },
  { id: 'deal-4', customerId: 'customer-4', title: 'Contato inicial - Daniel Martins', stage: 'new-lead', value: 0, createdAt: subDays(now, 10).toISOString() },
];

export const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
    { id: 'kb-1', category: 'Services', title: 'Tipos de Transfer', content: 'Oferecemos transfer executivo, para grupos e VIP.' },
    { id: 'kb-2', category: 'Policies', title: 'Política de Cancelamento', content: 'Cancelamentos com até 48h de antecedência têm reembolso integral.' },
    { id: 'kb-3', category: 'Destinations', title: 'Principais Destinos', content: 'Atendemos todos os aeroportos de SP, Campos do Jordão, Litoral Norte, etc.' },
    { id: 'kb-4', category: 'Company', title: 'Nossos Diferenciais', content: 'Frota moderna, motoristas bilíngues e pontualidade britânica.' },
    { id: 'kb-5', category: 'Bookings', title: 'Como fazer uma reserva', content: 'A reserva é confirmada após o envio do orçamento e o pagamento de 50% do valor.' },
];
