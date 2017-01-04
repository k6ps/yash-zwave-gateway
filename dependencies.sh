#!/bin/sh

# Required by OpenZWave
echo "== Installing libudev-dev... =="
apt-get update && apt-get install -y libudev-dev
echo "== Done installing libudev-dev. =="

# install OpenZWave 
echo "== Installing OpenZWave ... =="
wget "https://github.com/ekarak/openzwave-debs-raspbian/raw/master/v1.4.79/openzwave_1.4.79.gfaea7dd_armhf.deb"
wget "https://github.com/ekarak/openzwave-debs-raspbian/raw/master/v1.4.79/libopenzwave1.3_1.4.79.gfaea7dd_armhf.deb"
wget "https://github.com/ekarak/openzwave-debs-raspbian/raw/master/v1.4.79/libopenzwave1.3-dev_1.4.79.gfaea7dd_armhf.deb"
sudo dpkg -i *openzwave*.deb
echo "== Done installing OpenZWave. =="

