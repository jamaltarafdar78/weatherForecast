const rp = require('request-promise');

const API_KEY = '3a945637ecfbe56323f3cbde695ccd67';
const MODE = 'json';

const HOST = 'http://api.openweathermap.org';

const API_PATH = 'data/2.5/forecast';

const buildQueryStringObject= (city, units) => ({
    q: `${city},uk`,
    mode: MODE, 
    appid: API_KEY,
    units
});

const options = (city, units) => ({
    uri: `${HOST}/${API_PATH}`,
    qs: buildQueryStringObject(city, units),
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
});

const getWeatherForCity = (city, units) => new Promise((resolve) => {
    rp(options(city, units)).then(res => resolve(res.list));
});

exports.getWeatherForCity = getWeatherForCity;