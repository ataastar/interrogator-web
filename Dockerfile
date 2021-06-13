
# Stage 1

FROM node:13-alpine as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --qovery

# Stage 2

FROM nginx:1.17.1-alpine

COPY --from=build-step /app/docs /usr/share/nginx/html