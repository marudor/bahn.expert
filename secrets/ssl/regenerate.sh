#!/usr/bin/env sh
secret=$(kubectl get secret marudor-de --namespace marudor -o json)
rawkey=$(echo $secret | jq -r ".data[\"tls.key\"]")
rawcert=$(echo $secret | jq -r ".data[\"tls.crt\"]")
echo $rawkey | base64 --decode > privkey.pem
echo $rawcert | base64 --decode > server.pem
