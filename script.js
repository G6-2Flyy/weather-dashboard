


const searchBtn = document.getElementById('search-btn')

function handleClick() {
    let cityName = document.getElementById('user-input').value
    getCoordinates(cityName)
    saveToStorage(cityName);
    showHistory();
    document.getElementById('user-input').value = ""
}


function saveToStorage(city) {
    var cities = getFromStorage();
    cities.unshift(city)
    localStorage.setItem('cities', JSON.stringify(cities))
}

function getFromStorage() {
    return JSON.parse(localStorage.getItem('cities'))|| []
}

function showHistory() {
    var cities = getFromStorage();
    var htmlBtns = "";
    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        htmlBtns+= `
        <button class="btn btn-lg btn-secondary text-black" type="button">
        ${city}
      </button>
        `
    } 
    document.querySelector('#history').innerHTML= htmlBtns;
    document.querySelectorAll('#history button').forEach(function(btn){
        btn.addEventListener('click', function(event) {
            var city = event.target.innerText
            getCoordinates(city);
        })
    })
}

function getCoordinates(cityName) {
    const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b252363afb389a56dd98d4db518ad7a6&units=imperial`;
    fetch(requestUrl).then(function(response) {
        return response.json()
    })
    .then(function(data) {
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        getFutureWeather(lat, lon)
       getCurrentWeather(data, cityName);
    })
}
//fetching current weather
function getCurrentWeather(cData, city) {
    let cityHeader = document.getElementById('city-title')
    cityHeader.textContent = city
    let currentDate = document.getElementById('current-date')
    currentDate.textContent = `(${dateFormatting(cData.dt)})`
    document.getElementById('current-weather-icon').src="https://openweathermap.org/img/w/"+ cData.weather[0].icon +".png"
    let currentIcon = document.getElementById('current-weather-icon').src="https://openweathermap.org/img/w/"+ cData.weather[0].icon +".png"
    currentIcon.textContent = cData.weather[0].icon 
    let currentTemp = document.getElementById('current-temp')
    currentTemp.innerHTML = `Temp: ${cData.main.temp} &#8457`
    let currentHumidity = document.getElementById('current-humidity')
    currentHumidity.innerHTML = `Humidity: ${cData.main.humidity} &#x25`
    let currentWindSpeed = document.getElementById('current-wind')
    currentWindSpeed.innerText = `Wind: ${cData.wind.speed} MPH`
}

function getFutureWeather(lat, lon) {
    
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b252363afb389a56dd98d4db518ad7a6&units=imperial`;
    fetch(requestUrl).then(function(response) {
        return response.json()
    })
    .then(function(data) {
        let oneDayOut, twoDaysOut, threeDaysOut, fourDaysOut, fiveDaysOut; 
        let fiveDayOutlook = [];
        oneDayOut = data.list[8]; 
        twoDaysOut = data.list[16];
        threeDaysOut = data.list[24];
        fourDaysOut = data.list[32];
        fiveDaysOut = data.list[39];
        fiveDayOutlook.push(oneDayOut, twoDaysOut, threeDaysOut, fourDaysOut, fiveDaysOut);

        displayFutureDate(...fiveDayOutlook);
        displayFutureHumidity(...fiveDayOutlook);
        displayFutureWind(...fiveDayOutlook);
        displayFutureTemp(...fiveDayOutlook);
        displayFutureIcon(...fiveDayOutlook);

    })
}

function displayFutureDate(...data) {
    for (let day=0; day<data.length; day++) {
        let daysOut = day + 1;
        let dateFormatted = dateFormatting(data[day].dt);
        document.getElementById(`date-out-${daysOut}-day`).textContent = dateFormatted;
    }
}

function displayFutureTemp(...data) {
    for (let day=0; day<data.length; day++) {
        let daysOut = day + 1;
        let temperature =data[day].main.temp;
        document.getElementById(`temp-out-${daysOut}-day`).innerHTML = `Temp: ${temperature} &#8457`;
    }
}

function displayFutureHumidity(...data) {
    for (let day=0; day<data.length; day++) {
        let daysOut = day + 1;
        let humidity =data[day].main.humidity;
        document.getElementById(`humidity-out-${daysOut}-day`).innerHTML = `Humidity: ${humidity} &#x25`;
    }
}

function displayFutureWind(...data) {
    for (let day=0; day<data.length; day++) {
        let daysOut = day + 1;
        let wind = data[day].wind.speed;
        document.getElementById(`wind-out-${daysOut}-day`).innerText = `Wind: ${wind} MPH`;
    }
}

function displayFutureIcon(...data) {
    for (let day=0; day<data.length; day++) {
        let daysOut = day + 1;
        let icon = data[day].weather[0].icon;
        document.getElementById(`icon-out-${daysOut}-day`).src="https://openweathermap.org/img/w/"+ icon +".png";
        document.getElementById(`icon-out-${daysOut}-day`).textContent;}
}

//covert time from unix to month day year
function dateFormatting(date) {
    let unixTimeMs = date * 1000;
    let unixDate = new Date(unixTimeMs);
    let dateFormatted = new Intl.DateTimeFormat('en-US').format(unixDate);
    return dateFormatted;
}

searchBtn.addEventListener("click", handleClick)

showHistory();