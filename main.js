let currentWeather = [];
let weatherForecast = [];

const renderWeatherData = () => {
  document.querySelector(".weather-data").replaceChildren();

  for (let i = 0; i < currentWeather.length; i++) {
    const weather = currentWeather[i];
    const template = `<div class = "row weather-data"><div class = "current-conditions col-md-3 offset-md-3 text-center"><strong>
      <div>${weather.temp.toFixed(1)}°F</div>
      <div>${weather.city}</div>
      <div>${weather.condition}</div>
      
      </strong></div>
      <div class="current-icon col-md-2" >
      <img src= "https://openweathermap.org/payload/api/media/file/${weather.icon}@2x.png">
      </div>

      </div>
    
      `;
    document
      .querySelector(".weather-data")
      .insertAdjacentHTML("beforeend", template);
  }
};

//Event Listener
document.querySelector(".search").addEventListener("click", function (e) {
  e.preventDefault();

  const city = document.querySelector("#search-query").value;

  fetchWeather(city);

  document.querySelector("#search-query").value = "";
});

const addCurrentWeather = (data) => {
  const conditions = {
    temp: (data.main.temp - 273.15) * (9 / 5) + 32,
    city: data.name || null,
    condition: data.weather[0].main || null,
    icon: data.weather[0].icon || null,
  };

  currentWeather.push(conditions);

  renderWeatherData();
};

const fetchWeather = (query) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=d408f27efbf2eb54ef2bd39871d4fe8b`;

  fetch(url, {
    method: "GET",
    dataType: "json",
  })
    .then((data) => data.json())
    .then((data) => addCurrentWeather(data));
};
