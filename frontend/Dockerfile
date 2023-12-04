FROM node:latest

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

COPY . .

RUN npm install -g npm && npm run build

EXPOSE 5173

CMD [ "npm", "run", "devH"]
