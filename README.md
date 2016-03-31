# edumate-canvas-sync

:link: A Node.js application that synchronises multiple datasets from Edumate to Canvas on a schedule in a modular fashion.

## Installation

### Prerequisites

`edumate-canvas-sync` requires Docker version `>= 1.9` as it uses Docker's networking feature: [https://blog.docker.com/2015/11/docker-multi-host-networking-ga/](https://blog.docker.com/2015/11/docker-multi-host-networking-ga/)

#### Environment Variables

Variable            | Value
--------------------|------
`CANVAS_API_KEY`    | The API key for the user that has SIS Import permission.
`CANVAS_API_DOMAIN` | Your Canvas URL i.e. `organisation.instructure.com`
`EDUMATE_HOST`      | Your Edumate hostname i.e. `edumate.organisation.com.au`
`EDUMATE_PORT`      | DB2 port i.e. `50001`
`EDUMATE_PATH`      | DB2 suffix i.e. `ORGANISATION`
`EDUMATE_USERNAME`  | DB2 username
`EDUMATE_PASSWORD`  | DB2 password


### Automatic

```shell
git clone https://github.com/neurotech/edumate-canvas-sync && cd edumate-canvas-sync && ./build.sh && ./run.sh
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

Check for the presence of `<network>` and create it if it doesn't exist, then run the docker container.

```shell
./run.sh <network>
```

---

## TODO

 - Commit SQL statements that formed the VIEWs that `datasets.js` references to repo
