<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$host = "localhost";
$username = "root";
$password = "";
$conn = mysqli_connect($host, $username, $password);

if (!$conn) {
    die(json_encode(["error" => "Connection Failed: " . mysqli_connect_error()]));
}

// Creating the database
$skycast_db = "CREATE DATABASE IF NOT EXISTS Skycast";
if (!mysqli_query($conn, $skycast_db)) {
    die(json_encode(["error" => "Failed creating database: " . mysqli_error($conn)]));
}

// Selecting the database
mysqli_select_db($conn, 'Skycast');

// Creating the table
$weather_tb = "CREATE TABLE IF NOT EXISTS Weather (
    city_name VARCHAR(255) PRIMARY KEY,
    temp VARCHAR(255),
    weather_type VARCHAR(255),
    weather_desc VARCHAR(255),
    humidity_data VARCHAR(255),
    pressure_data VARCHAR(255),
    windspeed_data VARCHAR(255),
    weather_img VARCHAR(255)
)";

if (!mysqli_query($conn, $weather_tb)) {
    die(json_encode(["error" => "Failed creating table: " . mysqli_error($conn)]));
}

// Validate the 'q' parameter
if (!isset($_GET['q']) || empty(trim($_GET['q']))) {
    die(json_encode(["error" => "City parameter is missing or empty."]));
}

$city = mysqli_real_escape_string($conn, trim($_GET['q']));

// Check if the city exists in the database
$select_results = "SELECT * FROM Weather WHERE city_name LIKE '%$city%' COLLATE utf8mb4_general_ci";
$results = mysqli_query($conn, $select_results);

// Fetch data from the API if the city is not found in the database
if (mysqli_num_rows($results) == 0) {
    $api_key = "0cffae8f844690774eea74501ea57020";
    $url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=" . urlencode($city) . "&appid=$api_key";

    // Get data from the API
    $response = @file_get_contents($url);

    if ($response === FALSE) {
        die(json_encode(["error" => "Failed to fetch data from the API."]));
    }

    $data = json_decode($response, true);

    if (isset($data['cod']) && $data['cod'] != 200) {
        die(json_encode(["error" => $data['message']]));
    }

    // Extract weather data
    $city_name = $data['name'];
    $temp = $data['main']['temp'];
    $weather_type = $data['weather'][0]['main'];
    $weather_desc = $data['weather'][0]['description'];
    $humidity = $data['main']['humidity'];
    $pressure = $data['main']['pressure'];
    $windspeed = $data['wind']['speed'];
    $image = $data['weather'][0]['icon'];

    // Insert data into the database
    $insert_data = "INSERT INTO Weather (city_name, temp, weather_type, weather_desc, humidity_data, pressure_data, windspeed_data, weather_img)
                    VALUES ('$city_name', '$temp', '$weather_type', '$weather_desc', '$humidity', '$pressure', '$windspeed', '$image')";

    if (!mysqli_query($conn, $insert_data)) {
        error_log("Error inserting data: " . mysqli_error($conn));
        die(json_encode(["error" => "Failed to store data in the database."]));
    }

    // Fetch the newly inserted data
    $select_results = "SELECT * FROM Weather WHERE city_name = '$city_name'";
    $results = mysqli_query($conn, $select_results);
}

// Return data (either from the database or newly fetched)
$rows = [];
while ($row = mysqli_fetch_assoc($results)) {
    $rows[] = $row;
}

header('Content-Type: application/json');
echo json_encode($rows);

?>
