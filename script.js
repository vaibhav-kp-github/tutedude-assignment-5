// for current date and time 

function updateClock() {
  const now = new Date();
  document.getElementById("date").innerHTML = now.toDateString();
  document.getElementById("time").innerHTML = now.getHours() + ":" + now.getMinutes();
}
setInterval(updateClock, 1000);
updateClock();

//for not refresh the page  or refresh the the others city current weather

const form = document.querySelector("form");
const searchInput = document.getElementById("fcity");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const city = searchInput.value.trim();

  if (city) {
    getWeather(city); // If city is entered, show its weather
  } else {
    alert("Please enter a city name."); // Alert if no city is entered
  }

  searchInput.value = ""; // Clear the input field after action
});


// for search the city current weather

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
      const sunriseTime = new Date(data.sys.sunrise * 1000);
      const sunsetTime = new Date(data.sys.sunset * 1000);

      document.getElementById("sun-rise").innerHTML = sunriseTime.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit",});
      document.getElementById("sun-set").innerHTML = sunsetTime.toLocaleTimeString([], {hour: "2-digit",minute: "2-digit", });

      document.getElementById("weather-image").src = `https://openweathermap.org/img/wn/${data.weather[0].icon + ".png"}`;
      document.getElementById("city-temp").innerHTML = `${data.name} Temperature`;
      document.getElementById("tmp").innerHTML = data.main.temp;
      document.getElementById("mn-t").innerHTML = data.main.temp_min + "°C";
      document.getElementById("mx-t").innerHTML = data.main.temp_max + "°C";

      document.getElementById("city-humidity").innerHTML = `${data.name} Humidity`;
      document.getElementById("hmd").innerHTML = data.main.humidity;
      document.getElementById("hmd1").innerHTML = data.main.feels_like + "°C";
      document.getElementById("hmd2").innerHTML = data.weather[0].description;

      document.getElementById("city-wind").innerHTML = `${data.name} Wind Info`;
      document.getElementById("wnd").innerHTML = data.wind.speed;
      document.getElementById("wind-degree").innerHTML = "Degree: " + data.wind.deg + "°";
      document.getElementById("wind-direction").innerHTML =
        "Direction: " + getWindDirection(data.wind.deg);
    })
    .catch((error) => {
      console.error(error);
      alert("Please enter a valid city name.");
    });
}

getWeather("pune")

document.getElementById("refreshBtn").addEventListener("click", () => {
  const lastCityName = document
    .getElementById("city-temp")
    .innerText.split(" ")[0];
  if (lastCityName && lastCityName !== "Temperature") {
    getWeather(lastCityName); // Re-fetch current city weather
  } else {
    getWeather("Pune"); // fallback city
  }
});

// for getting other cities live weather data

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
          <td class="text-nowrap align-content-center text-start">${data.name}</td>
          <td class="text-nowrap align-content-center">${data.main.temp}</td>
          <td class="text-nowrap align-content-center">${data.main.humidity}</td>
          <td class="text-nowrap align-content-center">${data.main.feels_like}</td>
          <td class="text-nowrap align-content-center"><img class="image-fluid" src="https://openweathermap.org/img/wn/${data.weather[0].icon + ".png"}"></td>
          <td class="text-nowrap align-content-center">${data.wind.speed}</td>
          <td class="text-nowrap align-content-center">${getWindDirection(data.wind.deg)}</td>
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
