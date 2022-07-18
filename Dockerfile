FROM node:18-alpine as base
WORKDIR /app
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
COPY src/ ./src/
COPY scripts/ ./scripts/

FROM base as build
RUN yarn --immutable --immutable-cache
COPY webpack.config.js babel.config.cjs ./
ENV NODE_ENV=production
RUN yarn build
RUN yarn dlx modclean -r -f -a '*.ts|*.tsx' -I 'example*'
RUN node scripts/checkAssetFiles.js

FROM base as cleanedDeps
RUN yarn workspaces focus --production
RUN yarn dlx modclean -r -f -a '*.ts|*.tsx' -I 'example*'

FROM node:18-alpine
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
WORKDIR /app
COPY public/ ./dist/client/
COPY --from=cleanedDeps /app/node_modules/ ./node_modules/
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/src/ ./src/
USER node
CMD [ "node", "src/server/index.js" ]
