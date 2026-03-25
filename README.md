# 📊 Sistema de Orcamentos - Frontend

Aplicacao React + Vite para criacao e listagem de orcamentos com calculo em tempo real,
integrada a API PHP do projeto.

## 📦 O que faz

- ✅ Criar orcamento com nome do cliente, data e itens
- ✅ Adicionar/remover itens dinamicamente com subtotal por linha
- ✅ Calcular total do rascunho em tempo real
- ✅ Salvar orcamento via API e limpar formulario apos sucesso
- ✅ Listar orcamentos salvos com paginacao
- ✅ Navegar por pagina com `Anterior`, `Proxima` e seletor de pagina

## 🧠 Arquitetura (Frontend)

```
components -> hooks -> services -> API
```

- `components`: renderizacao de formulario, lista, tabela e feedback
- `hooks`: estado e regras da pagina (`useOrcamentoPage`)
- `services`: comunicacao HTTP com backend
- `utils`: formatacao e regras puras (datas, moeda, total)

## ⚙️ Pre-requisitos

- Node.js 20+
- npm 10+
- Docker + Docker Compose (para subir o backend local)

## 🚀 Setup

### Opcao rapida (frontend)

No diretorio `FRONTEND_REACT`:

```bash
npm install
npm run dev
```

Aplicacao em: `http://localhost:5173`

### Opcao manual (subir backend primeiro)

No diretorio `../BACKEND_PHP`:

```bash
docker compose up -d
docker compose exec php vendor/bin/phinx migrate
docker compose exec php vendor/bin/phinx seed:run
```

API esperada em: `http://localhost:8000`

Depois, no frontend:

```bash
npm install
npm run dev
```

## 🌐 Enderecos locais

- 🖥️ Frontend: `http://localhost:5173`
- 🔗 API backend: `http://localhost:8000`

## 🔌 Integracao com backend

### Opcao A (padrao): Proxy do Vite

Ja configurada em `vite.config.js`:

- Frontend chama `/api/produtos` e `/api/orcamentos`
- Vite redireciona para `http://localhost:8000`

### Opcao B: URL direta com CORS

Crie `.env.local` na raiz do frontend:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

Depois reinicie o frontend (`npm run dev`).

## 🧰 Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## 🧪 Estrutura de testes

Os testes seguem separacao por tipo (mesmo conceito usado no backend):

- `tests/Unit`: regras de negocio puras
- `tests/Integration`: fluxo de interface e integracao entre componentes

## ✅ Testes

3 testes Vitest + Testing Library (Unit + Integracao):

- Calculo de total da regra de negocio (`calculateTotal`)
- Fluxo de adicionar/remover item com recalculo em tempo real
- Fluxo de salvar orcamento e limpar formulario apos sucesso

Rodar testes:

```bash
npm run test
```

## 📋 Checklist de validacao manual

1. ✅ Confirmar carregamento dos produtos no select.
2. ✅ Preencher nome do cliente e data.
3. ✅ Adicionar itens e validar total em tempo real.
4. ✅ Remover item e validar recalculo do total.
5. ✅ Salvar orcamento e validar mensagem de sucesso.
6. ✅ Confirmar limpeza do formulario apos salvar.
7. ✅ Validar paginacao da lista de orcamentos salvos.

## 🛠️ Troubleshooting

Se a API nao responder:

```bash
cd ../BACKEND_PHP
docker compose up -d
docker compose logs -f php
```

Se o frontend nao refletir variaveis de ambiente novas:

```bash
# pare e suba novamente
npm run dev
```
