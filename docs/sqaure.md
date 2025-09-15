- Use o cartão de teste: 4111 1111 1111 1111
- Qualquer CVV e data futura

Próximos passos para produção:

1. Adicionar as variáveis no Vercel Dashboard
2. Testar com cartão real em produção

O sistema agora está usando Square em vez de Stripe para processar pagamentos de gift cards!

> square tem numero de card para sandbox ?

⏺ Sim! Square tem cartões de teste específicos para Sandbox:

💳 Cartões de Teste Square Sandbox

Cartões Aprovados:

✅ Visa: 4111 1111 1111 1111 ✅ Mastercard: 5105 1051 0510 5100 ✅ Discover: 6011 0000 0000 0004 ✅ American Express:
3400 000000 00009 ✅ Diners Club: 3000 000000 0004 ✅ JCB: 3530 1113 3330 0000

Cartões para Erros Específicos:

❌ Recusado: 4000 0000 0000 0002 ❌ CVV incorreto: 4000 0000 0000 0010 ❌ Postal Code incorreto: 4000 0000 0000 0036 ❌
Expirado: 4000 0000 0000 0069 ❌ Processamento erro: 4000 0000 0000 0119

Dados Adicionais para Teste:

- CVV: Qualquer 3 dígitos (4 para Amex)
- Data Expiração: Qualquer data futura
- ZIP/Postal Code: Qualquer código válido
- Nome: Qualquer nome

Exemplo de Teste Completo:

Número: 4111 1111 1111 1111 CVV: 123 Expiração: 12/25 ZIP: 33306 Nome: Test User

Importante: Estes cartões só funcionam no ambiente Sandbox. Em produção, use cartões reais.
