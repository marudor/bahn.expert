#!/bin/bash

set -e

for f in $(find tests/charts/ -mindepth 1 -type d); do
  echo ""
  echo "Test $f"
  helm lint charts/app --strict --values $f/values.yml
  helm template --name $(basename $f) --values $f/values.yml charts/app > $f/actual.yml
  diff $f/actual.yml $f/expected.yml
done
