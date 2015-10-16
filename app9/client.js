var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://10.32.200.189');
var flag = '0';

client.on('connect', function () {
  client.subscribe('MQTTExample/LED');
  startLoop();
});
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());
  //client.end();
});

function startLoop(){
	setInterval(function(){
		client.publish('MQTTExample/LED', flag);
		flag = flag === '0' ? '1' : '0';
	}, 1000);
}
