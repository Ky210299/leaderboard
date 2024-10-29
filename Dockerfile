FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx tsc

FROM node:22-slim

ENV NODE_ENV=${NODE_ENVIRONMENT}

USER node

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY --from=builder /app/dist/** ./dist/
COPY start.sh ./

ENTRYPOINT ["./start.sh"]
