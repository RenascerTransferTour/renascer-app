# **App Name**: Central de Atendimento IA Renascer

## Core Features:

- Dashboard Operacional: Exibe métricas operacionais simuladas como leads recebidos hoje, atendimentos em andamento, orçamentos enviados, reservas confirmadas, vendas fechadas e atividades recentes, com gráficos simples para monitoramento.
- Caixa de Entrada Omnichannel: Apresenta uma lista consolidada de conversas simuladas de clientes de diversos canais (WhatsApp, Instagram, Facebook), com filtros por canal, status e busca avançada por nome, telefone, serviço ou destino. Inclui etiquetas de prioridade e destaque para conversas com IA ativa/desativada.
- Tela de Conversa Interativa: Layout de chat profissional com mensagens simuladas entre cliente, IA e atendente humano. Inclui controles visuais para 'Assumir atendimento', 'Devolver para IA', 'Encerrar', 'Criar orçamento', 'Criar reserva', e um tool 'Gerar resumo' que a IA utiliza para sintetizar a conversa.
- Gestão de Orçamentos: Lista orçamentos simulados com status (rascunho, em revisão, enviado, aprovado, perdido). Apresenta um formulário de pré-orçamento com resumo do pedido, faixa de preço fake, botões de revisão comercial e envio, além de um histórico visual.
- Gestão de Reservas: Lista reservas mockadas com status (pendente, confirmada, reagendada, concluída, cancelada). Permite visualizar vínculos com atendimento e orçamento, e oferece um modal para confirmar reserva e detalhes da viagem/passeio.
- Calendário de Atividades: Calendário mensal e semanal que exibe pickups, transfers, passeios e reservas futuras, com cores por tipo de serviço, painel lateral com detalhes do evento e filtros por equipe, tipo de serviço e status.
- Pipeline de Vendas (CRM): Apresenta o pipeline comercial em estilo kanban com etapas como novo lead, qualificado, orçamento enviado, negociação, fechado e perdido. Inclui busca, filtros, cards com valor potencial fake e ações visuais com estado local.
- Gestão de Lead/Cliente: Tela detalhada para visualizar informações de leads e clientes, incluindo nome, telefone, canal de origem, origem, destino, data, horário, passageiros, bagagens, tipo de serviço, observações, urgência, nível de interesse, histórico de contatos, orçamentos e reservas.
- Configuração Avançada da IA: Interface para gerenciar o comportamento da IA, incluindo chave global de ativação/desativação, chaves por canal/fluxo, campo de prompt mestre, regras de negócio, mensagens proibidas, tom de voz, perguntas obrigatórias, regras para transferência a humanos e mensagens padrão. Inclui um botão 'Testar prompt', área de versão (rascunho/publicada) e histórico de alterações, com aviso claro sobre a segurança da API Key real.
- Base de Conhecimento Interna: Exibe uma FAQ simulada, detalhes dos serviços, destinos atendidos, políticas comerciais, orientações de reservas e diferenciais da empresa, com busca interna e categorias de conteúdo.
- Sistema de Atendimento Inteligente (Simulado): Módulo simulado de IA para responder dúvidas iniciais, identificar tipo de serviço, captar dados do cliente, qualificar lead, montar pré-atendimento, sugerir encaminhamento e repassar para humano quando necessário, utilizando um tool para aplicar regras de negócio.

## Style Guidelines:

- Primary color: A sophisticated corporate plum (#4A4270), conveying trust and stability, while adding a modern touch.
- Background color: A very subtle light grey-blue (#F0F0F5), providing a clean and spacious canvas that harmonizes with the primary color.
- Accent color: A vibrant, clear blue (#3C72DD) to highlight interactive elements and important information, ensuring clear calls to action.
- Headline and body text font: 'Inter' (sans-serif) for its modern, neutral, and highly legible characteristics, suitable for a professional internal system.
- Utilize clean, functional icons consistent with Shadcn/UI's default set, ensuring clarity and modern aesthetics suitable for a corporate tool.
- Employ a responsive design with an organized lateral navigation menu, optimizing for clear information hierarchy and productivity across various screen sizes.
- Implement subtle and functional UI animations for state changes, loading indicators (skeletons), empty states, and toasts to provide clear feedback and enhance user experience without being distracting.