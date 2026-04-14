# LGPDetes Proxy Bruno Collection

Coleção Bruno completa para a API deste projeto.

## Localização

Abra a pasta:

`bruno/agegate-proxy-api`

## O que está incluído

- Todas as rotas em `app/api`
- Arquivos raiz compatíveis com Bruno app e `bru` CLI: `bruno.json` + `collection.bru`
- Ambiente `local` pronto para `http://localhost:3000`
- Pastas separadas por domínio:
  - `auth`
  - `client`
  - `user`
  - `verification`
  - `admin`
- Documentação inline na collection, nas pastas principais e nas requests-chave
- Captura automática de variáveis ao longo do fluxo:
  - `clientSessionId`
  - `verificationId`
  - `proofToken`

## Pré-requisitos

1. Suba a aplicação localmente.
2. Abra a collection no Bruno.
3. Selecione `environments/local.bru`.

## Credenciais seed

### Usuário

- Email: `joao.silva@northmail.com`
- Senha: `DemoUser!23`

### Admin

- Email: `admin@lgpdetesproxy.com`
- Senha: `DemoAdmin!23`

## Variáveis principais do ambiente

- `baseUrl`: URL local da aplicação
- `platformId`: plataforma padrão para testes
- `providerId`: provedor padrão para testes
- `clientSessionId`: sessão do cliente externo
- `verificationId`: ID de verificação
- `proofToken`: token emitido pela verificação
- `connectionId`: conexão ativa para teste de revogação

## Fluxos recomendados

### Fluxo externo completo

1. `client/Request Age Check`
2. `clientSessionId` é preenchido automaticamente com `session.id`
3. `auth/User Login`
4. `user/Create Consent`
5. `user/Start Verification`
6. `verificationId` é preenchido automaticamente com `verification.id`
7. `verification/Provider Callback`
8. `verification/Finalize Verification`
9. `proofToken` é preenchido automaticamente com `verification.proofToken`
10. `client/Exchange Proof`

### Fluxo de usuário autenticado

1. `auth/User Login`
2. `user/List Platforms`
3. `user/List Providers`
4. `user/List Connections`
5. `user/Revoke Connection`

### Fluxo administrativo

1. `auth/Admin Login`
2. `admin/Get Dashboard`
3. `admin/List Platforms`
4. `admin/Update Platform Status`
5. `admin/List Providers`
6. `admin/Create Provider`
7. `admin/List Users`
8. `admin/List Logs`

## Comportamentos úteis

- O Bruno normalmente reaproveita os cookies de login para as rotas protegidas.
- Os logouts retornam `303`; isso é esperado.
- Como o banco é em memória, criar usuário/provedor ou rodar verificações altera o estado até reiniciar o servidor.
- Se quiser rodar pelo CLI, execute dentro de `bruno/agegate-proxy-api` com `bru run`.

## Inventário de endpoints

### Auth

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `POST /api/admin/login`
- `POST /api/admin/logout`

### Client

- `POST /api/client/request-age-check`
- `GET /api/client/session-status`
- `POST /api/client/exchange-proof`

### User

- `GET /api/user/platforms`
- `GET /api/user/providers`
- `POST /api/user/consent`
- `POST /api/user/verify`
- `GET /api/user/connections`
- `POST /api/user/connections/:id/revoke`

### Verification

- `POST /api/verification/start`
- `GET /api/verification/:id/status`
- `POST /api/verification/:id/callback/provider`
- `POST /api/verification/:id/finalize`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/platforms`
- `PATCH /api/admin/platforms/:id/status`
- `GET /api/admin/providers`
- `POST /api/admin/providers`
- `GET /api/admin/users`
- `GET /api/admin/logs`
