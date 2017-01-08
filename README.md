# YASH Z-Wave Gateway

There is nothing interesting here yet, just a node-openzwave-shared installation and test.

I intend to build a gateway for converting and/or exchanging messages between Z-Wave network and networks using other technologies, for use with my amateur smart home projects. Since i have some Z-Wave devices, as well as non-Z-Wave devices, i'd like then to talk to the same message queues and use common message format. 

I'm planning to implement it using the following hardware and software components:
* A [Raspberry Pi 2 Model B](https://www.raspberrypi.org/products/raspberry-pi-2-model-b/ "Raspberry Pi 2 Model B")
* [Aeotec Z-Stick](http://aeotec.com/z-wave-usb-stick "Aeotec Z-Stick") Z-Wave USB Stick
* [Docker](https://www.docker.com/ "Docker"), since i want the deployment and configuration to be as automatic as possible. Also i'm using [resin.io](https://resin.io/ "resin.io") for cloud-based deployment automation.
* [OpenZWave](http://www.openzwave.com/ "OpenZWave")
* [node.js](https://nodejs.org "node.js") and [node-openzwave-shared](https://github.com/OpenZWave/node-openzwave-shared "node-openzwave-shared"). This is my very first node.js project. I am a Java developer with only a little old-school JavaScript experience. So, please let me know (open an issue or submit a pull request) if you are more experienced node.js developer and notice that i'm doing something stupid here :) 
* Ultimately, i'm planning to use [Apache Kafka](https://kafka.apache.org "Apache Kafka") event bus for all enevts in my "smart" (and also "vulnerable", according to [Hyppönen's Law](https://twitter.com/mikko/status/808291670072717312 "Hyppönen's Law")) home, but i'm starting with [Twitter](https://dev.twitter.com "Twitter") for now  (remember the original [house that tweets](http://www.telegraph.co.uk/news/science/science-news/6156291/The-house-that-Twitters.html "house that tweets")?). 

By the way, YASH just means "Yet Another Smart Home".
