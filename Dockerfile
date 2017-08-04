# Use Debian jessie 8.9 as a base
FROM debian:8.9

# Set desired Node.js version
ARG NODE_VERSION=6.11.2

# Set timezone
RUN echo "Australia/Sydney" > /etc/timezone
ENV TZ="Australia/Sydney"

# Update sources, upgrade existing dependencies, then install required dependencies
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    apt-get -y upgrade && \
    DEBIAN_FRONTEND=noninteractive apt-get install \
    --no-install-recommends -y \
    build-essential \
    libxml2 \
    wget \
    rsync \
    ca-certificates \
    unattended-upgrades && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Add apt configuration items
ADD docker/20auto-upgrades /etc/apt/apt.conf.d/
ADD docker/50unattended-upgrades /etc/apt/apt.conf.d/

# Allow writing for me, reading for everyone else
RUN chmod 644 /etc/apt/apt.conf.d/20auto-upgrades
RUN chmod 644 /etc/apt/apt.conf.d/50unattended-upgrades

# Install node based on NODE_VERSION
RUN cd /tmp && wget -q https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz && \
    cd /tmp && mkdir node && tar -xf /tmp/node-v${NODE_VERSION}-linux-x64.tar.gz -C node --strip-components 1 && rsync -a /tmp/node/* /usr && \
    rm /tmp/node-v${NODE_VERSION}-linux-x64.tar.gz && rm -Rf /tmp/node

# Install dependencies
COPY package.json package.json
RUN npm install && rm -rf /root/.npm /root/.node-gyp

# Copy application source code
COPY . .

# Set ownership of ./csv to nobody:nogroup
RUN chown -R nobody:nogroup csv

# Run the application
USER nobody
CMD [ "node", "app.js" ]
