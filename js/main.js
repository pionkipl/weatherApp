"use strict";
(function() {
  const input = document.querySelector(".main__weather__top--city-input");
  const search = document.querySelector(".main__weather__top--city-search");
  const forecast = document.querySelectorAll(
    ".main__weather__bottom__forecast-item"
  );
  const forecastDay = document.querySelectorAll(
    ".main__weather__bottom__forecast-item--day"
  );
  const forecastIcon = document.querySelectorAll(
    ".main__weather__bottom__forecast-item--icon"
  );
  const forecastTemp = document.querySelectorAll(
    ".main__weather__bottom__forecast-item--temp"
  );
  const degrees = document.querySelectorAll(".main__weather__top--degree-item");

  const mainTemp = document.querySelector(".main__weather__mid--temp");
  const mainDate = document.querySelector(".main__weather__mid--date");
  const mainCity = document.querySelector(".main__weather__mid--city");

  const pressure = document.querySelector(
    ".main__weather__bottom__details__right--pressure"
  );
  const humidity = document.querySelector(
    ".main__weather__bottom__details__right--humidity"
  );
  const wind = document.querySelector(
    ".main__weather__bottom__details__right--wind"
  );

  let city = "Warsaw";

  let arr;

  let weatherList = [];

  search.addEventListener("click", () => {
    fetchWeather(input.value).then(list => {
      if (input.value.trim() !== "") {
        mainCity.innerText = input.value;
        let find = findDays(list);
        weatherList = setDate(find);
        console.log(weatherList);
        foreCast(weatherList);
        changeData(weatherList);
      } else {
        Swal.fire({
          title: "Please type city before clicking",
          width: 600,
          padding: "3em",
          background: "#fff"
        });
      }
    });
  });

  // Show warsaw at beginning

  fetchWeather(city).then(list => {
    let find = findDays(list);
    weatherList = setDate(find);
    foreCast(weatherList);
    mainTemp.innerText = forecastTemp[0].innerText;
    mainCity.innerText = city;
    pressure.innerText = `Pressure: ${weatherList[0].main.pressure} hPa`;
    humidity.innerText = `Humidity: ${round(weatherList[0].main.humidity)}%`;
    wind.innerText = `Wind: ${toKm(weatherList[0].wind.speed)}km/h`;

    changeData(weatherList);
    console.log(weatherList);
  });

  function check(el, data) {
    for (let i = 0; i < data.length; i++) {
      data[i].classList.remove("active");
    }
    el.classList.add("active");
  }

  forecast.forEach(el => {
    el.addEventListener(
      "click",
      function(e) {
        check(this, forecast);
        changeData(forecast);
      },
      this
    );
  });

  function checkTemp(el, deg) {
    for (let i = 0; i < deg.length; i++) {
      deg[i].classList.remove("active-temp");
    }
    el.classList.add("active-temp");
  }

  degrees.forEach(el => {
    el.addEventListener("click", function() {
      checkTemp(el, degrees);
    });
  });

  function foreCast(data) {
    for (let i = 0; i < data.length; i++) {
      forecastDay[i].innerHTML = data[i].dayShort;
      forecastTemp[i].innerHTML = degrees[1].classList.contains("active-temp")
        ? toCelsius(data[i].main.temp)
        : toFahrenheit(data[i].main.temp);
      if (weatherList[i].weather[0].main == "Clouds") {
        forecastIcon[i].style.webkitMaskImage = 'url("../img/cloud.svg")';
      } else if (weatherList[i].weather[0].main == "Clear") {
        forecastIcon[i].style.webkitMaskImage = 'url("../img/sun.svg")';
      } else if (weatherList[i].weather[0].main == "Rain" || "Drizzle") {
        forecastIcon[i].style.webkitMaskImage = 'url("../img/rain.svg")';
      } else if (weatherList[i].weather[0].main == "Thunderstorm") {
        forecastIcon[i].style.webkitMaskImage = 'url("../img/thunder.svg")';
      } else if (weatherList[i].weather[0].main == "Snow") {
        forecastIcon[i].style.webkitMaskImage = 'url("../img/snow.svg")';
      } else if (weatherList[i].weather[0].main == "Atmosphere") {
        forecastIcon[i].style.webkitMaskImage = 'url("../img/fog.svg")';
      }
    }
  }

  function setDate(data) {
    let d = new Date();
    for (let i = 0; i < data.length; i++) {
      let dayName = new Date(data[i].dt).getDay();
      let dayNumber = new Date(data[i].dt).getDate();
      let dayShort = new Date(data[i].dt).getDay();
      let month = new Date(data[i].dt).getMonth();
      let year = new Date(data[i].dt).getFullYear();

      data[i].dayName = changeDay(dayName);
      data[i].dayShort = shortDay(dayShort);
      data[i].dayNumber = dayNumber;
      data[i].month = changeMonth(month);
      data[i].year = year;
    }
    return data;
  }

  function findDays(data) {
    let arr = [];
    for (let i = 0; i < data.length; i += 8) {
      arr.push(data[i]);
    }
    return arr;
  }

  function fetchWeather(city) {
    return fetch(
      `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=4d542bf9572aee4fe02b7e99b67cb728`
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        let list = myJson.list;
        list.forEach(function(el) {
          el.dt *= 1000;
        });
        return list;
      })
      .catch(err => {
        console.log(err);
        return [];
      });
  }

  // Change displaying data on click

  function changeData(data) {
    mainTemp.innerText = forecastTemp[0].innerText;
    let date = weatherList[0].dt_txt;
    mainDate.innerText = `${weatherList[0].dayName} ${takeDate(date)}`;
    for (let i = 0; i < data.length; i++) {
      if (forecast[i].classList.contains("active")) {
        mainTemp.innerText = forecastTemp[i].innerText;
        let date = weatherList[i].dt_txt;
        mainDate.innerText = `${weatherList[i].dayName} ${takeDate(date)}`;
        pressure.innerText = `Pressure: ${round(
          weatherList[i].main.pressure
        )} hPa`;
        humidity.innerText = `Humidity: ${weatherList[i].main.humidity}%`;
        wind.innerText = `Wind: ${toKm(weatherList[i].wind.speed)}km/h`;
      }
    }
  }

  // change temperature to fahrenheit and celsius
  degrees.forEach(el => {
    el.addEventListener("click", () => {
      foreCast(weatherList);
      mainTemp.innerText = forecastTemp[0].innerText;
    });
  });

  // helpers

  function round(hpa) {
    return Math.round(hpa);
  }

  function toKm(miles) {
    let km = Math.ceil(miles / 0.62137);
    return km;
  }

  function takeDate(str) {
    let reg = /^.*?\d+\-\d+\-\d+/g;
    let arr = str.match(reg);
    return arr;
  }

  function toCelsius(degree) {
    let celsius = Math.ceil(degree - 273.15);
    return celsius;
  }

  function toFahrenheit(degree) {
    return Math.ceil((degree * 9) / 5 - 459.67);
  }

  function changeDay(day) {
    switch (day) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
    }
    return day;
  }

  function shortDay(day) {
    switch (day) {
      case 0:
        day = "Sun";
        break;
      case 1:
        day = "Mon";
        break;
      case 2:
        day = "Tue";
        break;
      case 3:
        day = "Wed";
        break;
      case 4:
        day = "Thu";
        break;
      case 5:
        day = "Fri";
        break;
      case 6:
        day = "Sat";
    }
    return day;
  }

  function changeMonth(month) {
    switch (month) {
      case 0:
        month = "January";
        break;
      case 1:
        month = "February";
        break;
      case 2:
        month = "March";
        break;
      case 3:
        month = "April";
        break;
      case 4:
        month = "May";
        break;
      case 5:
        month = "June";
        break;
      case 6:
        month = "July";
        break;
      case 7:
        month = "August";
        break;
      case 8:
        month = "September";
        break;
      case 9:
        month = "October";
        break;
      case 10:
        month = "November";
        break;
      case 11:
        month = "December";
        break;
    }
    return month;
  }
})();
