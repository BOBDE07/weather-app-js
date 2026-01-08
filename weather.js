const api = {
    key: "91c1e300e40d87310207c6f209a460f4",
    base: "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.key === "Enter") {
        getResults(searchbox.value);
    }
}

// ---------- CURRENT WEATHER ----------
function getResults(query) {
    fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
        .then(res => res.json())
        .then(data => {
            displayResults(data);
            getForecast(data.coord.lat, data.coord.lon);
        })
        .catch(err => console.log(err));
}

function displayResults(weather) {
    document.querySelector('.location .city').innerText =
        `${weather.name}, ${weather.sys.country}`;

    document.querySelector('.location .date').innerText =
        dateBuilder(new Date());

    document.querySelector('.current .temp').innerHTML =
        `${Math.round(weather.main.temp)}<span>°c</span>`;

    document.querySelector('.current .weather').innerText =
        weather.weather[0].main;

    document.querySelector('.hi-low').innerText =
        `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

    // Extra features
    document.querySelector('.feels-like').innerText =
        `Feels like: ${Math.round(weather.main.feels_like)}°c`;

    document.querySelector('.humidity').innerText =
        `Humidity: ${weather.main.humidity}%`;

    document.querySelector('.wind').innerText =
        `Wind: ${weather.wind.speed} m/s`;
}

// ---------- 5 DAY FORECAST ----------
function getForecast(lat, lon) {
    fetch(`${api.base}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`)
        .then(res => res.json())
        .then(displayForecast);
}

function displayForecast(data) {
    const forecastContainer = document.querySelector('.forecast-days');
    forecastContainer.innerHTML = "";

    // Pick one forecast per day (12:00 PM)
    const dailyData = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyData.forEach(day => {
        const date = new Date(day.dt_txt);

        const forecastEl = document.createElement('div');
        forecastEl.classList.add('forecast-day');

        forecastEl.innerHTML = `
      <div>${date.toLocaleDateString("en-US", { weekday: "short" })}</div>
      <div>${Math.round(day.main.temp)}°c</div>
      <div>${day.weather[0].main}</div>
    `;

        forecastContainer.appendChild(forecastEl);
    });
}

// ---------- DATE ----------
function dateBuilder(d) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const days = [
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ];

    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
