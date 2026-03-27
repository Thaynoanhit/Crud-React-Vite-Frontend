# 📊 Sistema de Gestao de Orcamentos - Frontend

Aplicacao React + Vite para gerenciamento de orcamentos com calculo em tempo real,
integrada ao backend (Backend API REST em PHP) do projeto.

## 📦 O que faz

- ✅ Criar orcamento com nome do cliente, data e lista de produtos
- ✅ Adicionar/remover itens dinamicamente com subtotal por linha
- ✅ Calcular total do rascunho em tempo real
- ✅ Salvar orcamento via API com limpeza automatica do formulario
- ✅ Listar orcamentos salvos com paginacao
- ✅ Navegar por pagina com `Anterior`, `Proxima` e seletor de pagina

## ✨ Funcionalidades Extras (Opcional)

**CRUD de Produtos Local (Implementado)**

Este projeto inclui como recurso adicional um gerenciador de produtos local (sessao):

- ➕ Adicionar novo produto com nome e valor (local apenas)
- ✏️ Editar produto existente
- 📋 Lista scrollavel de produtos cadastrados (sessao)

**Importante:** Produtos cadastrados nao sao persistidos no banco de dados (BD).
Sao apenas para demonstracao e suporte ao fluxo no frontend.
Pagina recarregada = dados limpos.

O gerenciador esta visivel na area principal, lado direito, acima de "Orcamentos salvos".

**Escopo principal (obrigatorio e implementado):**

- selecao de produtos existentes (da BD via API)
- montagem do orcamento com itens/quantidade/subtotal
- calculo em tempo real
- persistencia do orcamento com limpeza do formulario apos sucesso

## 🧠 Arquitetura (Frontend)

```
components -> hooks -> services -> API
```

- `components`: renderizacao de formulario, lista, tabela e feedback
- `hooks`: estado e regras da pagina (`useOrcamentoPage`)
- `services`: comunicacao HTTP com o backend (Backend API)
- `utils`: formatacao e regras puras (datas, moeda, total)

## ⚙️ Pre-requisitos

- Docker + Docker Compose
- Node.js 20+ e npm 10+ (apenas para desenvolvimento local sem Docker)

## 🚀 Setup

### Opcao rapida (recomendado)

No diretorio `../BACKEND_PHP` (Backend API):

```bash
docker compose up -d
docker compose exec php vendor/bin/phinx migrate
docker compose exec php vendor/bin/phinx seed:run
```

Depois, no diretorio `FRONTEND_REACT`:

```bash
bash setup.sh
```

Esse fluxo:

- executa os testes em container Node temporario (com isolamento de `node_modules` para evitar problemas de permissao)
- faz build da imagem de producao
- sobe o frontend em `http://localhost:5173`

### Opcao manual

No diretorio `../BACKEND_PHP` (Backend API):

```bash
docker compose up -d
docker compose exec php vendor/bin/phinx migrate
docker compose exec php vendor/bin/phinx seed:run
```

Depois, no diretorio `FRONTEND_REACT`:

```bash
docker compose build --no-cache frontend
docker compose up -d frontend
curl -I http://localhost:5173
```

### Opcao local (sem Docker no frontend)

Para desenvolvimento com Vite e hot reload:

No diretorio `../BACKEND_PHP`:

```bash
docker compose up -d
docker compose exec php vendor/bin/phinx migrate
docker compose exec php vendor/bin/phinx seed:run
```

Backend API em: `http://localhost:8000`

Depois, no frontend:

```bash
npm install
npm run dev
```

Frontend em: `http://localhost:5173`

## 🤖 CI (GitHub Actions)

Este repositorio possui pipeline em `.github/workflows/ci.yml`.

Execucao automatica em:

- `push` para `main`, `develop` e `master`
- `pull_request`

Etapas do pipeline:

- setup de Node 20
- instalacao de dependencias com `npm ci`
- lint (`npm run lint`)
- testes (`npm run test`)
- build (`npm run build`)

## 🌐 Enderecos locais

- 🖥️ Frontend: `http://localhost:5173`
- 🔗 Backend API: `http://localhost:8000`

## 🔒 Validacoes

**Principais:**

- Nome do cliente obrigatorio
- Data obrigatoria
- Minimo de 1 item por orcamento
- Quantidade maior que zero
- Produto obrigatorio em cada item

**Extras (Implementadas):**

- Previne adicionar o mesmo produto 2x em draft (por produto_id + valor unitario)
- Previne adicionar o mesmo item no rascunho atual (previne duplicatas no draft)
- Confirmação antes de deletar produto ou orçamento

## 🧪 Testes

**3 testes Vitest + Testing Library** (Unit + Integracao):

- ✅ Calculo de total da regra de negocio (`calculateTotal`)
- ✅ Fluxo de adicionar/remover item com recalculo em tempo real
- ✅ Fluxo de salvar orcamento e limpar formulario apos sucesso

**Resultados:** `7 tests passed`

Rodar testes:

```bash
npm run test
```

Estrutura:

- `tests/Unit`: regras de negocio puras
- `tests/Integration`: fluxo de interface e integracao entre componentes

## 🧰 Stack

| Componente      | Versao                  |
| --------------- | ----------------------- |
| React           | 19                      |
| Vite            | 8                       |
| Vitest          | 4                       |
| Nginx (runtime) | Chainguard Nginx (dist) |
| Docker          | Compose v2              |

## 🏗️ Observacao de infra

Para simplificar o setup da avaliacao, o frontend roda em container de producao com Nginx servindo somente os arquivos de `dist`.

O build usa imagem Chainguard Node e o runtime usa Chainguard Nginx, ambos fixados por digest no `Dockerfile`.

Essa abordagem reduz variacao de ambiente e melhora rastreabilidade de seguranca durante a avaliacao tecnica.

## 🔌 Integracao com Backend API

### Opcao A (producao em Docker): Proxy do Nginx

No container de producao, o Nginx redireciona `/api` para `http://host.docker.internal:8000`.

### Opcao B (desenvolvimento local): Proxy do Vite

Ja configurado em `vite.config.js`:

- Frontend chama `/api/produtos` e `/api/orcamentos`
- Vite redireciona para `http://localhost:8000`

### Opcao C: URL direta com CORS

Crie `.env.local` na raiz do frontend:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

Depois reinicie o frontend (`npm run dev`).

## 📋 Checklist de validacao manual

**Fluxo Principal:**

1. ✅ Confirmar carregamento dos produtos no select.
2. ✅ Preencher nome do cliente e data.
3. ✅ Adicionar itens e validar total em tempo real.
4. ✅ Remover item e validar recalculo do total.
5. ✅ Tentar adicionar o mesmo produto 2x = bloqueado (validação de duplicatas).
6. ✅ Salvar orcamento e validar mensagem de sucesso.
7. ✅ Confirmar limpeza do formulario apos salvar.

**Funcionalidades Extras:**

8. ✅ Validar paginacao da lista de orcamentos salvos.
9. ✅ Clicar em "Editar" de um orcamento = form preenchida com dados.
10. ✅ Clicar em "Excluir" de um orcamento = confirma ao deletar.
11. ✅ Clicar em "Editar" produto = carrega dados no form.
12. ✅ Clicar em "Excluir" produto = confirma ao deletar.
13. ✅ Botoes lado a lado (Editar | Excluir).

## 🧰 Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## 🛠️ Troubleshooting

Backend API nao responde?

```bash
cd ../BACKEND_PHP
docker compose up -d
docker compose logs -f php
```

Se o servico `php` do backend (Backend API) nao iniciar no Docker/Whaler e aparecer `address already in use`, veja a secao de troubleshooting do `BACKEND_PHP/README.md` para liberar a porta `8000` ou trocar o mapeamento de porta.

Frontend nao refletiu variaveis de ambiente novas?

```bash
# pare e suba novamente
npm run dev
```

Lint acusando erro em arquivo gerado?

- O projeto ignora `dist` e `.vite-cache` no ESLint.
- Se necessario, limpe cache local e rode novamente: `rm -rf .vite-cache && npm run lint`.

## 🔒 Manutencao dos digests Docker

O `Dockerfile` usa imagens fixadas por digest para garantir build reprodutivel e melhor rastreabilidade de seguranca.

Para atualizar periodicamente:

```bash
docker pull cgr.dev/chainguard/node:latest-dev
docker image inspect cgr.dev/chainguard/node:latest-dev --format '{{index .RepoDigests 0}}'

docker pull cgr.dev/chainguard/nginx:latest
docker image inspect cgr.dev/chainguard/nginx:latest --format '{{index .RepoDigests 0}}'
```

Depois, substitua os valores de `sha256:...` no `Dockerfile`, rode novo build e valide:

```bash
docker compose build --no-cache frontend
docker compose up -d frontend
curl -I http://localhost:5173
```
