var mosca = require('mosca');

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var settings = {
  port: 1883,
  backend : ascoltatore
};

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  var s = '';
  if(client)  s = '   this is from client';
  console.log('Published', packet.payload.toString(), s);

});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');

  var message = {
    topic: 'MQTTExample/LED',
    payload: '0', // or a Buffer
    qos: 0, // 0, 1, or 2
    retain: false // or true
  };

  //setInterval( function(){
    server.publish(message, function() { });
  //}, 3000);
}