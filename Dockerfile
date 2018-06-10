FROM node:10-alpine as build
WORKDIR /app
COPY .babelrc.js /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn
COPY src/ /app/src
COPY .eslintrc.js /app
COPY postcss.config.js /app
COPY webpack.config.js /app
ENV NODE_ENV production
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/abfahrten.conf /etc/nginx/conf.d/abfahrten.template
COPY docker/entry.sh /entry.sh
CMD ["/bin/sh", "/entry.sh"]
