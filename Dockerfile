FROM node:12

RUN mkdir /app
WORKDIR /app

COPY package.json /app/

RUN yarn

COPY . /app/

EXPOSE 8000

CMD ["yarn", "start"]
