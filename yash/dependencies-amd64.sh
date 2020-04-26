#!/usr/bin/env bash

# Required by OpenZWave
echo "== Installing libudev-dev... =="
apt-get install -y libudev-dev
echo "== Done installing libudev-dev. =="

# install OpenZWave
echo "== Installing OpenZWave ... =="
git clone https://github.com/OpenZWave/open-zwave.git && \
cd ./open-zwave && \
sudo make && \
sudo make install && \
sudo ldconfig
echo "== Done installing OpenZWave. =="
