FROM alpine:3.10.2

ENV BASE_URL="https://get.helm.sh"

ENV HELM_3_FILE="helm-v3.4.2-linux-amd64.tar.gz"

RUN apk add --no-cache ca-certificates \
  --repository http://dl-3.alpinelinux.org/alpine/edge/community/ \
  jq curl bash nodejs aws-cli && \
  # Install helm version 3:
  curl -L ${BASE_URL}/${HELM_3_FILE} |tar xvz && \
  mv linux-amd64/helm /usr/bin/helm3 && \
  chmod +x /usr/bin/helm3 && \
  rm -rf linux-amd64

ENV PYTHONPATH "/usr/lib/python3.8/site-packages/"

COPY . /usr/src/
ENTRYPOINT ["node", "/usr/src/index.js"]
