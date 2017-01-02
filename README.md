# YASH Z-Wave Gateway

There is nothing here yet.

I intend to build a gateway for converting and/or exchanging messages between Z-Wave network and networks using other technologies, for use with my amateur smart home projects. Since i have some Z-Wave devices, as well as non-Z-Wave devices, i'd like then to talk to the same message queues and use common message format. 

I'm planning to implement it using the following hardware and software components:
* either a Raspberry Pi (i have a few different models) or an old x86 PC
* [Aeotec Z-Stick](http://aeotec.com/z-wave-usb-stick "Aeotec Z-Stick") Z-Wave USB Stick
* Docker, since i'm not sure which hardware i'm going to use, and i want the deployment and configuration to be as automatic as possible. Maybe i'll also use resin.io for cloud-based deployment automation.
* [OpenZWave](http://www.openzwave.com/ "OpenZWave")
* Some messaging system, not yet sure which one to use. Maybe XMPP, maybe MQTT, maybe some cloud-based solution. So far i only have point-to-point connections. 

By the way, YASH just means "Yet Another Smart Home".
