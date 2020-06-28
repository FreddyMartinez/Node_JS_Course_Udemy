const socket = io();

socket.on("message", message => {
  console.log(message);
});

const messageForm = document.querySelector("#message-form");
messageForm.addEventListener("submit", e => {
  e.preventDefault();

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, response => {
    console.log(response);
  });
});

document.querySelector("#send-location-btn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("geolocation not supported by this browser");
  }
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      response => {
        console.log(response);
      }
    );
  });
});
