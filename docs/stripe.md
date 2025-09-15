Configuração Completa do Stripe para Receber Pagamentos

1. Criar Conta no Stripe

1. Acessar https://stripe.com → "Sign up"
1. Preencher dados da empresa/pessoa
1. Verificar email

1. Configuração Básica da Conta

Dashboard Stripe → Settings:

Business Details (Detalhes do Negócio):

- Business name: Flavia Guedes Beauty
- Business type: Individual/Company
- Industry: Beauty & Personal Care
- Business address: 2685 E. Oakland Park Blvd, Fort Lauderdale, FL 33306
- Tax ID/EIN: (se empresa) ou SSN (se individual)

Public Details (Informações Públicas):

- Statement descriptor: FLAVIA GUEDES
- Customer support email: email da Flávia
- Customer support phone: telefone do salão

3. Configuração Bancária (ESSENCIAL para receber)

Dashboard → Balance → Add bank account:

- Routing number: Número do banco
- Account number: Número da conta
- Account holder name: Nome igual ao da conta

4. Verificação de Identidade

Documentos necessários:

- Documento de identidade (driver's license/passport)
- Comprovante de endereço (utility bill)
- EIN Letter (se empresa) ou SSN (se individual)

5. Configurar Produtos no Stripe

Dashboard → Products → Create product: Nome: Gift Card Tipo: One-time Preço: Variable (será definido dinamicamente)

6. Chaves da API

Dashboard → Developers → API keys:

# .env.local

STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx

⚠️ IMPORTANTE: Atualmente está usando chaves de teste. Trocar para LIVE quando aprovado.

7. Configurar Webhooks (Opcional mas Recomendado)

Dashboard → Developers → Webhooks → Add endpoint:

Endpoint URL: https://flaviaguedes.com/api/webhook-stripe Events to listen:

- checkout.session.completed
- payment_intent.succeeded
- payment_intent.payment_failed

8. Compliance e Impostos

Dashboard → Settings → Tax:

- Ativar Sales tax se necessário no estado
- Florida geralmente não taxa serviços de beleza

9. Modo de Teste vs Produção

Atual (Teste):

- Chaves começam com sk*test* e pk*test*
- Usar cartão teste: 4242 4242 4242 4242

Produção:

- Chaves começam com sk*live* e pk*live*
- Processar pagamentos reais

10. Checklist Final Antes de Go Live

- Conta verificada (badge verde no Dashboard)
- Banco conectado e verificado
- Identidade verificada
- Trocar chaves de teste para produção no .env
- Testar um pagamento real pequeno ($1)
- Configurar período de pagamento (daily/weekly)

11. Configurações de Pagamento

Dashboard → Balance → Settings:

- Payout schedule: Daily ou 2-day rolling
- Payout method: Bank account
- Minimum payout: $10 (configurável)

📧 Emails Importantes que Receberá:

1. Confirmação de conta
2. Verificação pendente
3. Conta aprovada
4. Primeiro pagamento recebido
5. Payouts processados

⏱️ Tempo Estimado:

- Verificação: 1-3 dias úteis
- Primeiro payout: 7-14 dias (primeira vez)
- Payouts regulares: 2 dias úteis

Preciso criar o webhook handler ou ajustar algo no código para produção?
