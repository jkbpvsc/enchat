$(document).ready(() => {
  $('#message').on('keydown', (e) => {
    if (!e) { e = window.event; }
    if (e.keyCode === 13) { sendMessage(); }
  })
});
var socket = io.connect();
var key = "";

function processOutgoingMessae(message) {
  if (key === "") {
    return message
  }

  return CryptoJS.AES.encrypt(message, key).toString()
}

function verifyDecryption(check) {
  var nums = check.split(',').map(str => Number.parseInt(str));
  if (!isNaN(nums[0]) && !isNaN(nums[1])){
    return nums[0] + nums[1] === 0;
  }

  return false
}

function processIncomingMessage(data) {
  if (key === "") {
    return data.message;
  }

  //Check if already decrypted
  if (verifyDecryption(data.en_check)) {
    return data.message;
  }

  //Check if key is correct
  if (!verifyDecryption(CryptoJS.AES.decrypt(data.en_check, key).toString(CryptoJS.enc.Utf8))) {
    return data.message;
  }

  return CryptoJS.AES.decrypt(data.message, key).toString(CryptoJS.enc.Utf8);
}

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
    + (systemMessage ? 'client//: ' : data.author + '//: ')
    + (systemMessage ? data : processIncomingMessage(data))
    + '</div><div>'
    + getTimeString()
    + '</div></div>'
  );

  display.append(message);
}


function getRoom() {
  var splitname = location.pathname.split('/');
  var splitRoom = splitname[splitname.length - 1].split('#');

  if (window.location.hash.length > 1) {
    setKey(window.location.hash.replace('#', ''));
  }

  return splitRoom[0];
}

function connectToRoom() {
  var room = getRoom();
  displayMessage('Connecting to room ' + room);

  socket.emit('room', { room: room });

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

  socket.emit('message', { message: processOutgoingMessae(value), en_check: processOutgoingMessae("0,0") });
}

function setKey(aeskey) {
  key = aeskey;
  displayMessage("Setting AES key: " + key/*.replace(/./g, '*')*/);
  window.location.hash = '#' + aeskey;
}

function command(instruction) {
  var parts = instruction.split(' ');
  switch (parts[0]) {
    case '/clear':
      $('.chat-window').empty();
      break;

    case '/key':
      setKey(parts[1] || CryptoJS.SHA1(Date.now().toString()).toString())
      break;

    case '/link':
      //displayMessage(window.location.pathname + '#' + key);

    default:
      socket.emit(parts[0].replace('/', ''), parts[1]);
  }
}

init();