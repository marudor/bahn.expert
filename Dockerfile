FROM node:14-alpine as deps
WORKDIR /app
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json yarn.lock .yarnrc.yml /app/
COPY .yarn /app/.yarn
RUN yarn --immutable --immutable-cache


FROM node:14-alpine as build
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT

RUN mkdir -p /app
WORKDIR /app
COPY .git package.json yarn.lock /app/
COPY --from=deps /app/node_modules/ /app/node_modules/
ENV NODE_ENV=production
ENV PROD_ONLY=true
COPY src  /app/src/
COPY scripts /app/scripts/
COPY webpack.config.js .babelrc.js .babelrc.server.js /app/
RUN yarn build
RUN node scripts/checkAssetFiles.js


FROM node:14-alpine as cleanedDeps
RUN yarn global add modclean
RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock /app/
COPY --from=deps /app/node_modules/ /app/node_modules/
RUN npm prune --prod
RUN modclean -r -a '*.ts|*.tsx' -I 'example*'

FROM node:14-alpine
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
USER node
WORKDIR /app
COPY docs /app/docs
COPY public /app/public/
COPY --from=cleanedDeps /app/node_modules/ /app/node_modules/
COPY --from=build /app/dist/ /app/dist/
CMD [ "node", "dist/server/server/index.js" ]
