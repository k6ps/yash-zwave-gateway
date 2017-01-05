FROM resin/raspberrypi2-node:7.0

WORKDIR /usr/src/app
COPY . ./
ENV INITSYSTEM on

# Install dependencies
RUN sh ./dependencies.sh

# Create application directory
# RUN mkdir -p /usr/src/app/yash-zwave-gateway

# Install node-openzwave-shared
RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*
RUN cd /usr/src/app && npm install openzwave-shared

# Test
#RUN mkdir -p /usr/src/app/openzwave-shared-test
#RUN wget -P /usr/src/app https://raw.githubusercontent.com/OpenZWave/node-openzwave-shared/master/test2.js
CMD node ./node_modules/openzwave-shared/test2.js