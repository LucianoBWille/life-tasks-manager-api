FROM node:20.10.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# RUN npm i --only=production

COPY . .

RUN npm run build

# execute prisma generate and then start the app
CMD [ "node", "main.js" ]
# CMD [ "npm", "run", "start:prod" ]