const request = require("request");

const weather = (longitude, latitude, callback) => {
    const key = "c23be6e920c74e1462704041de3a25f8";
    const url = `https://api.darksky.net/forecast/${key}/${latitude},${longitude}?units=si`;

    request({url, json: true}, (error, response) => {
        if(error) {
            callback("Error occurred while connecting to the API", undefined);
        } else if(response.body.error) {
            callback("Weather information can not be found!", undefined);
        } else {
            const temperature = response.body.currently.temperature;
            const location = response.body.timezone;
            callback(undefined, {temperature, location})
        }
    })
}

module.exports = weather;
