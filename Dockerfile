FROM node:13 as build

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build:prod


FROM nginx:1.19.0

COPY --from=build /app/build /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
