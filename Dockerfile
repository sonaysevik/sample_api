FROM node:12.18.3-alpine3.9

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 2001

CMD [ "node", "index.js" ]