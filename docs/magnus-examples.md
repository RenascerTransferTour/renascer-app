# MAGNUS — Exemplos de Request/Response

Este arquivo documenta exemplos reais de entrada e saída do MAGNUS.

## Objetivo
Padronizar:
- entrada do backend para a IA
- saída estruturada da IA
- regras de silêncio
- handoff para a Cláudia
- coleta de dados para CRM

---

## Exemplo 1 — Primeira mensagem do cliente

### Request
```json
{
  "conversation_id": "conv_101",
  "customer_id": "cust_101",
  "timestamp": "2026-03-08T15:00:00-03:00",
  "channel": "whatsapp",
  "has_text": true,
  "has_media": false,
  "media_types": [],
  "last_customer_message": "Olá",
  "message_language_hint": "pt",
  "metadata": {
    "is_saved_contact": false,
    "internal": false,
    "team": false,
    "driver": false,
    "partner": false,
    "human_active": false
  },
  "state": {
    "customer_name": null,
    "form_sent": false,
    "human_takeover": false,
    "conversation_closed": false,
    "service_type": "unknown"
  }
}
```

### Response
```json
{
  "should_reply": true,
  "silence_reason": null,
  "language": "pt",
  "customer_type": "external_customer",
  "stage": "welcome",
  "handoff_to_claudia": false,
  "form_sent": false,
  "close_conversation": false,
  "service_type": "unknown",
  "intent": "general_inquiry",
  "collected_data": {
    "customer_name": null,
    "origin": null,
    "destination": null,
    "date": null,
    "time": null,
    "passengers": null,
    "bags": null,
    "bag_size": null,
    "child": null,
    "region_interest": null,
    "trip_destination_city": null
  },
  "messages": [
    "Olá! Seja bem-vindo(a) à Renascer Transfer Tour 😊 Sou o Magnus — como posso ajudar hoje?"
  ]
}
```

---

## Exemplo 2 — Cliente especifica o serviço

### Request
```json
{
  "conversation_id": "conv_102",
  "customer_id": "cust_102",
  "timestamp": "2026-03-08T15:05:00-03:00",
  "channel": "whatsapp",
  "has_text": true,
  "has_media": false,
  "media_types": [],
  "last_customer_message": "Preciso de um transfer",
  "message_language_hint": "pt",
  "metadata": {
    "is_saved_contact": false,
    "internal": false,
    "team": false,
    "driver": false,
    "partner": false,
    "human_active": false
  },
  "state": {
    "customer_name": null,
    "form_sent": false,
    "human_takeover": false,
    "conversation_closed": false,
    "service_type": "unknown"
  }
}
```

### Response
```json
{
  "should_reply": true,
  "silence_reason": null,
  "language": "pt",
  "customer_type": "external_customer",
  "stage": "qualify",
  "handoff_to_claudia": false,
  "form_sent": false,
  "close_conversation": false,
  "service_type": "transfer",
  "intent": "service_request",
  "collected_data": {
    "customer_name": null,
    "origin": null,
    "destination": null,
    "date": null,
    "time": null,
    "passengers": null,
    "bags": null,
    "bag_size": null,
    "child": null,
    "region_interest": null,
    "trip_destination_city": null
  },
  "messages": [
    "Qual é o local exato de embarque e o destino?"
  ]
}
```

---

## Exemplo 3 — Cliente pergunta o preço

### Request
```json
{
  "conversation_id": "conv_103",
  "customer_id": "cust_103",
  "timestamp": "2026-03-08T15:10:00-03:00",
  "channel": "whatsapp",
  "has_text": true,
  "has_media": false,
  "media_types": [],
  "last_customer_message": "Quanto custa o transfer para Búzios?",
  "message_language_hint": "pt",
  "metadata": {
    "is_saved_contact": false,
    "internal": false,
    "team": false,
    "driver": false,
    "partner": false,
    "human_active": false
  },
  "state": {
    "customer_name": null,
    "form_sent": false,
    "human_takeover": false,
    "conversation_closed": false,
    "service_type": "transfer"
  }
}
```

### Response
```json
{
  "should_reply": true,
  "silence_reason": null,
  "language": "pt",
  "customer_type": "external_customer",
  "stage": "handoff",
  "handoff_to_claudia": true,
  "form_sent": false,
  "close_conversation": true,
  "service_type": "transfer",
  "intent": "price_request",
  "collected_data": {
    "customer_name": null,
    "origin": null,
    "destination": "Búzios",
    "date": null,
    "time": null,
    "passengers": null,
    "bags": null,
    "bag_size": null,
    "child": null,
    "region_interest": null,
    "trip_destination_city": null
  },
  "messages": [
    "Os valores são confirmados exclusivamente pela Administradora Claudia Rosani Vaz da Silva para total precisão 😊 Posso encaminhar os dados do seu serviço?"
  ]
}
```
