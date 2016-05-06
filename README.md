# edumate-canvas-sync

:link: A Node.js application that synchronises multiple datasets from Edumate to Canvas on a schedule in a modular fashion.

## Installation

### Prerequisites

`edumate-canvas-sync` requires Docker version `>= 1.9` as it uses Docker's networking feature: [https://blog.docker.com/2015/11/docker-multi-host-networking-ga/](https://blog.docker.com/2015/11/docker-multi-host-networking-ga/)

`edumate-canvas-sync` uses the `rollbar-relay` to log it's events to [Rollbar](https://rollbar.com/). This module requires the `ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN` environment variable to be set. This token is listed in your [Rollbar](https://rollbar.com/) project's settings under *Project Access Tokens*.

#### Environment Variables

Variable                                | Value
----------------------------------------|------
`CANVAS_API_KEY`                        | The API key for the user that has SIS Import permission.
`CANVAS_API_DOMAIN`                     | Your Canvas URL i.e. `organisation.instructure.com`
`EDUMATE_HOST`                          | Your Edumate hostname i.e. `edumate.organisation.com.au`
`EDUMATE_PORT`                          | DB2 port i.e. `50001`
`EDUMATE_PATH`                          | DB2 suffix i.e. `ORGANISATION`
`EDUMATE_USERNAME`                      | DB2 username
`EDUMATE_PASSWORD`                      | DB2 password
`ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN` | [Rollbar](https://rollbar.com/) project token


### Automatic

```shell
git clone https://github.com/neurotech/edumate-canvas-sync && \
  cd edumate-canvas-sync && \
  ./build.sh && \
  ./run.sh <NETWORK>
```

### Manual

#### Clone

Clone this repository to your host using `git`.

```shell
git clone https://github.com/neurotech/edumate-canvas-sync
```

#### Customise

Adjust the schedule values in `./datasets.js` if needed.

#### Build

Build the docker image defined in `./Dockerfile`.

```shell
./build.sh
```

#### Run

Check for the presence of `<NETWORK>` and create it if it doesn't exist, then run the docker container.

```shell
./run.sh <NETWORK>
```

---

## TODO

 - Add support for manually running specific datasets on-demand via HTTP request with optional Slack messaging support i.e.
   1. A request is received: `GET /sync/sub-accounts`
   - Run the appropriate dataset
   - Optionally return some sort of status message:
     - Get ID of the returned SIS Import
     - Poll `sis_imports/{id}` every `n` seconds
     - When status = completed, return success
     - When status = error, return error

## DONE

  - Added support for logging events to Rollbar.
  - Commit SQL statements that formed the VIEWs that `datasets.js` references to repo
