const express = require('express');
const router = express.Router();
const yelp = require('yelp');
const axios = require('axios');

const Oconsumer_key = process.env.CONSUMER_KEY;
const Oconsumer_secret = process.env.consumer_secret;
const Otoken = process.env.token;
const Otoken_secret = process.env.token_secret;

const Ogeolocation_key = process.env.geolocation_key
const Ogeocode_key = process.env.geocode_key

const Yelp = new yelp({
    consumer_key: Oconsumer_key,
    consumer_secret: Oconsumer_secret,
    token: Otoken,
    token_secret: Otoken_secret
});

/* GET users listing. */

router.get('/', function(req, res, next) {
    res.send('hi');
});

router.post('/', function(req, res, next) {
    axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${Ogeolocation_key}`)
        .then((response) => {
            //console.log(response)
            let located = response.data.location;
            let lat = located.lat;
            let lon = located.lng;
            //here we have the latitude and longitude data . . . hmm . . . we have to be able to plug that data into the Yelp search
            axios.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${Ogeocode_key}`)
                .then((response1) => {
                    console.log(response1.data.results[0].formatted_address);
                    let area = response1.data.results[0].formatted_address
                    Yelp.search({ term: `${req.body.name}`, location: area, radius_filter: 1609.34 })
                        .then(function(data) {
                            //console.log(data)
                            //console.log(data.businesses[0]);
                            let businesses = data.businesses;
                            res.render('results', { test: businesses });
                        })
                        .catch(function(err) {
                            console.error(err);
                        });
                });
        })
        .catch(function(err) {
            console.error(err)
        })
});

module.exports = router;
