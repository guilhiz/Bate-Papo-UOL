const messageBox = document.getElementById("message-box");
const overlay = document.getElementById("overlay");
const loadingPage = document.getElementById("loading")
const inputMsg = document.getElementById("input-message");
const inputLogin = document.getElementById("input-login");
let objectUsername = {};
let lockScroll = false;

function getUsername() {
  objectUsername.name = inputLogin.value;
  const getName = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", objectUsername);
  getName.then(() => {
    inputLogin.value = "";
    loadingPage.classList.remove("hidden")
    requestMessage()
    setTimeout(() => {
      overlay.classList.add("hidden");
      loadingPage.classList.add("hidden")
    }, 3000)
  });
  getName.catch((error) => {
    if (error.response.status === 400) {
      inputLogin.value = "";
      inputLogin.placeholder = "That name is already in use";
    }
  });
}

function requestMessage() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  promise.then(getMessage);
}

function getMessage(message) {
  messageBox.innerHTML = "";
  for (let i = 50; i < message.data.length; i++) {
    if (message.data[i].type === "status") {
      messageBox.innerHTML += `
    <li class="entered">
      <p><span class="hours">${message.data[i].time}</span>&nbsp <strong>${message.data[i].from}</strong> para <strong>${message.data[i].to}</strong>:&nbsp ${message.data[i].text}</p>
    </li>`;
    } else if (message.data[i].type === "message") {
      messageBox.innerHTML += `
    <li>
      <p><span class="hours">${message.data[i].time}</span>&nbsp <strong>${message.data[i].from}</strong> para <strong>${message.data[i].to}</strong>:&nbsp ${message.data[i].text}</p>
    </li>`;
    } else if (message.data[i].type === "private_message" && (message.data[i].to === objectUsername.name || message.data[i].from === objectUsername)) {
      messageBox.innerHTML += `
    <li class="reservedly">
      <p><span class="hours">${message.data[i].time}</span>&nbsp <strong>${message.data[i].from}</strong> para <strong>${message.data[i].to}</strong>:&nbsp ${message.data[i].text}</p>
    </li>`;
    }
  }
  if (lockScroll === true) {
    return false;
  }
  messageBox.lastElementChild.scrollIntoView();
  lockScroll = true;
}

function sendMessage() {
  const objectMessage = {
    from: objectUsername.name,
    to: "Todos",
    text: inputMsg.value,
    type: "message",
  };
  const sendMessage = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objectMessage);
  sendMessage.then(requestMessage);
  sendMessage.catch(() => {
    window.location.reload()
  })
  inputMsg.value = "";
  messageBox.lastElementChild.scrollIntoView();
}

inputMsg.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
inputLogin.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    getUsername();
  }
});
setInterval(requestMessage, 3000);
setInterval(() => {
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status", objectUsername);
}, 5000);
