const messageBox = document.getElementById("message-box");
const overlay = document.getElementById("overlay");
const inputMsg = document.getElementById("input-message");
const inputLogin = document.getElementById("input-login");
let objectUsername = {};
let lockScroll = false;

function getUsername() {
  objectUsername.name = inputLogin.value;
  const getName = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    objectUsername
  );
  getName.then(() => {
    inputLogin.value = "";
    overlay.classList.add("hidden");
    requestMessage();
  });
  getName.catch(chooseAnotherName);
}

function chooseAnotherName(error) {
  if (error.response.status === 400) {
    inputLogin.value = "";
    inputLogin.placeholder = "That name is already in use";
  }
}

function keepConnection() {
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status", objectUsername);
}

function requestMessage() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  promise.then(getMessage);
}

function getMessage(message) {
  messageBox.innerHTML = "";
  for (let i = 80; i < message.data.length; i++) {
    if (message.data[i].type === "status") {
      messageBox.innerHTML += `
    <li class="entered">
      <p><span class="hours">${message.data[i].time}</span> <strong>${message.data[i].from}</strong> para <strong>${message.data[i].to}</strong>: ${message.data[i].text}</p>
    </li>`;
    } else if (message.data[i].type === "message") {
      messageBox.innerHTML += `
    <li>
      <p><span class="hours">${message.data[i].time}</span> <strong>${message.data[i].from}</strong> para <strong>${message.data[i].to}</strong>: ${message.data[i].text}</p>
    </li>`;
    } else if (
      message.data[i].type === "private_message" &&
      message.data[i].to === objectUsername.name
    ) {
      messageBox.innerHTML += `
    <li class="reservedly">
      <p><span class="hours">${message.data[i].time}</span> <strong>${message.data[i].from}</strong> para <strong>${message.data[i].to}</strong>: ${message.data[i].text}</p>
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
  const sendMessage = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    objectMessage
  );
  sendMessage.then(requestMessage);
  inputMsg.value = "";
  messageBox.lastElementChild.scrollIntoView();
}

inputMsg.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
inputLogin.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    getUsername();
  }
});
setInterval(requestMessage, 3000);
setInterval(keepConnection, 5000);
