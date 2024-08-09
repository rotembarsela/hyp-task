#!/bin/bash

if [ "$1" == "dev" ]; then
  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
elif [ "$1" == "prod" ]; then
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
else
  echo "Usage: $0 {dev|prod}"
fi