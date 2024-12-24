const apiKey = "0cffae8f844690774eea74501ea57020"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="
const geoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";



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

    // console.log(data);
    document.querySelector("#city_name").innerHTML = data.name + ", " + data.sys.country;
    document.querySelector("#temperature").innerHTML = (data.main.temp).toFixed(0) + "°C";
    document.querySelector("#weather_type").innerHTML = data.weather[0].main;
    document.querySelector("#humidity_data").innerHTML = data.main.humidity + "%";
    document.querySelector("#pressure_data").innerHTML = data.main.pressure + " hpa";
    document.querySelector("#windspeed_data").innerHTML = data.wind.speed + " m/s";
    document.querySelector("#weather_img").src = iconUrl;
    document.querySelector("#date").innerHTML = formattedDate;
    document.querySelector(".weather-app").style.display = "block"
}



// Fetch city suggestions using OpenWeather Geocoding API
async function fetchCitySuggestions(query) {
    try {
        const response = await fetch(`${geoApiUrl}${query}&limit=5&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error("Error fetching suggestions.");
        }
        return await response.json(); // Returns an array of cities
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Event listener for search input
document.querySelector("#search_field").addEventListener("input", async (e) => {
    const query = e.target.value;
    const suggestionsBox = document.querySelector(".suggestions");

    suggestionsBox.innerHTML = ""; // Clear previous suggestions

    if (query.length > 2) { // Fetch suggestions if input length > 2
        const suggestions = await fetchCitySuggestions(query);

        suggestions.forEach((city) => {
            const suggestionItem = document.createElement("div");
            suggestionItem.textContent = `${city.name}, ${city.country}`;
            suggestionItem.style.padding = "16px";
            suggestionItem.style.cursor = "pointer";

            // Click event for selecting suggestion
            suggestionItem.addEventListener("click", () => {
                document.querySelector("#search_field").value = city.name;
                weather(city.name); // Fetch weather for the selected city
                suggestionsBox.innerHTML = ""; // Clear suggestions
            });

            suggestionsBox.appendChild(suggestionItem);
        });
    }
});



// Making Search Functionality
document.querySelector("#search_btn").addEventListener("click", () => {
    let input = document.querySelector("#search_field").value;
    weather(input)
})

weather("Marion");