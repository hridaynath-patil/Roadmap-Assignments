const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('errorMsg');
const weatherResult = document.getElementById('weatherResult');
const cityNameDisplay = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temperatureDisplay = document.getElementById('temperature');
const weatherDesc = document.getElementById('weatherDesc');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

// Helper dictionary for WMO Weather interpretation codes
const getWeatherCondition = (code) => {
    const weatherCodes = {
        0: { desc: 'Clear sky', icon: '☀️' },
        1: { desc: 'Mainly clear', icon: '🌤️' },
        2: { desc: 'Partly cloudy', icon: '⛅' },
        3: { desc: 'Overcast', icon: '☁️' },
        45: { desc: 'Fog', icon: '🌫️' },
        48: { desc: 'Depositing rime fog', icon: '🌫️' },
        51: { desc: 'Light drizzle', icon: '🌧️' },
        53: { desc: 'Moderate drizzle', icon: '🌧️' },
        55: { desc: 'Dense drizzle', icon: '🌧️' },
        61: { desc: 'Slight rain', icon: '🌧️' },
        63: { desc: 'Moderate rain', icon: '🌧️' },
        65: { desc: 'Heavy rain', icon: '🌧️' },
        71: { desc: 'Slight snow fall', icon: '🌨️' },
        73: { desc: 'Moderate snow fall', icon: '🌨️' },
        75: { desc: 'Heavy snow fall', icon: '❄️' },
        80: { desc: 'Slight rain showers', icon: '🌦️' },
        81: { desc: 'Moderate rain showers', icon: '🌧️' },
        82: { desc: 'Violent rain showers', icon: '⛈️' },
        95: { desc: 'Thunderstorm', icon: '🌩️' },
        96: { desc: 'Thunderstorm with slight hail', icon: '⛈️' },
        99: { desc: 'Thunderstorm with heavy hail', icon: '⛈️' }
    };
    return weatherCodes[code] || { desc: 'Unknown', icon: '🌍' };
};

const getWeatherData = async (city) => {
    // UI state reset
    weatherResult.classList.add('hidden');
    errorMsg.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        // Step 1: Geocoding API to get coordinates from city name
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        
        if (!geoResponse.ok) {
            throw new Error('Failed to fetch location data.');
        }

        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found. Please try again.');
        }

        const location = geoData.results[0];
        const lat = location.latitude;
        const lon = location.longitude;
        const resolvedCityName = location.name;

        // Step 2: Forecast API to get weather using coordinates
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        
        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data.');
        }

        const weatherData = await weatherResponse.json();
        const currentData = weatherData.current_weather;
        
        // Display data
        const condition = getWeatherCondition(currentData.weathercode);

        cityNameDisplay.textContent = resolvedCityName;
        weatherIcon.textContent = condition.icon;
        temperatureDisplay.textContent = `${currentData.temperature}°C`;
        weatherDesc.textContent = condition.desc;

        weatherResult.classList.remove('hidden');
    } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
};
