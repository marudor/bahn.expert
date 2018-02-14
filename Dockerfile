FROM node:8-alpine as build
WORKDIR /app
COPY .babelrc.js /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn
COPY src/ /app/src
COPY webpack.config.js /app
COPY .eslintrc.js /app
ENV NODE_ENV production
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY abfahrten.conf /etc/nginx/conf.d/abfahrten.template
