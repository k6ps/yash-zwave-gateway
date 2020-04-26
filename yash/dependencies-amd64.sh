#!/usr/bin/env bash

# Required by OpenZWave
echo "== Installing libudev-dev... =="
sudo apt-get update && \
sudo apt-get install -y apt-utils libudev-dev
echo "== Done installing libudev-dev. =="

# install OpenZWave
echo "== Installing OpenZWave ... =="
git clone https://github.com/OpenZWave/open-zwave.git && \
cd ./open-zwave && \
sudo make && \
sudo make install
echo "== Done installing OpenZWave. =="