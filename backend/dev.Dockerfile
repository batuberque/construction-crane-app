FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

COPY .bin ./.bin

EXPOSE 3005

CMD ["nodemon", ".bin/www"]