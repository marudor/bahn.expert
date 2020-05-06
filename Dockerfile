FROM node:14-alpine as deps
WORKDIR /app
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
COPY packages/ ./packages/
RUN yarn --immutable --immutable-cache


FROM deps as build
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT

COPY .git webpack.config.js babel.config.js ./
COPY src/ ./src/
COPY scripts/ ./scripts/
RUN rm -rf packages/test-helper
ENV NODE_ENV=production
ENV PROD_ONLY=true
RUN yarn all:build
RUN node scripts/checkAssetFiles.js


FROM deps as cleanedDeps
# Ugly hack...
RUN mv node_modules/types .
RUN mv node_modules/shared .
RUN rm node_modules/test-helper
RUN npm prune --prod
RUN mv types node_modules/
RUN mv shared node_modules/
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
CMD [ "node", "dist/server/server/index.js" ]
