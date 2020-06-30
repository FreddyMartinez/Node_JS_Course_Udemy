const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageInput = document.querySelector("input");
const $messageButton = document.querySelector("#send-msg-btn");
const $locationButton = document.querySelector("#send-location-btn");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.on("message", message => {
  const newMsg = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    time: moment(message.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", newMsg);
});

socket.on("locationMessage", url => {
  const location = Mustache.render(locationTemplate, {
    username: url.username,
    url: url.text,
    time: moment(url.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", location);
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();

  $messageButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, error => {
    $messageButton.removeAttribute("disabled");
    $messageInput.value = "";
    $messageInput.focus();
    if (error) {
      alert(error);
    }
  });
});

$locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("geolocation not supported by this browser");
  }

  $locationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      response => {
        $locationButton.removeAttribute("disabled");
        console.log(response);
      }
    );
  });
});

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location = "/";
  }
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  document.querySelector("#sidebar").innerHTML = html;
});
