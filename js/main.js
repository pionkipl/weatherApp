"use strict";
(function() {
  let input = document.querySelector(".main__weather__top--city-input");
  let search = document.querySelector(".main__weather__top--city-search");

  let arr;

  search.addEventListener("click", () => {
    fetchWeather(input.value).then(list => {
      findDays(list);
    });
  });

  function findDays(data) {
    arr = [];
    for (let i = 0; i < data.length; i += 8) {
      arr.push(data[i]);
    }
    console.log(arr);
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
      .catch(errr => {
        console.log("Empty array");
        return [];
      });
  }
})();
