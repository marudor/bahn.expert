FROM node:10-alpine as build
RUN yarn global add modclean
RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn --prod
RUN modclean -r -a '*.ts|*.tsx'
COPY dist /app/dist/

FROM node:10-alpine
COPY --from=build /app /app
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
USER node
WORKDIR /app
CMD [ "node", "dist/server/server/index.js" ]
