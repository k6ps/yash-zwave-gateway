FROM resin/raspberrypi2-node:7.0

WORKDIR /usr/src/app
COPY . ./

# Install dependencies
RUN sh ./dependencies.sh

# Create application directory
# RUN mkdir -p /usr/src/app/yash-zwave-gateway

# Install node-openzwave-shared
#RUN cd /usr/src/app/yash-zwave-gateway
RUN npm install openzwave-shared

# Test
#RUN mkdir -p /usr/src/app/openzwave-shared-test
RUN wget -P /usr/src/app https://raw.githubusercontent.com/OpenZWave/node-openzwave-shared/master/test2.js
CMD node test2.js