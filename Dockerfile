FROM --platform=$BUILDPLATFORM node:22-alpine AS base
ENV COREPACK_INTEGRITY_KEYS=0
RUN corepack enable
WORKDIR /app
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

FROM base AS build
RUN pnpm i --frozen-lockfile
COPY src/ ./src/
COPY public/ ./public
COPY app.config.ts tsconfig.json ./
ENV NODE_ENV=production
RUN pnpm build

FROM base AS cleaned-deps
RUN pnpm i --production --frozen-lockfile
RUN rm package.json
RUN pnpm dlx modclean -r -f -a '*.ts|*.tsx' -I 'example*'


FROM node:22-alpine
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
ENV PORT=9042
WORKDIR /app
COPY package.json pnpm-lock.yaml /app/
COPY patches/ /app/patches
COPY --from=cleaned-deps /app/node_modules/ /app/node_modules/
RUN corepack enable && npm_config_update_binary=true pnpm rb
RUN pnpm add libxmljs2
COPY --from=build /app/.output/ /app/.output
RUN rm -rf /app/.output/server/node_modules/libxmljs2
USER node
CMD [ "pnpm", "vinxi",  "start" ]
