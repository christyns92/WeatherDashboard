console.log("working");


var submitBtn = $('#submitBtn'); // submit button
var dayTemp = $('#dayTemp'); // daily temperature
var dayWind = $('#dayWind'); //daily wind
var dayUV = $('#dayUV'); //daily uv index
var dayHumidity = $('#dayHumidity'); //daily humidity
var dayCity = $('#dailyCity'); // city
var dayIcon = $('#dayIcon'); //icon



var recentSearch = $('#recentSearch'); // displays recent searches
var currentDayWeather = $('#currentDayWeather'); //current weather
var fiveDayWeather = $('#fiveDayWeather'); //five day weather

// Javascript Variables
var userInput
var saveCity = [];

// listens for button click and user input
submitBtn.click(function() {
    userInput = $('#userInfo').val();
    updateDiv();
    getWeather();
    save();
    display();
})

// pulls in user input
function getWeather() {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + userInput + '&units=imperial&appid=d5560a2195af1c81ce054ec9f5539ee6')
        .then(function(response) {
            return response.json();
        })

    //displays current date
    .then(function(data) {
        console.log(data)
        dayCity.text(data.name + " " + moment().format('MM/DD/YYYY'));

        // gets users latitude and longitude
        fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + data.coord.lat + '&lon=' + data.coord.lon + '&exclude=hourly,alerts&units=imperial&appid=d5560a2195af1c81ce054ec9f5539ee6')
            .then(function(response) {
                return response.json();
            })

        // gathers current weather, uvi, temp, wind speed and humidity
        .then(function(data2) {
            console.log(data2);
            dayUV.text("UV Index: " + data2.current.uvi);
            if (data2.current.uvi > 6) {
                dayUV.css('background', '#aa2020')
            } else if (data2.current.uvi > 4) {
                dayUV.css('background', '#aa6a20')
            } else {
                dayUV.css('background', '#40aa20')
            }
            dayIcon.prepend('<img src = "http://openweathermap.org/img/wn/' + data2.current.weather[0].icon + '@2x.png" />');
            dayTemp.text("Temp: " + data2.current.temp + "??F");
            dayWind.text("Wind: " + data2.current.wind_speed + " MPH");
            dayHumidity.text("Humidity: " + data2.current.humidity + "%");


            $('.myCardTemp').each(function(i) { $(this).text("Temp: " + data2.daily[i].temp.day); });

            $('.myCardPhoto').each(function(i) { $(this).prepend('<img src = "http://openweathermap.org/img/wn/' + data2.daily[i].weather[0].icon + '@2x.png" />'); });

            $('.myCardWind').each(function(i) { $(this).text("Wind: " + data2.daily[i].wind_speed + "MPH"); });

            $('.myCardHumidity').each(function(i) { $(this).text("Humidity: " + data2.daily[i].humidity + '%'); });

            $('.myCardDate').each(function(i) { $(this).text(moment().add(1 + i, 'days').format("MM/DD/YYYY")); });
        })
    })
}

// saves searched cities to local storage
function check() {
    if (localStorage.getItem("cities") != null) { return JSON.parse(localStorage.getItem("cities")); } else { return saveCity; }
}

function save() {
    saveCity = check();
    saveCity.unshift(userInput);


    // limits recent searches to display only the last 5 
    if (saveCity.length > 5) {
        saveCity.pop();
        localStorage.setItem("cities", JSON.stringify(saveCity));
    } else { localStorage.setItem("cities", JSON.stringify(saveCity)); }
}

function display() {
    saveCity = check();

    $.each(saveCity, function(i) {
        var button = $('<button class = "btn btn-dark">/>');
        button.text(saveCity[i]);
        var list = $('<li/>');
        list.append(button);
        recentSearch.append(list);
    })
}

function updateDiv() {
    recentSearch.html('');
    $('.myCardPhoto').html('');
    dayIcon.html('');
}

recentSearch.click(function(event) {
    var tar = $(event.target);
    userInput = tar.text();
    updateDiv();
    getWeather();
    getAPI();
    save();
    check();
    display();
})

display();