#!/bin/bash

# Usage: tag-update 1.0.0

sed -i 's/"version": "[^"]*"/"version": "'"$1"'"/' manifest.json
npm pkg set version=$1
git add package.json
git add manifest.json
git commit -m "chore: bump version to $1"
git push
git tag -a $1 -m "$1"
git push origin $1
