const request = require("request");

const geocode = (location, callback) => {
    const key = "pk.eyJ1IjoibWV5bGlzbWF0aSIsImEiOiJjazVwcHJ3YzUweG90M2xuc2x6cjhodDZ6In0.PtFHIXhcpJ_Ww1KtvkqnLA";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${key}&limit=1`

    request({url: url, json: true}, (error, response) => {
        if(error) {
            callback("Error occurred while connecting to the API.", undefined);
        } else if(response.body.features.length === 0) {
            callback("Can not find the location. Try writing another location..", undefined);
        } else {
            const longitude = response.body.features[0].geometry.coordinates[0];
            const latitude = response.body.features[0].geometry.coordinates[1];
            const location = response.body.features[0].place_name;
            callback(undefined, {longitude, latitude, location});
        }
    })
}

module.exports = geocode;