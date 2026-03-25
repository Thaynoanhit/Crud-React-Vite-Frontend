# 📊 Sistema de Gestao de Orcamentos - Frontend

Aplicacao React + Vite para gerenciamento de orcamentos com calculo em tempo real,
integrada a API REST em PHP do projeto.

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
- `services`: comunicacao HTTP com backend
- `utils`: formatacao e regras puras (datas, moeda, total)

## ⚙️ Pre-requisitos

- Docker + Docker Compose
- Node.js 20+ e npm 10+ (apenas para desenvolvimento local sem Docker)

## 🚀 Setup

### Opcao rapida (recomendado)

No diretorio `../BACKEND_PHP` (API):

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

No diretorio `../BACKEND_PHP` (API):

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

API em: `http://localhost:8000`

Depois, no frontend:

```bash
npm install
npm run dev
```

Frontend em: `http://localhost:5173`

## 🌐 Enderecos locais

- 🖥️ Frontend: `http://localhost:5173`
- 🔗 API backend: `http://localhost:8000`

## 🔒 Validacoes

- Nome do cliente obrigatorio
- Data obrigatoria
- Minimo de 1 item por orcamento
- Quantidade maior que zero
- Produto obrigatorio em cada item

## 🧪 Testes

3 testes Vitest + Testing Library (Unit + Integracao):

- ✅ Calculo de total da regra de negocio (`calculateTotal`)
- ✅ Fluxo de adicionar/remover item com recalculo em tempo real
- ✅ Fluxo de salvar orcamento e limpar formulario apos sucesso

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

## 🔌 Integracao com backend

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

1. ✅ Confirmar carregamento dos produtos no select.
2. ✅ Preencher nome do cliente e data.
3. ✅ Adicionar itens e validar total em tempo real.
4. ✅ Remover item e validar recalculo do total.
5. ✅ Salvar orcamento e validar mensagem de sucesso.
6. ✅ Confirmar limpeza do formulario apos salvar.
7. ✅ Validar paginacao da lista de orcamentos salvos.

## 🧰 Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## 🛠️ Troubleshooting

API nao responde?

```bash
cd ../BACKEND_PHP
docker compose up -d
docker compose logs -f php
```

Frontend nao refletiu variaveis de ambiente novas?

```bash
# pare e suba novamente
npm run dev
```

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
