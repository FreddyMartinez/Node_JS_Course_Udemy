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

// Getting user and room from url options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// Autoscroll
const autoscroll = () => {
  // get new message
  const $newMessage = $messages.lastElementChild;

  // height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containertHeight = $messages.scrollHeight;

  // Calculate scroll offset from bottom
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containertHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

/**
 * Send messages
 */
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

socket.on("message", message => {
  const newMsg = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    time: moment(message.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", newMsg);
  autoscroll();
});

/**
 * Send own location
 */

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

socket.on("locationMessage", url => {
  const location = Mustache.render(locationTemplate, {
    username: url.username,
    url: url.text,
    time: moment(url.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", location);
  autoscroll();
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
