FROM node:14-alpine as deps
WORKDIR /app
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
COPY packages/ ./packages/
RUN yarn --immutable --immutable-cache


FROM node:14-alpine as build
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT

RUN mkdir -p /app
WORKDIR /app
COPY .git package.json yarn.lock .yarnrc.yml webpack.config.js babel.config.js ./
COPY .yarn/ ./.yarn/
COPY --from=deps /app/node_modules/ /app/node_modules/
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY packages/ ./packages/
ENV NODE_ENV=production
ENV PROD_ONLY=true
RUN yarn all:build
RUN node scripts/checkAssetFiles.js


FROM node:14-alpine as cleanedDeps
RUN yarn global add modclean
RUN mkdir -p /app
WORKDIR /app
COPY package.json yarn.lock /app/
COPY --from=deps /app/node_modules/ /app/node_modules/
# Ugly hack...
RUN mv node_modules/types .
RUN mv node_modules/shared .
RUN npm prune --prod
RUN mv types node_modules/
RUN mv shared node_modules/
RUN modclean -r -a '*.ts|*.tsx' -I 'example*'

FROM node:14-alpine
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
WORKDIR /app
COPY docs /app/docs
COPY --from=cleanedDeps /app/node_modules/ /app/node_modules/
COPY --from=build /app/dist/ /app/dist/
COPY --from=build /app/packages/ /app/packages/
COPY public/ /app/dist/client/
USER node
CMD [ "node", "dist/server/server/index.js" ]
