#!/bin/bash

# Check if an environment argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 {dev|prod}"
  exit 1
fi

# Determine which environment to remove
if [ "$1" == "dev" ]; then
  echo "Removing development environment..."
  docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v
elif [ "$1" == "prod" ]; then
  echo "Removing production environment..."
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v
else
  echo "Invalid environment specified. Usage: $0 {dev|prod}"
  exit 1
fi