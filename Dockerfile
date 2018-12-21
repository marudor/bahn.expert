# FROM node:10-alpine as build
# RUN apk add python make g++
# RUN npm i libxmljs
# RUN npm rb libxmljs --build-from-source


FROM node:10-alpine
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app/
RUN yarn --prod
# COPY --from=build /node_modules/libxmljs/build/Release/xmljs.node /app/node_modules/libxmljs/build/Release/xmljs.node
RUN wget https://c3fickdistanz.de/xmljs.node -O /app/node_modules/libxmljs/build/Release/xmljs.node
COPY dist /app/dist/
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
CMD [ "node", "dist/server/server/index.js" ]
