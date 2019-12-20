FROM node:13-alpine as build
RUN mkdir -p /app
WORKDIR /app
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json yarn.lock /app/
RUN yarn --frozen-lockfile
ENV NODE_ENV=production
ENV PROD_ONLY=true
COPY src  /app/src/
COPY public /app/public/
COPY scripts /app/scripts/
COPY webpack.config.js version.js .babelrc.js .babelrc.server.js /app/
RUN yarn build
RUN node scripts/checkAssetFiles.js


FROM node:13-alpine as app
RUN yarn global add modclean
RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn --prod --frozen-lockfile
RUN modclean -r -a '*.ts|*.tsx' -I 'example*'
COPY docs /app/docs/
COPY --from=build /app/dist/ /app/dist/

FROM node:13-alpine
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
USER node
WORKDIR /app
COPY --from=app /app /app
CMD [ "node", "dist/server/server/index.js" ]
