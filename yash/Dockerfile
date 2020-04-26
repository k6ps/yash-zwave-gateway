FROM balenalib/raspberry-pi2-alpine-node:13.1-edge

WORKDIR /usr/src/app
COPY . ./
ENV INITSYSTEM on

# Install dependencies
RUN sh ./dependencies.sh

# Install node-openzwave-shared
RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*
#RUN cd /usr/src/app && npm install openzwave-shared

# Run node.js
CMD node ./index.js
