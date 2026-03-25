FROM cgr.dev/chainguard/node:latest-dev@sha256:d8c3f18efe205169cd8a9c2d180b2b5eff727204cab696652f56840c7ba8ec41 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM cgr.dev/chainguard/nginx:latest@sha256:8987b562107b4275bd594b9dcf2def36737720460b12fce90bb13c729353ca54

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/nginx.default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["-g", "daemon off;"]
