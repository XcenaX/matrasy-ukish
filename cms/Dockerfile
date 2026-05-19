FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache vips-dev build-base python3

# --- DEV (по умолчанию для docker-compose.yml) ---
FROM base AS dev
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 1337
CMD ["npm", "run", "develop"]

# --- PROD build ---
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- PROD runtime ---
FROM node:22-alpine AS prod
WORKDIR /app
RUN apk add --no-cache vips
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config
COPY --from=builder /app/database ./database
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./
EXPOSE 1337
CMD ["npm", "run", "start"]
