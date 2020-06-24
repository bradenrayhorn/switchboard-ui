FROM node:13.8.0 as build

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
COPY ./yarn.lock /usr/src/app/yarn.lock

RUN yarn install
RUN npm install react-scripts -g
COPY ./public /usr/src/app/public
COPY ./src /usr/src/app/src
RUN yarn build

FROM nginx:1.15.2-alpine

COPY --from=build /usr/src/app/build /var/www
COPY ./nginx/default.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
