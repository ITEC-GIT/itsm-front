FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

ARG IMAGE_TAG
ENV IMAGE_TAG=${IMAGE_TAG}

EXPOSE 3001

CMD [ "serve", "-s", "dist" ]

# Define build argument
