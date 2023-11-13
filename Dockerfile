# syntax=docker/dockerfile:1
FROM node:14.21.3-alpine

RUN mkdir -p /app

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

COPY . .

RUN npm build 

EXPOSE 4000

CMD ["npm", "start"]