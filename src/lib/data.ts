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
    serviceType: 'Transfer Aeroporto',
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
    serviceType: 'Viagem Longa',
    destination: 'Campos do Jordão',
    createdAt: subDays(now, 5).toISOString(),
  },
  {
    id: 'customer-3',
    name: 'Carla Dias (Empresa S.A.)',
    email: 'carla.dias@empresa.com',
    phone: '+55 31 99999-8888',
    avatar: 'https://picsum.photos/seed/3/100/100',
    originChannel: 'Facebook',
    urgency: 'high',
    interestLevel: 'high',
    serviceType: 'Transporte Corporativo',
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
    serviceType: 'Turismo',
    createdAt: subDays(now, 10).toISOString(),
  },
];

const messages: { [key: string]: Message[] } = {
  'conv-1': [
    { id: 'msg-1-1', role: 'user', content: 'Olá, gostaria de um orçamento para um transfer para o aeroporto de Guarulhos.', timestamp: subDays(now, 2).toISOString() },
    { id: 'msg-1-2', role: 'ai', content: 'Olá, Ana! Seja bem-vinda à Renascer. Para qual data e horário você precisa do transfer? E qual o local de partida?', timestamp: subDays(now, 2).toISOString() },
    { id: 'msg-1-3', role: 'user', content: 'Seria para o dia 28, às 15h. Partindo da Av. Paulista.', timestamp: subDays(now, 2).toISOString() },
    { id: 'msg-1-4', role: 'agent', authorName: 'Carlos', content: 'Olá Ana, Carlos aqui. Já estou preparando seu orçamento para o transfer executivo. Só um momento.', timestamp: subDays(now, 1).toISOString() }
  ],
  'conv-2': [
    { id: 'msg-2-1', role: 'user', content: 'Oi, vcs fazem viagens para Campos do Jordão? Saindo do Rio.', timestamp: subDays(now, 5).toISOString() },
    { id: 'msg-2-2', role: 'ai', content: 'Oi, Bruno! Fazemos sim. Uma excelente escolha de destino! Para quantas pessoas e qual data você estaria planejando?', timestamp: subDays(now, 5).toISOString() },
  ],
  'conv-3': [
    { id: 'msg-3-1', role: 'user', content: 'PRECISO URGENTE de um contato para transporte de diretoria para um evento. Me liguem!', timestamp: subDays(now, 1).toISOString() },
    { id: 'msg-3-2', role: 'ai', content: 'Entendido, Carla. Sua solicitação foi marcada como urgente. Um de nossos especialistas em atendimento corporativo entrará em contato em breve. Poderia nos informar o nome da empresa, por favor?', timestamp: subDays(now, 1).toISOString() },
    { id: 'msg-3-3', role: 'user', content: 'Empresa S.A. O telefone é (31) 99999-8888', timestamp: subDays(now, 1).toISOString() },
  ],
  'conv-4': [
    { id: 'msg-4-1', role: 'user', content: 'Qual o email de vocês?', timestamp: subDays(now, 10).toISOString() },
    { id: 'msg-4-2', role: 'ai', content: 'Olá! Nosso e-mail para contato é contato@renascertour.com.br. Em que podemos ajudar?', timestamp: subDays(now, 10).toISOString() },
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
    lastMessage: 'Olá Ana, Carlos aqui. Já estou preparando seu orçamento para o transfer executivo. Só um momento.',
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
    lastMessage: 'Oi, Bruno! Fazemos sim. Uma excelente escolha de destino! Para quantas pessoas e qual data você estaria planejando?',
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
    lastMessage: 'Empresa S.A. O telefone é (31) 99999-8888',
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
    lastMessage: 'Olá! Nosso e-mail para contato é contato@renascertour.com.br. Em que podemos ajudar?',
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
    summary: 'Transfer Executivo: Av. Paulista para Aeroporto GRU',
    priceRange: [280, 350],
    createdAt: subDays(now, 1).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
  },
  {
    id: 'quote-2',
    customerId: 'customer-2',
    conversationId: 'conv-2',
    status: 'draft',
    summary: 'Viagem privativa: RJ para Campos do Jordão (2 pessoas)',
    priceRange: [1800, 2200],
    createdAt: subDays(now, 4).toISOString(),
    updatedAt: subDays(now, 4).toISOString(),
  },
  {
    id: 'quote-3',
    customerId: 'customer-3',
    conversationId: 'conv-3',
    status: 'approved',
    summary: 'Transporte Corporativo: Van para diretoria (12 pessoas)',
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
    details: 'Van executiva para evento no WTC. Aguardando no lobby principal.',
    createdAt: now.toISOString(),
  },
  {
    id: 'booking-2',
    customerId: 'customer-1',
    quoteId: 'quote-1',
    service: 'Transfer',
    date: addDays(now, 25).toISOString(),
    status: 'pending',
    details: 'Transfer para GRU (Terminal 3), aguardando pagamento.',
    createdAt: subDays(now, 1).toISOString(),
  },
  {
    id: 'booking-3',
    customerId: 'customer-2',
    quoteId: 'quote-2',
    service: 'Tour',
    date: addDays(now, 40).toISOString(),
    status: 'confirmed',
    details: 'Viagem para Campos do Jordão, motorista bilíngue solicitado.',
    createdAt: subDays(now, 3).toISOString(),
  }
];

export const calendarEvents: CalendarEvent[] = [
  { id: 'ce-1', title: 'Pickup Evento WTC (Empresa S.A)', type: 'Pickup', start: setMinutes(setHours(addDays(now, 15), 9), 0), end: setMinutes(setHours(addDays(now, 15), 18), 0), team: 'Equipe A', status: 'Confirmed' },
  { id: 'ce-2', title: 'Viagem Campos do Jordão (B. Costa)', type: 'Tour', start: setMinutes(setHours(addDays(now, 40), 10), 0), end: setMinutes(setHours(addDays(now, 42), 16), 0), team: 'Equipe B', status: 'Confirmed' },
  { id: 'ce-3', title: 'Transfer Ana Silva (GRU)', type: 'Transfer', start: setMinutes(setHours(addDays(now, 25), 15), 0), end: setMinutes(setHours(addDays(now, 25), 16), 30), team: 'Equipe A', status: 'Pending' },
  { id: 'ce-4', title: 'Manutenção Van 01', type: 'Booking', start: setMinutes(setHours(addDays(now, 2), 8), 0), end: setMinutes(setHours(addDays(now, 2), 12), 0), status: 'Confirmed' }

];

export const pipelineDeals: PipelineDeal[] = [
  { id: 'deal-1', customerId: 'customer-1', title: 'Transfer GRU - Ana Silva', stage: 'quote-sent', value: 320, createdAt: subDays(now, 2).toISOString() },
  { id: 'deal-2', customerId: 'customer-2', title: 'Viagem Campos do Jordão - B. Costa', stage: 'negotiation', value: 2000, createdAt: subDays(now, 5).toISOString() },
  { id: 'deal-3', customerId: 'customer-3', title: 'Contrato Corporativo - Empresa S.A.', stage: 'closed-won', value: 15000, createdAt: subDays(now, 1).toISOString() },
  { id: 'deal-4', customerId: 'customer-4', title: 'Interesse em Turismo - Daniel Martins', stage: 'new-lead', value: 800, createdAt: subDays(now, 10).toISOString() },
];

export const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
    { id: 'kb-1', category: 'Services', title: 'Tipos de Transfer', content: 'Oferecemos transfer executivo com sedans, SUVs e vans. Para grupos, dispomos de vans e micro-ônibus. A opção VIP inclui veículos de luxo e motoristas bilíngues.' },
    { id: 'kb-2', category: 'Policies', title: 'Política de Cancelamento', content: 'Cancelamentos com até 48h de antecedência para transfers e 7 dias para viagens longas têm reembolso integral. Fora desse prazo, há uma taxa de 30%.' },
    { id: 'kb-3', category: 'Destinations', title: 'Principais Destinos e Viagens', content: 'Atendemos todos os aeroportos de SP, Campos do Jordão, Litoral Norte, e viagens para todo o sudeste. Oferecemos pacotes de turismo para as principais cidades históricas de MG.' },
    { id: 'kb-4', category: 'Company', title: 'Nossos Diferenciais', content: 'Frota moderna com Wi-Fi e água, motoristas profissionais com treinamento em direção defensiva, pontualidade e atendimento 24h via WhatsApp.' },
    { id: 'kb-5', category: 'Bookings', title: 'Como fazer uma reserva', content: 'A reserva é confirmada após a aprovação do orçamento e o pagamento de 50% do valor. O restante pode ser pago até a data do serviço.' },
];
