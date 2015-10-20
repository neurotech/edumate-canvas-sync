FROM nodesource/jessie:4.2.0
MAINTAINER Tim Douglas <neurotech@gmail.com>

# Set timezone
RUN echo "Australia/Sydney" > /etc/timezone
ENV TZ="Australia/Sydney"

# Expose port for /status endpoint
EXPOSE 5544

# Update and install libxml2 for node-ibm_db
RUN apt-get update && apt-get install -y libxml2

# Clone repo and install dependencies
WORKDIR /src
RUN git clone https://github.com/neurotech/edumate-canvas-sync.git .
RUN npm install --unsafe-perm
RUN mkdir csv

# Cleanup
RUN rm -rf /var/lib/apt/lists/* /tmp/* /root/.npm /root/.node-gyp

# Run the application
CMD [ "node", "app.js" ]