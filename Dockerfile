FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:local"]

