# Painel da Familia

Base full-stack em Next.js para um SaaS de organizacao familiar com agenda, financas, tarefas, compras, saude, filhos, billing e insights com IA.

## Visao geral

O projeto foi estruturado para crescer como produto comercial:

- `Next.js 16` com `App Router`
- `TypeScript` em toda a base
- `Tailwind CSS` + `shadcn/ui`
- `Prisma` + `PostgreSQL`
- `Supabase Auth` preparado
- `PWA` com `manifest`, `service worker` e icones gerados pelo App Router
- `Mercado Pago` abstraido por adapter
- `Vitest` para unit tests
- `Playwright` para e2e
- `Husky` + `lint-staged`

Hoje a aplicacao funciona em dois modos:

1. `Demo mode` por padrao, com dados vivos em memoria para navegar e testar fluxos sem banco.
2. `Infra mode`, pronto para conectar Supabase + Postgres + billing real.

## Principais modulos

- Dashboard principal
- Financas com cards, graficos e tabela tipo planilha
- Agenda familiar
- Tarefas da casa e dos filhos
- Compras
- Filhos / escola
- Saude
- Billing, trial e lock screen
- Insights com IA mockados e camada pronta para evolucao

## Estrutura

```txt
src/
  app/
    (marketing)/
    (auth)/
    (dashboard)/
    api/
  components/
    ui/
    shared/
    charts/
    layout/
    billing/
  features/
    auth/
    dashboard/
    finances/
    calendar/
    tasks/
    shopping/
    children/
    health/
    ai-insights/
    billing/
  lib/
    auth/
    billing/
    constants/
    db/
    permissions/
    pwa/
    validations/
  server/
    actions/
    billing/
    repositories/
    services/
  types/
prisma/
tests/
```

## Requisitos

- Node.js 20+
- npm 10+
- PostgreSQL 15+ se quiser rodar com banco real

## Variaveis de ambiente

Use `.env.example` como base:

```bash
cp .env.example .env
```

Campos principais:

- `DATABASE_URL`: Postgres do Supabase ou local
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_WEBHOOK_SECRET`
- `NEXT_PUBLIC_ENABLE_DEMO_MODE`

## Como rodar

```bash
npm install
npm run prisma:generate
npm run dev
```

Abra `http://localhost:3000`.

### Demo mode

Com `NEXT_PUBLIC_ENABLE_DEMO_MODE=true`, o app funciona sem banco e sem Supabase.

Na tela de login, use:

- e-mail: `marina@familiaoliveira.com.br`
- senha: `123456`

Voce tambem pode trocar o cenario demo:

- `Trial ativo`
- `Assinatura ativa`
- `Pagamento pendente`
- `Trial expirado`

## Banco de dados e Prisma

O schema completo esta em [prisma/schema.prisma](/Users/greto/Documents/GitHub/casaemdia/prisma/schema.prisma).

Com Prisma 7, a conexao fica em [prisma.config.ts](/Users/greto/Documents/GitHub/casaemdia/prisma.config.ts), nao no bloco `datasource` do schema.

Fluxo recomendado:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

O seed cria:

- familia brasileira com renda CLT e PJ
- contas da casa
- cartao e parcelamento
- eventos escolares e de saude
- tarefas e compras
- insights mockados
- planos
- cenarios de trial/assinatura

## Supabase

### Auth

1. Crie um projeto no Supabase.
2. Copie `Project URL` e `Anon Key`.
3. Preencha:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Ative e-mail/senha em `Authentication > Providers`.

Hoje o app ja faz:

- login
- cadastro
- logout
- middleware de protecao

Sem chaves do Supabase, ele cai automaticamente no modo demo.

### Postgres

Use a string de conexao do Supabase em `DATABASE_URL`.

Depois:

```bash
npm run prisma:migrate
npm run prisma:seed
```

## Billing e Mercado Pago

O adapter mock esta em [mercado-pago-adapter.ts](/Users/greto/Documents/GitHub/casaemdia/src/server/billing/mercado-pago-adapter.ts).

Hoje a arquitetura ja contempla:

- trial de 7 dias sem cartao
- status `TRIALING`, `ACTIVE`, `PAST_DUE`, `CANCELED`, `EXPIRED`, `INCOMPLETE`
- lock screen apos expirar
- pagina de planos
- billing portal interno
- webhook mock em `/api/billing/webhooks/mercado-pago`

### Configuracao sandbox futura

1. Crie credenciais sandbox no Mercado Pago.
2. Preencha `MERCADO_PAGO_ACCESS_TOKEN`.
3. Configure um endpoint publico para `/api/billing/webhooks/mercado-pago`.
4. Valide assinatura do webhook com `MERCADO_PAGO_WEBHOOK_SECRET`.
5. Substitua o retorno mock do adapter pela criacao real de checkout/subscription.

### Migrando de sandbox para producao

- troque o token sandbox pelo token de producao
- atualize URLs de retorno
- ative validacao real de webhook
- habilite reconciliacao server-side
- registre eventos em `BillingEvent` + `AuditLog`

## PWA

Implementado:

- [manifest.ts](/Users/greto/Documents/GitHub/casaemdia/src/app/manifest.ts)
- [sw.js](/Users/greto/Documents/GitHub/casaemdia/public/sw.js)
- `icon` e `apple-icon` via App Router
- cache basico de assets
- instalacao pronta para mobile

Prioridade de UX offline:

- dashboard
- agenda
- tarefas
- compras

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:e2e
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Testes

Cobertura atual:

- unit: validacao, acesso e componente essencial
- e2e:
  - login
  - visualizar dashboard
  - criar lancamento financeiro
  - criar evento
  - criar tarefa
  - bloquear acesso apos expiracao
  - selecionar plano
  - concluir fluxo de pagamento mockado

## Deploy na Vercel

1. Suba o repositorio para GitHub.
2. Importe na Vercel.
3. Configure as variaveis de ambiente da `.env.example`.
4. Aponte `DATABASE_URL` para o Postgres do Supabase.
5. Rode as migracoes.
6. Configure o webhook do Mercado Pago apontando para o dominio da Vercel.

## Decisoes arquiteturais

- `features/` concentra UI e composicao por dominio.
- `server/services/` concentra regra de negocio.
- `server/actions/` recebe mutacoes da UI.
- `server/repositories/demo-store.ts` deixa o produto funcional sem banco para demo e testes.
- `middleware.ts` protege areas privadas e aplica trial gating.
- `AI insights` usam disclaimer explicito para evitar tom de consultoria regulada.

## Proximos passos recomendados

1. Conectar repositórios reais do Prisma aos services hoje abastecidos pelo demo store.
2. Finalizar onboarding multi-etapas por household.
3. Persistir CRUD completo de compras, saude e filhos.
4. Integrar Supabase Storage para anexos.
5. Substituir o adapter mock do Mercado Pago pela implementacao real.
6. Acoplar provedor real de IA com tracing e versionamento de prompts.

## Referencias usadas

- Prisma Config reference: https://www.prisma.io/docs/orm/reference/prisma-config-reference
- Prisma Schema reference: https://docs.prisma.io/docs/orm/reference/prisma-schema-reference
