#!/bin/bash

# Script para rodar o projeto frontend automaticamente
# Uso: bash setup.sh

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "================================"
echo "  Setup Automatico do Frontend"
echo "================================"
echo ""

echo -e "${BLUE}1) Executando testes em container temporario Node...${NC}"
TEMP_NODE_MODULES_DIR="$(mktemp -d)"
trap 'rm -rf "$TEMP_NODE_MODULES_DIR"' EXIT
docker run --rm --user "$(id -u):$(id -g)" -v "$(pwd):/app" -v "$TEMP_NODE_MODULES_DIR:/app/node_modules" -w /app node:20.19.5-alpine3.22 sh -lc "npm ci && npm run test"
echo -e "${GREEN}OK: Testes concluidos${NC}"
echo ""

echo -e "${BLUE}2) Build e start do container frontend (producao)...${NC}"
docker compose up -d --build
echo -e "${GREEN}OK: Container iniciado${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Ambiente frontend pronto para uso!  ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Frontend: http://localhost:5173"
echo ""
echo "Para acompanhar logs do app:"
echo "docker compose logs -f frontend"
