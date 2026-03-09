import { subDays, addDays, subHours, addHours } from 'date-fns';
import { User, Message, Conversation, Lead, Quote, Booking, CalendarEvent, KnowledgeBaseArticle, Company, Plan, TeamMember } from './types';

const now = new Date();

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Ana Silva', email: 'ana@example.com', avatar: 'https://picsum.photos/seed/1/100/100', role: 'Gerente' },
  { id: 'user-2', name: 'Carlos Santos', email: 'carlos@example.com', avatar: 'https://picsum.photos/seed/2/100/100', role: 'Atendente' },
  { id: 'user-3', name: 'Beatriz Costa', email: 'beatriz@example.com', avatar: 'https://picsum.photos/seed/3/100/100', role: 'Motorista' },
  { id: 'user-4', name: 'Daniel Almeida', email: 'daniel@example.com', avatar: 'https://picsum.photos/seed/4/100/100', role: 'Atendente' },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    customerName: 'Mariana Lima',
    customerAvatar: 'https://picsum.photos/seed/101/100/100',
    lastMessage: 'Ok, combinado. Fico no aguardo da confirmação final.',
    lastMessageTimestamp: subHours(now, 1).toISOString(),
    channel: 'whatsapp',
    status: 'open',
    agent: mockUsers[1],
  },
  {
    id: 'conv-2',
    customerName: 'Jorge Martins',
    customerAvatar: 'https://picsum.photos/seed/102/100/100',
    lastMessage: 'Pode me enviar o orçamento para o passeio em Angra?',
    lastMessageTimestamp: subHours(now, 3).toISOString(),
    channel: 'instagram',
    status: 'pending',
    agent: mockUsers[0],
  },
  {
    id: 'conv-3',
    customerName: 'Fechamento Automático',
    customerAvatar: 'https://picsum.photos/seed/103/100/100',
    lastMessage: 'Sua reserva foi confirmada com sucesso. Obrigado!',
    lastMessageTimestamp: subDays(now, 1).toISOString(),
    channel: 'website',
    status: 'closed',
    agent: { id: 'ai-1', name: 'Magnus AI', avatar: '/logo.svg', role: 'IA' },
  },
  {
    id: 'conv-4',
    customerName: 'Lucas Pereira',
    customerAvatar: 'https://picsum.photos/seed/104/100/100',
    lastMessage: 'Gostaria de saber mais sobre os city tours no Rio.',
    lastMessageTimestamp: subDays(now, 2).toISOString(),
    channel: 'facebook',
    status: 'open',
    agent: mockUsers[3],
  },
];

export const mockMessages: Message[] = [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      sender: { id: 'customer-1', name: 'Mariana Lima', avatar: 'https://picsum.photos/seed/101/100/100', role: 'Cliente' },
      content: 'Olá! Gostaria de um transfer do aeroporto de Guarulhos para a Av. Paulista no dia 15 do próximo mês, às 14h.',
      timestamp: subHours(now, 2).toISOString(),
      type: 'text',
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      sender: mockUsers[1],
      content: 'Olá, Mariana! Claro. Para quantas pessoas seria o transfer?',
      timestamp: subHours(now, 1).toISOString(),
      type: 'text',
    },
    {
        id: 'msg-3',
        conversationId: 'conv-1',
        sender: { id: 'ai-1', name: 'Magnus AI', avatar: '/logo.svg', role: 'IA' },
        content: 'Sugestão: O cliente parece ter alta intenção. Recomendo oferecer um veículo executivo e já criar um rascunho de orçamento.',
        timestamp: subHours(now, 1).toISOString(),
        type: 'suggestion',
      },
    {
      id: 'msg-4',
      conversationId: 'conv-1',
      sender: { id: 'customer-1', name: 'Mariana Lima', avatar: 'https://picsum.photos/seed/101/100/100', role: 'Cliente' },
      content: 'Ok, combinado. Fico no aguardo da confirmação final.',
      timestamp: subHours(now, 1).toISOString(),
      type: 'text',
    },
  ];
  
  export const mockLeads: Lead[] = [
    { id: 'lead-1', name: 'Mariana Lima', stage: 'contacted', value: 350, agent: mockUsers[1], source: 'whatsapp', priority: 'high', lastUpdate: subHours(now, 1).toISOString(), avatar: 'https://picsum.photos/seed/101/100/100' },
    { id: 'lead-2', name: 'Jorge Martins', stage: 'qualified', value: 1200, agent: mockUsers[0], source: 'instagram', priority: 'medium', lastUpdate: subHours(now, 3).toISOString(), avatar: 'https://picsum.photos/seed/102/100/100' },
    { id: 'lead-3', name: 'Novo Lead Site', stage: 'new', value: 0, agent: { id: 'unassigned', name: 'Não atribuído', role: 'System' }, source: 'website', priority: 'low', lastUpdate: subHours(now, 5).toISOString() },
    { id: 'lead-4', name: 'Contrato Empresa ABC', stage: 'won', value: 15000, agent: mockUsers[0], source: 'email', priority: 'high', lastUpdate: subDays(now, 5).toISOString(), avatar: 'https://picsum.photos/seed/201/100/100' },
    { id: 'lead-5', name: 'Interesse City Tour', stage: 'lost', value: 800, agent: mockUsers[3], source: 'facebook', priority: 'low', lastUpdate: subDays(now, 2).toISOString(), avatar: 'https://picsum.photos/seed/104/100/100' },
  ];

  export const mockBookings: Booking[] = [
    { id: 'book-1', customerName: 'Empresa ABC', service: 'Evento Corporativo', date: addDays(now, 10).toISOString(), driver: 'Beatriz Costa', vehicle: 'Van Executiva', status: 'confirmed', value: 15000 },
    { id: 'book-2', customerName: 'Mariana Lima', service: 'Transfer Aeroporto', date: addDays(now, 15).toISOString(), driver: 'Não atribuído', vehicle: 'Sedan Executivo', status: 'pending', value: 350 },
    { id: 'book-3', customerName: 'Pedro Rocha', service: 'Passeio Pão de Açúcar', date: subDays(now, 1).toISOString(), driver: 'Beatriz Costa', vehicle: 'SUV', status: 'completed', value: 600 },
    { id: 'book-4', customerName: 'Juliana Paes', service: 'Viagem a Búzios', date: addDays(now, 2).toISOString(), driver: 'Carlos Santos', vehicle: 'Van Executiva', status: 'cancelled', value: 2500 },
  ];

  export const mockQuotes: Quote[] = [
    { id: 'quote-1', customerName: 'Jorge Martins', title: 'Passeio a Angra dos Reis', date: subHours(now, 3).toISOString(), status: 'draft', total: 1200 },
    { id: 'quote-2', customerName: 'Mariana Lima', title: 'Transfer GRU > Av. Paulista', date: subHours(now, 1).toISOString(), status: 'sent', total: 350 },
    { id: 'quote-3', customerName: 'Empresa ABC', title: 'Contrato Transporte Mensal', date: subDays(now, 7).toISOString(), status: 'accepted', total: 15000 },
    { id: 'quote-4', customerName: 'Ricardo Alves', title: 'City Tour (Cristo + Pão de Açúcar)', date: subDays(now, 2).toISOString(), status: 'expired', total: 850 },
  ];

  export const mockCalendarEvents: CalendarEvent[] = [
    { id: 'cal-1', title: 'Transfer: Mariana Lima (GRU)', start: addDays(now, 15).toISOString(), end: addHours(addDays(now, 15), 2).toISOString(), color: 'blue', type: 'booking', bookingId: 'book-2' },
    { id: 'cal-2', title: 'Evento: Empresa ABC', start: addDays(now, 10).toISOString(), end: addHours(addDays(now, 10), 8).toISOString(), color: 'green', type: 'booking', bookingId: 'book-1' },
    { id: 'cal-3', title: 'Manutenção: Van Executiva', start: addDays(now, 1).toISOString(), end: addHours(addDays(now, 1), 4).toISOString(), color: 'orange', type: 'task' },
    { id: 'cal-4', title: 'Follow-up: Jorge Martins', start: now.toISOString(), end: addHours(now, 1).toISOString(), color: 'purple', type: 'reminder' },
  ];
  
  export const mockKnowledgeBaseArticles: KnowledgeBaseArticle[] = [
    { id: 'kb-1', title: 'Política de Cancelamento de Transfers', category: 'Políticas', lastUpdated: subDays(now, 10).toISOString(), author: 'Ana Silva', summary: 'Regras para cancelamento de serviços de transfer com menos de 24h de antecedência.' },
    { id: 'kb-2', title: 'Roteiro Padrão: City Tour Rio de Janeiro', category: 'Roteiros', lastUpdated: subDays(now, 5).toISOString(), author: 'Carlos Santos', summary: 'Inclui visita ao Cristo Redentor, Pão de Açúcar e Escadaria Selarón com duração de 6 horas.' },
    { id: 'kb-3', title: 'Instruções para Motoristas: Aeroporto de Guarulhos', category: 'Procedimentos', lastUpdated: subDays(now, 2).toISOString(), author: 'Ana Silva', summary: 'Local de encontro para embarque de passageiros no Terminal 3 e contato de emergência.' },
    { id: 'kb-4', title: 'Preços de Pedágio: Viagem para a Costa Verde', category: 'Financeiro', lastUpdated: subDays(now, 30).toISOString(), author: 'Ana Silva', summary: 'Tabela atualizada com os valores dos pedágios na Rio-Santos.' },
  ];
  
  export const mockDashboardData = {
    stats: [
      { title: 'Atendimentos Abertos', value: '8', change: '+2 hoje', icon: 'MessagesSquare' },
      { title: 'Agendamentos para Hoje', value: '4', change: '1 concluído', icon: 'CalendarCheck' },
      { title: 'Orçamentos Pendentes', value: '12', change: 'R$ 24.5k', icon: 'FileText' },
      { title: 'Faturamento (Mês)', value: 'R$ 45.8k', change: '+15.2% vs mês anterior', icon: 'DollarSign' },
    ],
    alerts: [
      { id: 'alert-1', title: 'Pagamento pendente', description: 'Reserva #1234 de João Silva vence em 2 horas.', priority: 'high' as 'high', timestamp: subHours(now, 1).toISOString() },
      { id: 'alert-2', title: 'Novo lead de alta prioridade', description: 'Empresa XYZ solicitou contato para evento.', priority: 'medium' as 'medium', timestamp: subHours(now, 4).toISOString() },
    ],
    upcomingBookings: [
      { id: 'book-10', customerName: 'Laura Mendes', service: 'Transfer Aeroporto SDU', time: '14:30' },
      { id: 'book-11', customerName: 'Felipe Barros', service: 'City Tour', time: '15:00' },
      { id: 'book-12', customerName: 'Grupo International', service: 'Receptivo Hotel', time: '17:45' },
    ]
  };
  
  export const mockCompanies: Company[] = [
    { id: 'renascer', name: 'Renascer Transfer Tour' },
    { id: 'alpha', name: 'Alpha Transportes' },
    { id: 'beta', name: 'Beta Turismo Executivo' },
  ];
  
  export const mockPlans: Plan[] = [
    {
      name: 'Básico',
      price: 'R$ 199',
      features: ['1 Usuário', '50 Atendimentos/mês', 'Dashboard Básico', 'Suporte por Email'],
      cta: 'Selecionar Plano',
    },
    {
      name: 'Profissional',
      price: 'R$ 499',
      features: ['5 Usuários', '500 Atendimentos/mês', 'Dashboard Completo', 'CRM/Pipeline', 'Suporte Prioritário'],
      cta: 'Selecionar Plano',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Customizado',
      features: ['Usuários Ilimitados', 'Atendimentos Ilimitados', 'Tudo do Profissional', 'IA Autônoma (opcional)', 'Suporte Dedicado'],
      cta: 'Fale Conosco',
    },
  ];
  
  export const mockTeamMembers: TeamMember[] = [
    { id: 'user-1', name: 'Ana Silva', email: 'ana@example.com', role: 'Gerente', status: 'active' },
    { id: 'user-2', name: 'Carlos Santos', email: 'carlos@example.com', role: 'Atendente', status: 'active' },
    { id: 'user-3', name: 'Beatriz Costa', email: 'beatriz@example.com', role: 'Motorista', status: 'inactive' },
    { id: 'invite-1', email: 'novo.membro@example.com', role: 'Atendente', status: 'pending' },
  ];
  

  // This function simulates a network delay
export const fetchWithDelay = <T>(data: T, delay: number = 500): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
};
