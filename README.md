# YASH Z-Wave Gateway

There is nothing interesting here yet, just a node-openzwave-shared installation and test.

I intend to build a gateway for converting and/or exchanging messages between Z-Wave network and networks using other technologies, for use with my amateur smart home projects. Since i have some Z-Wave devices, as well as non-Z-Wave devices, i'd like then to talk to the same message queues and use common message format. 

I'm planning to implement it using the following hardware and software components:
* A [Raspberry Pi 2 Model B](https://www.raspberrypi.org/products/raspberry-pi-2-model-b/ "Raspberry Pi 2 Model B")
* [Aeotec Z-Stick](http://aeotec.com/z-wave-usb-stick "Aeotec Z-Stick") Z-Wave USB Stick
* [Docker](https://www.docker.com/ "Docker"), since i want the deployment and configuration to be as automatic as possible. Also i'm using [resin.io](https://resin.io/ "resin.io") for cloud-based deployment automation.
* [OpenZWave](http://www.openzwave.com/ "OpenZWave")
* [Apache Kafka](https://kafka.apache.org "Apache Kafka") event bus

By the way, YASH just means "Yet Another Smart Home".
