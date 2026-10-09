const socket = io();
const mainContainer = document.querySelector('#main-container');
const messages = [];
let lastTime = performance.now();
//target fields
let aliasInput = document.querySelector('#alias')
let colorPicker = document.querySelector('#favcolor')
let slider = document.querySelector('#speed-slider')
let txtMsgInput = document.querySelector('#txt-msg')
let submitBtn = document.querySelector('#submit-btn')

let userResponse = {
  alias: "",
  color: "",
  speed: 0,
  message: ""
};

let messageContainer = {
  text: "",
  posx: 0,
  posy: 0,
  speed: 0
};

const blockList = [
  "fuck",
  "shit",
  "bitch",
  "bastard",
  "damn",
  "hell",
  "crap",
  "ass",
  "arse",
  "bampot",
  "bollocks",
  "fucka",
  "cunt",
  "dick",
  "cock",
  "dumbass",
  "dipshit",
  "hoe",
  "slut",
  "jackass",
  "motherfucker",
  "whore"
]

const blockListRegex = new RegExp(`\\b(${blockList.join('|')})\\b`, 'i');

//listen for submit button and do something with the input
submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  socket.emit("submit-user-resp", {
    alias: aliasInput.value,
    color: colorPicker.value,
    speed: slider.value,
    message: txtMsgInput.value
  });
});

socket.on("user-resp", (data) => {
  console.log("Client received response from server: " + JSON.stringify(data));
  userResponse = data;
  // alert(userResponse.alias + " has joined");
  let currMessage = buildMessage(userResponse);
  console.log(currMessage);
  let msgContainer = buildMessageContainer(currMessage);
 displayMessage(msgContainer);
messages.push(msgContainer);
});

const buildMessage = (u) => {
  u.message = validateMessage(u.message);
  return `${u.alias}: ${u.message}`;
};

const validateMessage = (msg) => {
  // = msg.replace(/\s/g, "");
  console.log("Validating message: " + msg);
  if (blockListRegex.test(msg)) {
    console.log("Blocked message detected: " + msg);
    for (const word of blockList) {
      
      if (msg.includes(word)) {
        msg = msg.replace(new RegExp(`\\b${word}\\b`, 'gi'), '***');
      }
    }
  }
  return msg;
};


const buildMessageContainer = (msg) => {
  let temp = {
    text: msg,
    posx: Math.random() * window.innerWidth,
    posy: Math.random() * window.innerHeight,
    speed: Number(userResponse.speed)
  };
  return temp;
};

const displayMessage = (msgContainer) => {
  let messageElement = document.createElement('p');
  messageElement.classList.add('message');
  messageElement.textContent = msgContainer.text;
  messageElement.style.backgroundColor = userResponse.color+'20';
  messageElement.style.border = `1px solid ${userResponse.color}`;
  messageElement.style.color = userResponse.color;
  // messageElement.style.left = `${msgContainer.posx}px`;
  // messageElement.style.top = `${msgContainer.posy}px`;
  mainContainer.appendChild(messageElement);
  const rect = messageElement.getBoundingClientRect();
  msgContainer.width = rect.width;
  msgContainer.height = rect.height;
  msgContainer.posx = Math.random() * (mainContainer.clientWidth - rect.width);
  msgContainer.posy = Math.random() * (mainContainer.clientHeight - rect.height);
  messageElement.style.left = `${msgContainer.posx}px`;
messageElement.style.top = `${msgContainer.posy}px`;
  msgContainer.el = messageElement;

  return messageElement;
};


const tick = (currentTime) => {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  for (const m of messages) {
    m.posx += m.speed * dt;
    if (m.posx > mainContainer.clientWidth) {
      m.posx = -m.width;
    }
    m.el.style.left = `${m.posx}px`;
  }
  requestAnimationFrame(tick);
};

requestAnimationFrame(tick);