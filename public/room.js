$(document).ready(() => {
  $('#message').on('keydown', (e) => {
    if (!e) { e = window.event; }
    if (e.keyCode === 13) { sendMessage(); }
  })
});
var socket = io.connect();

function init() {
  socket.on('connect', function () {
    connectToRoom();
  });

  socket.on('message', displayMessage)
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function getTimeString() {
  var today = new Date();
  var h = checkTime(today.getHours());
  var m = checkTime(today.getMinutes());
  var s = checkTime(today.getSeconds());
  return h + ":" + m + ":" + s;
}

function displayMessage(data) {

  var systemMessage = typeof data === 'string';

  var display = $('.chat-window');
  var message = $(
    '<div class="message"><div>'
    + (systemMessage ? 'system//: ' : data.author + '//: ')
    + (systemMessage ? data : data.message)
    + '</div><div>'
    + getTimeString()
    + '</div></div>'
  );

  display.append(message);
}

function setKey() {

}

function getRoom() {
  var splitname = location.pathname.split('/');
  var splitRoom = splitname[splitname.length - 1].split('#');
  if (splitRoom.length > 1) {
    setKey(splitRoom[1]);
  }

  return splitRoom[0];
}

function connectToRoom() {
  var room = getRoom();
  displayMessage('Connecting to room ' + room);

  socket.emit('room', { room: getRoom() });

  socket.on('meta', (data) => {
    console.log(data);
    displayMessage('Connection established');
    displayMessage(data.connections + ' users online');
  })
}

function sendMessage() {
  var text = $('#message');

  var value = text.val().trim();

  text.val('');
  if (/^\/.*/.test(value)) {
    return command(value);
  }

  socket.emit('message', { message: value });
}

function command(instruction) {
  var parts = instruction.split(' ');
  switch (parts[0]) {
    case '/clear':
      $('.chat-window').empty();
      break;
    default:
      socket.emit(parts[0].replace('/', ''), parts[1]);
  }
}

init();