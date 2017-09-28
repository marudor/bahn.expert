FROM nginx
COPY dist /usr/share/nginx/html
COPY abfahrten.conf /etc/nginx/conf.d/default.conf
