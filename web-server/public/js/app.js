const weatherForm = document.querySelector("form");
const input = document.querySelector("input");
const description = document.querySelector("#weather-description");

weatherForm.addEventListener("submit", e => {
  e.preventDefault();

  const city = input.value;
  description.textContent = "Searching";

  if (city && city != "") {
    fetch(`http://localhost:3000/weather?city=${city}`).then(resp => {
      resp.json().then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          console.log(data);
          description.textContent = `The temperature in ${city} is ${data.weather.temperature} °C`;
        }
      });
    });
  } else {
    description.textContent = "Please write a valid place";
  }
});
