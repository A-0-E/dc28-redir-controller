FROM node:12-alpine
RUN apk add --no-cache iptables
RUN mkdir /app
WORKDIR /app
COPY ./backend/ /app/
COPY ./schema/ /schema/
RUN yarn install
CMD ["yarn", "start"]
