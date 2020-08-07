FROM node:12-alpine AS frontend

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn install

COPY . /app/
RUN yarn build

FROM nginx:alpine
RUN mkdir /app
COPY --from=frontend /app/build /app/public
WORKDIR /app
EXPOSE 80
