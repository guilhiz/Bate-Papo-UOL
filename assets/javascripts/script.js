let messageBox = document.getElementById("message-box");
const input = document.getElementById("input");
const userName = prompt("whats your name?");
const nameObject = { name: userName };
let lockScroll = false

function getUserName() {
  const getName = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nameObject);
  getName.then(getPromise);
  // getName.catch(getUserName)
}

function keepConnection() {
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nameObject);
}

function getPromise() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  promise.then(getMessage);
}

function getMessage(message) {
  messageBox.innerHTML = "";
  for (let i = 0; i < message.data.length; i++) {
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
    } else if (message.data[i].type === "private_message") {
      messageBox.innerHTML += `
    <li class="entered">
      <p><span class="hours">${message.data[i].time}</span> <strong>${message.data[i].from}</strong> para <strong>${message.data[i].to}</strong>: ${message.data[i].text}</p>
    </li>`;
    }
  }
  if (lockScroll === true) {
    return false;
  }
  messageBox.lastElementChild.scrollIntoView();
  lockScroll = true
}

function enviarMensagem() {
  const inputMessage = {
    from: userName,
    to: "Todos",
    text: input.value,
    type: "message",
  };
  const enviarMessage = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    inputMessage
  );
  enviarMessage.then(getPromise);
  input.value = "";
}
getUserName();
setInterval(getPromise, 3000);
setInterval(keepConnection, 5000);
