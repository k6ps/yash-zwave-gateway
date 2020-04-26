#!/usr/bin/env bash

# Required by OpenZWave
echo "== Installing libudev-dev... =="
sudo apt-get update && \
sudo apt-get install -y apt-utils libudev-dev libudev0
echo "== Done installing libudev-dev. =="

# install OpenZWave
echo "== Installing OpenZWave ... =="
# sudo mkdir -p /usr/local/lib64 && \
git clone https://github.com/OpenZWave/open-zwave.git && \
cd ./open-zwave && \
sudo make && \
sudo make install && \
rm -R ~/.node-gyp
# wget http://mirror.my-ho.st/Downloads/OpenZWave/Debian_8.0/amd64/openzwave_1.4.164_amd64.deb
# wget http://mirror.my-ho.st/Downloads/OpenZWave/Debian_8.0/amd64/libopenzwave1.3-dev_1.4.164_amd64.deb
# wget http://mirror.my-ho.st/Downloads/OpenZWave/Debian_8.0/amd64/libopenzwave1.3_1.4.164_amd64.deb
# sudo dpkg -i *openzwave*.deb
echo "== Done installing OpenZWave. =="