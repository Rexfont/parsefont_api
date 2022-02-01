FROM node:16
WORKDIR /apps
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8012
CMD [ "node", "app.js" ]