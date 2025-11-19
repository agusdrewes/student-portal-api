# ---- Etapa 1: Build ----
FROM node:20-alpine AS build

RUN apk add --no-cache python3 make g++ bash
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# 👉 COMPILAR A /app/dist
RUN npm run build


# ---- Etapa 2: Runtime ----
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# 👉 Copiar el build correcto
COPY --from=build /app/dist ./dist

# 👉 ***ESTE ES EL PUNTO CRÍTICO***
# Railway debe ejecutar el archivo QUE SÍ EXISTE:
CMD ["node", "dist/src/main.js"]
