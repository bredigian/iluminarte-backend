FROM node:22

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . .

EXPOSE 4040

CMD [ "npm", "run", "start" ]