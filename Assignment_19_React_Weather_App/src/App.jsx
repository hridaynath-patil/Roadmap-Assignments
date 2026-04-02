import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      // Step 1: Geocode the city
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      if (!geoRes.ok) throw new Error('Failed to fetch location data');
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found. Please check your spelling.');
      }

      const location = geoData.results[0];
      const { latitude, longitude, name, country } = location;

      // Step 2: Fetch weather for lat/lon
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      if (!weatherRes.ok) throw new Error('Failed to fetch weather data');
      const weatherJson = await weatherRes.json();

      setWeatherData({
        name,
        country,
        temperature: weatherJson.current_weather.temperature,
        windspeed: weatherJson.current_weather.windspeed,
        weathercode: weatherJson.current_weather.weathercode
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to map Open-Meteo weather codes to words
  const getWeatherDescription = (code) => {
    if (code === 0) return 'Clear sky';
    if (code === 1 || code === 2 || code === 3) return 'Partly cloudy';
    if (code === 45 || code === 48) return 'Fog';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Rain';
    if (code >= 71 && code <= 75) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Unknown';
  };

  return (
    <div className="weather-container">
      <div className="weather-card">
        <h1 className="title">Weather Forecast</h1>
        
        <form onSubmit={fetchWeather} className="search-form">
          <input 
            type="text"
            className="search-input"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {loading && (
          <div className="status-container">
            <div className="spinner"></div>
            <p>Fetching weather data...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <p>{error}</p>
          </div>
        )}

        {weatherData && !loading && !error && (
          <div className="weather-info fade-in">
            <h2 className="city-name">{weatherData.name}, {weatherData.country}</h2>
            
            <div className="temp-container">
              <span className="temperature">{weatherData.temperature}°C</span>
            </div>

            <div className="weather-desc">
              {getWeatherDescription(weatherData.weathercode)}
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weatherData.windspeed} km/h</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Condition Code</span>
                <span className="detail-value">{weatherData.weathercode}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
