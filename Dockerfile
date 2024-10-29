FROM node:22 as builder

WORKDIR /app

COPY package*.json .env ./

RUN npm ci

COPY . .

RUN npx tsc

FROM node:22-slim

ENV NODE_ENV=production

USER node

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY --from=builder /app/dist/src/** /app/.env /app/

ENTRYPOINT [ "node", "main.js" ]