FROM node:12-alpine as build
RUN yarn global add modclean
RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn --prod
RUN modclean -r -a '*.ts|*.tsx'
COPY dist /app/dist/
COPY scripts /app/scripts/
RUN node scripts/checkAssetFiles.js

FROM node:12-alpine
COPY --from=build /app /app
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
USER node
WORKDIR /app
CMD [ "node", "dist/server/server/index.js" ]
