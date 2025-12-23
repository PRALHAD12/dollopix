# Multi-stage build for development and production
FROM node:20-slim AS base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

FROM base AS development
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

FROM base AS production
ENV NODE_ENV=production
RUN npm prune --omit=dev
EXPOSE 3000
CMD ["npm", "start"]
