FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["node", "dist/main"]
