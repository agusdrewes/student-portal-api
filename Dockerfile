FROM node:20-alpine AS build

RUN apk add --no-cache python3 make g++ bash
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY ormconfig.ts ./
COPY src ./src

RUN npm ci


RUN npm run build


FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

CMD ["node", "dist/src/main.js"]
