let currentWeather = [];
let weatherForecast = [];

const renderWeatherData = () => {
  const weather = currentWeather[0];

  if (weatherForecast.length < 4) {
    return;
  }

  //Daily Data Array
  const dailyData = weatherForecast[0].map((_, i) => ({
    condition: weatherForecast[0][i],
    temp: weatherForecast[1][i],
    icon: weatherForecast[2][i],
    day: weatherForecast[3][i],
  }));

  console.log(dailyData);

  let currentTemplate = `<div class = "row current-weather mb-4">
    <div class = "current-conditions col-md-3 offset-md-3 text-center"><strong>
      <div>${Math.round(weather.temp)}°F</div>
        <div>${weather.city}</div>
          <div>${weather.condition}</div></strong>
    
            </div>
          <div class="current-icon col-md-2" >
        <img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="${weather.condition}">
      </div>

      </div>

      `;

  const forecastHTML = dailyData
    .map(
      (item) => `
    <div class="col-md-2 text-center day"><strong>
      <div>${item.condition}</div>
      <div>${item.temp}</div>
      <img src="https://openweathermap.org/img/wn/${item.icon}@2x.png" alt="${item.condition}">
      <div>${item.day}</div>
      </strong>
    </div>
  `,
    )
    .join("");

  document.querySelector(".weather-data").innerHTML =
    currentTemplate +
    `<div class="row forecast-data offset-md-1 text-center">${forecastHTML}</div>`;
};

//Event Listener
document.querySelector(".search").addEventListener("click", function (e) {
  e.preventDefault();

  const city = document.querySelector("#search-query").value;

  fetchWeather(city);

  document.querySelector("#search-query").value = "";
});

const addCurrentWeather = (data) => {
  currentWeather = [];

  const conditions = {
    temp: (data.main.temp - 273.15) * (9 / 5) + 32,
    city: data.name || null,
    condition: data.weather[0].main || null,
    icon: data.weather[0].icon || null,
  };

  //Add to beginning of array
  currentWeather.push(conditions);
};

const addForecast = (data) => {
  weatherForecast = [];

  const weatherArray = [];
  const tempArray = [];
  const iconArray = [];
  const dayArray = [];

  let count = 0;
  let subWeather = [];
  let subTemp = [];
  let subIcon = [];
  let subDay = [];

  for (let i = 0; i < data.list.length; i++) {
    count += 1;

    subWeather.push(data.list[i].weather[0].main);
    subTemp.push(
      `${Math.round((data.list[i].main.temp - 273.15) * (9 / 5) + 32)}°F`,
    );
    subIcon.push(data.list[i].weather[0].icon);
    const date = new Date(data.list[i].dt_txt);
    subDay.push(date.toLocaleDateString("en-US", { weekday: "long" }));

    if (count === 8) {
      weatherArray.push(mode(subWeather));
      tempArray.push(mode(subTemp));
      iconArray.push(mode(subIcon));
      dayArray.push(mode(subDay));

      count = 0;
      subWeather = [];
      subTemp = [];
      subIcon = [];
      subDay = [];
    }
  }

  weatherForecast.push(weatherArray);
  weatherForecast.push(tempArray);
  weatherForecast.push(iconArray);
  weatherForecast.push(dayArray);
};

//Find the mode of each nested Array
const mode = (array) => {
  frequencyObject = {};

  array.forEach((number) => {
    frequencyObject[number] = (frequencyObject[number] || 0) + 1;
  });

  const mode = Object.entries(frequencyObject).sort(([, a], [, b]) => b - a);

  return mode[0][0];
};

const fetchWeather = (query) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=d408f27efbf2eb54ef2bd39871d4fe8b`;

  //GET Request by Default
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      addCurrentWeather(data);

      const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=d408f27efbf2eb54ef2bd39871d4fe8b`;

      return fetch(urlForecast);
    })
    .then((res) => res.json())
    .then((forecastData) => {
      addForecast(forecastData);

      renderWeatherData();
    });
};
