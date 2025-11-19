# ---- Stage 1: Build ----
FROM node:20-alpine AS build

RUN apk add --no-cache python3 make g++ bash
WORKDIR /app

# Copiar todo (no solo algunos archivos)
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY ormconfig.ts ./
COPY src ./src

RUN npm ci

# Compilar el proyecto (genera /app/dist/src/main.js)
RUN npm run build


# ---- Stage 2: Runtime ----
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copiar todo el build generado
COPY --from=build /app/dist ./dist

CMD ["node", "dist/src/main.js"]
