#!/bin/sh

DOCKER_NETWORK=$1

if [ -n "$DOCKER_NETWORK" ]; then
  # Check for existing Docker network and create it if missing.
  if docker network ls | grep -q $DOCKER_NETWORK 2>/dev/null; then
    echo "Docker network: \"$DOCKER_NETWORK\" exists. Continuing."
  else
    echo "Creating Docker network: \"$DOCKER_NETWORK\""
    sleep 2s
    docker network create --driver bridge $DOCKER_NETWORK
  fi

  # Run container
  echo "Running the edumate-canvas-sync container."
  sleep 0.5s
  docker run \
    --name edumate-canvas-sync \
    --net=$DOCKER_NETWORK \
    --log-driver=json-file \
    --log-opt max-size=50m \
    --log-opt max-file=4 \
    --restart=on-failure:5 \
    --memory "250M" \
    -e CANVAS_API_KEY=$CANVAS_API_KEY \
    -e CANVAS_API_DOMAIN=$CANVAS_API_DOMAIN \
    -e EDUMATE_HOST=$EDUMATE_HOST \
    -e EDUMATE_PORT=$EDUMATE_PORT \
    -e EDUMATE_PATH=$EDUMATE_PATH \
    -e EDUMATE_USERNAME=$EDUMATE_USERNAME \
    -e EDUMATE_PASSWORD=$EDUMATE_PASSWORD \
    -d edumate-canvas-sync

else
  echo "Missing Docker network argument! Please re-run this script with an argument that represents your desired network name."
  sleep 0.3s
  echo "i.e. $ ./run.sh edumate-canvas-sync"
  sleep 0.3s
  echo "Exiting."
  sleep 0.3s
  exit 1
fi
