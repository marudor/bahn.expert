#!/usr/bin/env sh
echo "http://localhost:9043 for docs"
docker run -e SPEC_URL=/swagger.json -v "$(pwd)/public/swagger.json:/usr/share/nginx/html/swagger.json" -p 9043:80 redocly/redoc
