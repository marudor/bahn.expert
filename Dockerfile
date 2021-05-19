FROM node:16-alpine as base
WORKDIR /app
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
COPY packages/ ./packages/
COPY scripts/ ./scripts/

FROM base as fulldeps
RUN yarn --immutable --immutable-cache


FROM fulldeps as build

COPY webpack.config.js babel.config.js ./
COPY .git ./.git
ENV NODE_ENV=production
RUN yarn all:build
RUN yarn dlx modclean -r -f -a '*.ts|*.tsx' -I 'example*'
RUN node scripts/checkAssetFiles.js

FROM base as cleanedDeps
RUN yarn workspaces focus --production
RUN yarn dlx modclean -r -f -a '*.ts|*.tsx' -I 'example*'

FROM node:16-alpine
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
WORKDIR /app
COPY public/ ./dist/client/
COPY --from=cleanedDeps /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/packages/ ./packages/
USER node
CMD [ "node", "packages/server/index.js" ]
