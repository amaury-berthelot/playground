FROM node:14-alpine

WORKDIR /app

COPY . .

RUN npm  ci --only=production

EXPOSE 3000

CMD ["node", "server.js"]
