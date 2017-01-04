FROM resin/raspberrypi2-node:5.7-slim

# Install dependencies
RUN sh ./dependencies.sh

# Create application directory
RUN mkdir -p /app/yash-zwave-gateway

# Install node-openzwave-shared
RUN cd /app/yash-zwave-gateway
RUN npm install openzwave-shared

# Test
RUN mkdir -p /app/openzwave-shared-test
RUN wget -P /app/openzwave-shared-test https://raw.githubusercontent.com/OpenZWave/node-openzwave-shared/master/test2.js
CMD node /app/openzwave-shared-test/test2.js