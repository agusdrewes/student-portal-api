# ---- Etapa 1: build ----
FROM node:20-alpine AS build

RUN apk add --no-cache python3 make g++ bash
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# 👉 COMPILA EL PROYECTO (genera /app/dist)
RUN npm run build


# ---- Etapa 2: runtime ----
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copiamos la carpeta compilada de la etapa anterior
COPY --from=build /app/dist ./dist

# Arrancar Nest compilado
CMD ["node", "dist/main.js"]
