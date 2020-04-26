#!/bin/sh

# Required by OpenZWave
echo "== Installing libudev-dev... =="
apt-get update && apt-get install -y apt-utils libudev-dev
echo "== Done installing libudev-dev. =="

# install OpenZWave 
echo "== Installing OpenZWave ... =="
git clone https://github.com/OpenZWave/open-zwave.git && \
cd ./open-zwave && \
make && \
make install
echo "== Done installing OpenZWave. =="

