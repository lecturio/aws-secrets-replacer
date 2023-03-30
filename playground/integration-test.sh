#!/bin/sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
DOCKER_CONTAINER=aws-secrets-replacer

# empty the replacements dir
rm -r $SCRIPT_DIR/replacements/* 2>/dev/null 

# copy the test files to the "dirty" directory
cp -pR $SCRIPT_DIR/originals/* $SCRIPT_DIR/replacements/

# run the docker container
docker run --rm \
  --env AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  --env AWS_SECRET_ACCESS_KEY=$AWS_ACCESS_KEY_ID \
  --env AWS_REGION=$AWS_REGION \
  -v $SCRIPT_DIR/replacements:/app/target \
  $DOCKER_CONTAINER /app/target