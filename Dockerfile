FROM node:10-alpine
# RUN mkdir -p /app
# WORKDIR /app
COPY package.json yarn.lock dist /
# COPY yarn.lock /app/
RUN yarn --prod
# COPY dist /app/dist/
ENV NODE_ENV=production
ENV TZ=Europe/Berlin
CMD [ "node", "/server/server/index.js" ]
