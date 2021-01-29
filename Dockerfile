FROM node:14.15.4-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install
ADD . /usr/src/app
RUN npm run build

EXPOSE 5000
CMD [ "node", "./dist/index.js" ]
