FROM node:latest

WORKDIR /app

COPY /app/package.json .

RUN npm install

COPY /app .

EXPOSE 3000

CMD [ "npm", "start" ]
