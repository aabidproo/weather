const apiKey = "0cffae8f844690774eea74501ea57020"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="


// Making serach functionality
const search_city = document.querySelector(".search input")
const search_city_btn = document.querySelector(".search button")


// Default City Weather
const city = "Marion"
let currentcity = true;

if (currentcity) {
    weather(city)
    currentcity = false
}


// Formatting & displaying date
const date = new Date();

function formateDate(date) {

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${monthName} ${day}, ${year}`
}

const formattedDate = formateDate(date);
// console.log(formattedDate);


// Function to fetch data from API
async function weather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`)
    var data = await response.json();

    // Fetching Icon
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`

    // if(data.weather[0].main === "Rain")  {
    //      weather_img = data.weather[0].icon
    // }

    console.log(data);
    document.querySelector("#city_name").innerHTML = data.name + ", " + data.sys.country;
    document.querySelector("#temperature").innerHTML = (data.main.temp).toFixed(0) + "°C";
    document.querySelector("#weather_type").innerHTML = data.weather[0].main;
    document.querySelector("#humidity_data").innerHTML = data.main.humidity + "%";
    document.querySelector("#pressure_data").innerHTML = data.main.pressure + " hpa";
    document.querySelector("#windspeed_data").innerHTML = data.wind.speed + " m/s";
    document.querySelector("#weather_img").src = iconUrl;
    document.querySelector("#date").innerHTML = formattedDate;

}

search_city_btn.addEventListener("click", () => {
    weather(search_city.value);
})

weather();