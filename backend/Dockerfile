FROM node:18-alpine as builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app .

RUN mkdir -p /app/uploads

EXPOSE 3005

# Not `npm start` — that runs node --watch, an experimental file-watcher that
# has no place in production.
CMD ["npm", "run", "start:prod"]
