envsubst < /etc/nginx/conf.d/abfahrten.template > /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'
