var dt = new Date();
var time = dt.getHours() + ":" + dt.getMinutes();

document.getElementById("date").innerHTML = dt.toDateString();
document.getElementById("time").innerHTML = time;

const form = document.querySelector("form");
const searchInput = document.getElementById("fcity");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const city = searchInput.value.trim();

  if (city) {
    getWeather(city); // If city is entered, show its weather
  } else {
    loadMultipleCitiesWeather(); // Else, refresh default cities
  }

  searchInput.value = ""; // Clear the input field after action
});

function getWeather(city) {
  const apiKey = "789934960413b3939e6461e2278f75cd";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      document.getElementById(
        "city-temp"
      ).innerHTML = `${data.name} Temperature`;
      document.getElementById("tmp").innerHTML = data.main.temp;
      document.getElementById("mn-t").innerHTML = data.main.temp_min + "°C";
      document.getElementById("mx-t").innerHTML = data.main.temp_max + "°C";

      document.getElementById(
        "city-humidity"
      ).innerHTML = `${data.name} Humidity`;
      document.getElementById("hmd").innerHTML = data.main.humidity;
      document.getElementById("hmd1").innerHTML = data.main.feels_like + "°C";
      document.getElementById("hmd2").innerHTML = data.weather[0].description;

      document.getElementById("city-wind").innerHTML = `${data.name} Wind Info`;
      document.getElementById("wnd").innerHTML = data.wind.speed;
      document.getElementById("wind-degree").innerHTML =
        "Degree: " + data.wind.deg + "°";
      document.getElementById("wind-direction").innerHTML =
        "Direction: " + getWindDirection(data.wind.deg);
    })
    .catch((error) => {
      console.error(error);
      alert("Please enter a valid city name.");
    });
}

function getWindDirection(deg) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(deg / 45) % 8];
}

const cities = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
];

function loadMultipleCitiesWeather() {
  const tbody = document.getElementById("weather-table-body");
  tbody.innerHTML = ""; // Clear previous data

  cities.forEach((city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=789934960413b3939e6461e2278f75cd&units=metric`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("City not found");
        return response.json();
      })
      .then((data) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="text-nowrap">${data.name}</td>
          <td class="text-nowrap">${data.main.temp}</td>
          <td class="text-nowrap">${data.main.humidity}</td>
          <td class="text-nowrap">${data.main.feels_like}</td>
          <td class="text-nowrap">${data.weather[0].description}</td>
          <td class="text-nowrap">${data.wind.speed}</td>
          <td class="text-nowrap">${getWindDirection(data.wind.deg)}</td>
        `;
        tbody.appendChild(row);
      })
      .catch((error) => {
        console.error(`Error fetching data for ${city}:`, error);
      });
  });
}
loadMultipleCitiesWeather(); // Initial load

// Auto-refresh every 10 minutes
setInterval(loadMultipleCitiesWeather, 600000);
