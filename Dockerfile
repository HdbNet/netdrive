FROM node:current-alpine
WORKDIR /usr/netdrive/app

RUN npm i
CMD [ "npm", "start" ]
