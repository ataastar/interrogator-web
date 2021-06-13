
# Stage 1

FROM node:13-alpine as build-step

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app

RUN npm run build --qovery

# Stage 2

FROM nginx:1.17.1-alpine

COPY --from=build-step /usr/src/dist/interrogator-web /usr/share/nginx/html