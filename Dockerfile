FROM node:14-alpine as deps
WORKDIR /app
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
COPY packages/ ./packages/
COPY scripts/ ./scripts/
RUN yarn --immutable --immutable-cache


FROM deps as build
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT

COPY webpack.config.js babel.config.js ./
COPY .git ./.git
ENV NODE_ENV=production
RUN yarn all:build
RUN node scripts/checkAssetFiles.js

FROM deps as cleanedDeps
RUN yarn dlx modclean -r -a '*.ts|*.tsx' -I 'example*'

FROM node:14-alpine
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
WORKDIR /app
COPY docs ./docs
COPY public/ ./dist/client/
COPY --from=cleanedDeps /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/packages/ ./packages/
USER node
CMD [ "node", "packages/server/index.js" ]
