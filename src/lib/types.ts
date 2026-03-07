export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  originChannel: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Website';
  urgency: 'low' | 'medium' | 'high';
  interestLevel: 'low' | 'medium' | 'high';
  serviceType?: string;
  destination?: string;
  departureDate?: string;
  departureTime?: string;
  passengers?: number;
  luggage?: string;
  observations?: string;
  createdAt: string;
};

export type Message = {
  id: string;
  role: 'user' | 'agent' | 'ai';
  content: string;
  timestamp: string;
  authorName?: string;
  authorAvatar?: string;
};

export type Conversation = {
  id: string;
  customerId: string;
  channel: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Website';
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  isAiActive: boolean;
  lastMessage: string;
  lastMessageAt: string;
  messages: Message[];
};

export type Quote = {
  id: string;
  customerId: string;
  conversationId: string;
  status: 'draft' | 'review' | 'sent' | 'approved' | 'lost';
  summary: string;
  priceRange: [number, number];
  createdAt: string;
  updatedAt: string;
};

export type Booking = {
  id: string;
  customerId: string;
  quoteId: string;
  service: 'Pickup' | 'Transfer' | 'Tour';
  date: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'canceled';
  details: string;
  createdAt: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  type: 'Pickup' | 'Transfer' | 'Tour' | 'Booking';
  start: Date;
  end: Date;
  details?: string;
  status?: string;
  team?: string;
};

export type PipelineDeal = {
  id: string;
  customerId: string;
  title: string;
  stage: 'new-lead' | 'qualified' | 'quote-sent' | 'negotiation' | 'closed-won' | 'closed-lost';
  value: number;
  createdAt: string;
};

export type KnowledgeBaseArticle = {
  id: string;
  category: 'Services' | 'Destinations' | 'Policies' | 'Bookings' | 'Company';
  title: string;
  content: string;
};
