const { getWeatherForCity } = require('./open-weather-map-api');

exports.getWeatherByCity = city => getWeatherForCity(city, 'metric');