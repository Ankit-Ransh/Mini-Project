// API keys
const API_KEY="5e0d12b0cb1dc13991b2d73da443b4d3";
const API_KEY_DATE_TIME="I814UQKEW3TN";

// By default user location
let searchedLocation = "Berlin";
let units = "metric";

// City along with Country
let city = document.querySelector(".city");

// Day Date Time
let day = document.querySelector(".date");

// Current status of weather
let description = document.querySelector(".status");

// current temperature 
let temperature = document.querySelector(".temperature");

// min max temperature expected
let minTemperature = document.querySelector(".min");
let maxTemperature = document.querySelector(".max");

// actual temperature on human body
let actual = document.querySelector(".actual");

// humidity
let humidity = document.querySelector(".humidity");

// wind
let wind = document.querySelector(".wind");

// pressure 
let pressure = document.querySelector(".pressure");

// icon
let icon = document.querySelector(".icon");

// API for weather information
let geoCoordinate = "https://api.openweathermap.org/data/2.5/weather?q=";
// API for timezone
let geoLocation = "http://api.timezonedb.com/v2.1/get-time-zone?key=";

const countryCodeToCountry = (country) => {
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country)
}

const formatDateTime = (input) => {
    const date = new Date(input);

    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(date);

    return formattedDateTime;
}

// Store original temperature values
let originalTemps = {
    temperature: null,
    minTemperature: null,
    maxTemperature: null,
    actual: null,
};

const currentWeather = async (e) => {
    // prevents refresh on submit
    e.preventDefault();

    let inputLocation = document.querySelector(".search").value;
    if(inputLocation !== "") searchedLocation = inputLocation;

    let geoCoordinateURL = geoCoordinate + `${searchedLocation}` + `&appid=${API_KEY}&units=${units}`;

    try{
        const geoResponse = await fetch(geoCoordinateURL);
        const geoData = await geoResponse.json();

        let latitude = geoData.coord.lat;
        let longitude = geoData.coord.lon;
        let country = countryCodeToCountry(geoData.sys.country);

        let geoLocationUrl = geoLocation + `${API_KEY_DATE_TIME}&format=json&by=position&lat=${latitude}&lng=${longitude}`;

        const locationResponse = await fetch(geoLocationUrl);
        const locationData = await locationResponse.json();
        
        if(locationData.status === "OK"){
            const inputDateTime = locationData.formatted;
            const formattedDateTime = formatDateTime(inputDateTime);
            
            day.innerText = formattedDateTime;
        }
        
        city.innerText = `${searchedLocation}, ${country}`;

        description.innerText = geoData.weather[0].main;
        icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${geoData.weather[0].icon}@4x.png" />`;
        
        originalTemps = {
            temperature: `${geoData.main.temp_min}\u00B0`,
            minTemperature: `${geoData.main.temp_min}\u00B0`,
            maxTemperature: `${geoData.main.temp_max}\u00B0`,
            actual: `${geoData.main.feels_like}\u00B0`,
        };

        temperature.innerText = originalTemps.temperature;
        minTemperature.innerText = originalTemps.minTemperature;
        maxTemperature.innerText = originalTemps.maxTemperature;
        actual.innerText = originalTemps.actual;

        humidity.innerText = `${geoData.main.humidity}%`;
        pressure.innerText = `${geoData.main.pressure} hPa`;
        wind.innerText = `${geoData.wind.speed} m/s`;

        document.getElementById("input").value = ""; // Reset Input Data
    }
    catch(err){
        // console.log(err);
    }

}

// Function to convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
}

// Function to convert Fahrenheit to Celsius
const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * 5/9;
}

// current Degree -> Celsius
let degree = document.querySelectorAll(".degree");
let fahrenheit = document.querySelector("#fahrenheit");
let celsius = document.querySelector("#celsius");

// conversion to Fahrenheit
degree[1].addEventListener("click", () => {
    temperature.innerText = convertAndDisplay(celsiusToFahrenheit, originalTemps.temperature);
    minTemperature.innerText = convertAndDisplay(celsiusToFahrenheit, originalTemps.minTemperature);
    maxTemperature.innerText = convertAndDisplay(celsiusToFahrenheit, originalTemps.maxTemperature);
    actual.innerText = convertAndDisplay(celsiusToFahrenheit, originalTemps.actual);

    // change styling
    fahrenheit.style.fontSize = "1.5rem";
    fahrenheit.style.fontWeight = "900";

    // revert style
    celsius.style.fontSize = "1rem";
    celsius.style.fontWeight = "400";
});

// conversion to Celsius
degree[0].addEventListener("click", () => {
    temperature.innerText = originalTemps.temperature;
    minTemperature.innerText = originalTemps.minTemperature;
    maxTemperature.innerText = originalTemps.maxTemperature;
    actual.innerText = originalTemps.actual;

    // change styling
    celsius.style.fontSize = "1.5rem";
    celsius.style.fontWeight = "900";

    // revert style
    fahrenheit.style.fontSize = "1rem";
    fahrenheit.style.fontWeight = "400";
});

// Helper function to convert and display
const convertAndDisplay = (conversionFunction, value) => {
    // Parse the value into a number, if possible
    const numericValue = parseFloat(value);
    
    // Check if the parsing was successful (not NaN)
    if (!isNaN(numericValue)) {
        // Perform the conversion, limit to two decimal digits, and return the formatted result
        return `${conversionFunction(numericValue).toFixed(2)}\u00B0`;
    } else {
        // Handle the case where parsing fails, for example, by returning the original value
        // console.error("Invalid numeric value:", value);
        return value;
    }
};

// Click Event
let desiredLocation = document.querySelector(".desiredLocation");
desiredLocation.addEventListener("submit", (e) => {
    currentWeather(e);
});

window.addEventListener('load', (e) => {
    currentWeather(e);
});
