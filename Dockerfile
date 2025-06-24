# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build
RUN npm run build:server

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/build/ ./build/
COPY --from=builder /app/server-build/ ./server-build/
COPY --from=deps /app/node_modules ./node_modules
RUN ls -ltr node_modules
RUN npm prune --omit=dev
ENV NODE_ENV=production
ENV PORT=8090
EXPOSE 8090
CMD ["node", "server-build/index.js"]
