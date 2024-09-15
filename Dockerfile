FROM --platform=$BUILDPLATFORM node:22-alpine as base
RUN corepack enable
WORKDIR /app
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

FROM base as build
RUN pnpm i --frozen-lockfile
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY webpack.config.cjs .swcrc ./
ENV NODE_ENV=production
RUN pnpm build
# npx instead of
RUN npx modclean -r -f -a '*.ts|*.tsx' -I 'example*'
RUN node scripts/checkAssetFiles.js

FROM base as cleanedDeps
RUN pnpm i --production --frozen-lockfile
RUN rm package.json
RUN pnpm dlx modclean -r -f -a '*.ts|*.tsx' -I 'example*'

FROM node:22-alpine
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
WORKDIR /app
COPY public/ ./dist/client/
COPY --from=cleanedDeps /app/node_modules/ ./node_modules/
COPY package.json pnpm-lock.yaml /app/
RUN corepack enable && npm_config_update_binary=true pnpm rb
COPY --from=build /app/dist/ ./dist/
USER node
CMD [ "node", "dist/server/server/index.js" ]
