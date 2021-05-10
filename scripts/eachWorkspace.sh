#!/usr/bin/env sh

trap "exit" INT TERM

for d in packages/* ; do
  echo "$d"
  yarn workspace "$(basename "$d")" run "$@" && echo 'OK' || exit
done
