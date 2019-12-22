FROM keymetrics/pm2:latest-alpine

RUN npm install -g pm2 dotenv esm

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["pm2", "start", "./pm2.yml"]
