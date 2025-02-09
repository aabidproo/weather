const apiKey = "0cffae8f844690774eea74501ea57020";
const apiUrl = "http://localhost/weather-v3/index.php?q=";

// Formatting & displaying date
const date = new Date();

function formateDate(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${monthName} ${day}, ${year}`;
}
const formattedDate = formateDate(date);

// Function to fetch data from API

async function weather(city) {
    try {
        let data;

        // Check if browser is online
        if (navigator.onLine) {
            const response = await fetch(apiUrl + city);
            if (!response.ok) {
                throw new Error("City not found");
            }
            data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Store the data in localStorage for offline use
            localStorage.setItem(city, JSON.stringify(data));
        } else {
            // Retrieve from localStorage if offline
            data = JSON.parse(localStorage.getItem(city));
            if (!data) {
                throw new Error("No data available for the city");
            }
        }

        // Fetching icon
        const icon = data[0].weather_img;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

        document.querySelector("#city_name").innerHTML = data[0].city_name;
        document.querySelector("#temperature").innerHTML = (data[0].temp) + "°C";
        document.querySelector("#weather_type").innerHTML = data[0].weather_type;
        document.querySelector("#weather_description").innerHTML = data[0].weather_desc;
        document.querySelector("#humidity_data").innerHTML = data[0].humidity_data;
        document.querySelector("#pressure_data").innerHTML = data[0].pressure_data + " hPa";
        document.querySelector("#windspeed_data").innerHTML = data[0].windspeed_data + " m/s";
        document.querySelector("#weather_img").src = iconUrl;
        document.querySelector("#date").innerHTML = formattedDate;
        document.querySelector(".weather-app").style.display = "block";
        document.querySelector(".error-box").style.display = "none";
    } catch (error) {
        console.error(error);
        document.querySelector(".error-box").style.display = "block";
        document.querySelector(".weather-app").style.display = "none";
    }
}


// Making Search Functionality
document.querySelector("#search_btn").addEventListener("click", () => {
    let input = document.querySelector("#search_field").value.trim();
    if (input) weather(input);
});

// Initial Call
weather("Marion");
