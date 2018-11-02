#!/usr/bin/env ash
# shellcheck shell=bash
# shellcheck disable=SC2169
apk update  && apk add --no-cache curl
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl && mv ./kubectl /usr/local/bin/kubectl
kubectl config set-cluster gitlab-deploy --server="$KUBE_URL"
kubectl config set-credentials gitlab-deploy --token="$KUBE_TOKEN"
kubectl config set-context gitlab-deploy --cluster=gitlab-deploy --user=gitlab-deploy --namespace=marudor
kubectl config use-context gitlab-deploy
kubectl --insecure-skip-tls-verify set image "deployment.apps/bahnhofsabfahrten$2" "bahnhofsabfahrten$2=registry.gitlab.com/marudor/bahnhofsabfahrten/client:$1"
kubectl --insecure-skip-tls-verify label "deployment.apps/bahnhofsabfahrten$2" project="$CI_PROJECT_PATH_SLUG" type=client --overwrite
kubectl --insecure-skip-tls-verify set image "deployment.apps/bahnhofsabfahrtenserver$2" "bahnhofsabfahrtenserver$2=registry.gitlab.com/marudor/bahnhofsabfahrten/server:$1"
kubectl --insecure-skip-tls-verify label "deployment.apps/bahnhofsabfahrtenserver$2" project="$CI_PROJECT_PATH_SLUG" type=server --overwrite
