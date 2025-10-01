FROM node:20-alpine
RUN apk add --no-cache python3 make g++ bash
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY nest-cli.json ./
COPY src ./src
COPY ormconfig.ts ./

EXPOSE 3000
