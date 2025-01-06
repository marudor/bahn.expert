FROM --platform=$BUILDPLATFORM node:22-alpine AS base
RUN corepack enable
WORKDIR /app
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

FROM base AS build
RUN pnpm i --frozen-lockfile
COPY src/ ./src/
COPY app.config.ts tsconfig.json ./
ENV NODE_ENV=production
RUN pnpm build


FROM node:22-alpine
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
WORKDIR /app
COPY package.json pnpm-lock.yaml /app/
RUN corepack enable && npm_config_update_binary=true pnpm rb
COPY --from=build /app/.output/ ./.output
USER node
CMD [ "node", ".output/server/index.mjs" ]
