#!/usr/bin/env ash
# shellcheck shell=bash
# shellcheck disable=SC2169,SC1117
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl && mv ./kubectl /usr/local/bin/kubectl
kubectl config set-cluster gitlab-deploy --server="$KUBE_URL"
kubectl config set-credentials gitlab-deploy --token="$KUBE_TOKEN"
kubectl config set-context gitlab-deploy --cluster=gitlab-deploy --user=gitlab-deploy --namespace=marudor
kubectl config use-context gitlab-deploy

DEPLOYED_TAGS=$(kubectl --insecure-skip-tls-verify describe deployments -l project="$CI_PROJECT_PATH_SLUG" -l type="$1" | grep Image: | awk '{print $2}' | sed 's/.*://')


LOGIN="${GITLAB_USERNAME}:${GITLAB_TOKEN}"
AUTH_URL="https://gitlab.com/jwt/auth?client_id=docker&offline_token=true&service=container_registry&scope=repository:marudor/bahnhofsabfahrten/$1:*"
TOKEN=$(curl -s --user "$LOGIN" "$AUTH_URL" | jq -r '.token')
TAGS=$(curl -s -H "Authorization: Bearer $TOKEN" "https://registry.gitlab.com/v2/marudor/bahnhofsabfahrten/$1/tags/list" | jq -r '.tags')

current=$(node -e "console.log(Date.now())")
echo "$TAGS" | jq -r '.[]' | while read -r i; do
  if [[ "$i" == "latest" ]]; then
    continue
  fi
  if echo "$DEPLOYED_TAGS" | grep -q "\b$i\b"; then
    echo "Not removing $i. Still deployed"
    continue
  fi
  created=$(curl -s -H "Authorization: Bearer $TOKEN" "https://registry.gitlab.com/v2/marudor/bahnhofsabfahrten/$1/manifests/$i" | jq -r '.history[0].v1Compatibility' | jq -r '.created')
  ifOlderThan=$(node -e "console.log(new Date('$created').getTime() + 12096e5)")
  if [[ "$current" -gt "$ifOlderThan" ]]; then
    digest=$(curl -I -s -H "Accept: application/vnd.docker.distribution.manifest.v2+json" -H "Authorization: Bearer $TOKEN" "https://registry.gitlab.com/v2/marudor/bahnhofsabfahrten/$1/manifests/$i" | grep -Fi "Docker-Content-Digest" | sed 's/Docker-Content-Digest: //' | tr -d '[:space:]')
    curl -X "DELETE" -H "Authorization: Bearer $TOKEN" "https://registry.gitlab.com/v2/marudor/bahnhofsabfahrten/$1/manifests/$digest"
    echo "deleted image $i"
  fi
done
