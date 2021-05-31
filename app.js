const weather = {
  current: {
    location: "",
    temp: "",
    description: "",
    icon: "",
    sunrise: "",
    sunset: "",
  },
  hourly: [
    {
      hour: "",
      icon: "",
      temp: "",
    },
    {
      hour: "",
      icon: "",
      temp: "",
    },
    {
      hour: "",
      icon: "",
      temp: "",
    },
    {
      hour: "",
      icon: "",
      temp: "",
    },
    {
      hour: "",
      icon: "",
      temp: "",
    },
    {
      hour: "",
      icon: "",
      temp: "",
    },
    {
      hour: "",
      icon: "",
      temp: "",
    },
    {
      hour: "",
      icon: "",
      temp: "",
    },
  ],
  daily: [
    {
      date: "",
      icon: "",
      temp_hight: "",
      temp_low: "",
    },
    {
      date: "",
      icon: "",
      temp_hight: "",
      temp_low: "",
    },
    {
      date: "",
      icon: "",
      temp_hight: "",
      temp_low: "",
    },
    {
      date: "",
      icon: "",
      temp_hight: "",
      temp_low: "",
    },
    {
      date: "",
      icon: "",
      temp_hight: "",
      temp_low: "",
    },
    {
      date: "",
      icon: "",
      temp_hight: "",
      temp_low: "",
    },
    {
      date: "",
      icon: "",
      temp_hight: "",
      temp_low: "",
    },
    {
      date: "",
      icon: "",
      temp_hight: "",
      temp_low: "",
    },
  ],
};
const nav_time = document.getElementById("nav_time");
const location_city = document.getElementsByClassName("location_city")[0];
const weather_desc = document.getElementsByClassName("weather_desc")[0];
const current_icon = document.getElementById("current_icon");
const current_temp = document.getElementsByClassName("current_temp")[0];
const content_hourly = document.getElementsByClassName("content_hourly")[0];
const content_daily = document.getElementsByClassName("content_daily")[0];
const current_sunrise = document.getElementById("sunrise");
const current_sunset = document.getElementById("sunset");
setInterval(() => {
  let dayOrNight = "AM";
  let d = new Date();
  let h = d.getHours();
  let m = d.getMinutes();
  h = checkTime(h);
  m = checkTime(m);
  if (h >= 12) {
    dayOrNight = "PM";
  }

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  nav_time.innerHTML = `${h}:${m} ${dayOrNight}`;
}, 1000);
// Get geographic coordinates
const notification = document.getElementById("notification");
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
  notification.innerHTML =
    "<p>Geolocation is not supported by this browser.</p>";
}
function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  getWeather(lat, lon);
}
function showError(error) {
  notification.innerHTML = ` <p>${error.message}</p> `;
  document.getElementsByClassName("content_hourly")[0].style.border = "none";
  // document.getElementsByClassName("content")[0].style.background-color = "transparent";
}
// Call API
const key = "0e1684e64e0188293e167670f42a897e";
async function getWeather(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}`;
  console.log(url);
  await fetch(url)
    .then((response) => response.json())
    .then(function (data) {
      // current
      weather.current.location = data.timezone;
      weather.current.temp = Math.floor(data.current.temp - 273);
      weather.current.description = data.current.weather[0].description;
      weather.current.icon = data.current.weather[0].icon;
      weather.current.sunrise = new Date(data.current.sunrise * 1000)
        .toTimeString()
        .substr(0, 5);
      weather.current.sunset = new Date(data.current.sunset * 1000)
        .toTimeString()
        .substr(0, 5);
      // hourly
      for (let i = 0; i < weather.hourly.length; i++) {
        // unix time so need to times 1000 to milliseconds
        weather.hourly[i].hour = (
          "0" + new Date(data.hourly[i].dt * 1000).getHours()
        ).substr(-2);
        weather.hourly[i].icon = data.hourly[i].weather[0].icon;
        weather.hourly[i].temp = Math.floor(data.hourly[i].temp - 273);
      }
      // Daily
      for (let i = 0; i < weather.daily.length; i++) {
        // unix time so need to times 1000 to milliseconds
        weather.daily[i].date = new Date(data.daily[i].dt * 1000)
          .toDateString()
          .substr(0, 4);
        weather.daily[i].icon = data.daily[i].weather[0].icon;
        weather.daily[i].temp_hight = Math.floor(data.daily[i].temp.max - 273);
        weather.daily[i].temp_low = Math.floor(data.daily[i].temp.min - 273);
      }
      // console.log(weather.daily);
    })
    .then(function displayWeather() {
      location_city.innerHTML = weather.current.location;
      weather_desc.innerHTML = weather.current.description;
      current_temp.innerHTML = weather.current.temp + "&#176";
      current_icon.setAttribute("src", `icons/${weather.current.icon}.png`);
      current_sunrise.innerHTML = `Sunrise at ${weather.current.sunrise}`;
      current_sunset.innerHTML = `Sunset at ${weather.current.sunset}`;
      // For hourly section

      let hourly_html = "";
      weather.hourly.forEach(function (hourly) {
        hourly_html += `
        <div class="hourly-item">
                    <p class="title">${hourly.hour}</p>
                    <img src="icons/${hourly.icon}.png">
                    <p class="hourly_temp">${hourly.temp}&#176</p>
                </div>`;
        content_hourly.innerHTML = hourly_html;
      });
      // For daily section
      let daily_html = "";
      // weather.daily.forEach((day) => console.log(day));
      for (let i = 0; i < weather.daily.length; i++) {
        daily_html += `
                <div class="daily-item">
                    <p class="title">${weather.daily[i].date}</p>
                    <img src="icons/${weather.daily[i].icon}.png">
                    <p class="low_high">
                        <span>H:${weather.daily[i].temp_hight}&#176</span>
                        <span>L:${weather.daily[i].temp_low}&#176</span>
                    </p>
                </div>`;
        content_daily.innerHTML = daily_html;
      }
    });
}
