FROM node:10
RUN mkdir -p /app
WORKDIR /app
COPY dist /app/dist/
COPY package.json /app
COPY yarn.lock /app/
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
RUN yarn --prod
CMD [ "node", "dist/server/server/index.js" ]
