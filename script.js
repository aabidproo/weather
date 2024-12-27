const apiKey = "0cffae8f844690774eea74501ea57020"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="



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



// Function to fetch data from API
async function weather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`)
        if (!response.ok) {
            document.querySelector(".error-box").style.display = "flex"
            document.querySelector(".weather-app").style.display = "none"
        }

        var data = await response.json();

    } catch (error) {
        console.log(error)
    }

    // Fetching Icon
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`

    console.log(data);
    document.querySelector("#city_name").innerHTML = data.name + ", " + data.sys.country;
    document.querySelector("#temperature").innerHTML = (data.main.temp).toFixed(0) + "°C";
    document.querySelector("#weather_type").innerHTML = data.weather[0].main;
    document.querySelector("#weather_description").innerHTML = data.weather[0].description;
    document.querySelector("#humidity_data").innerHTML = data.main.humidity + "%";
    document.querySelector("#pressure_data").innerHTML = data.main.pressure + " hpa";
    document.querySelector("#windspeed_data").innerHTML = data.wind.speed + " m/s";
    document.querySelector("#weather_img").src = iconUrl;
    document.querySelector("#date").innerHTML = formattedDate;
    document.querySelector(".weather-app").style.display = "block"
}



// Making Search Functionality
document.querySelector("#search_btn").addEventListener("click", () => {
    let input = document.querySelector("#search_field").value;
    weather(input)
})

weather("Marion");