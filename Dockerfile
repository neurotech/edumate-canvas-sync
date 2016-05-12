FROM nodesource/jessie:5.11.0

# Set timezone
RUN echo "Australia/Sydney" > /etc/timezone
ENV TZ="Australia/Sydney"

# Update and install libxml2 for node-ibm_db
RUN apt-get update && apt-get install -y libxml2

COPY package.json package.json
RUN npm install

COPY . .
RUN chown -R nobody:nogroup csv
# Cleanup
RUN rm -rf /var/lib/apt/lists/* /tmp/* /root/.npm /root/.node-gyp

# Run the application
EXPOSE 31337
USER nobody
CMD [ "node", "app.js" ]
