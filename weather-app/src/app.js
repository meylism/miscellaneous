const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const weather = require("./utils/weather");

const app = express();
const port = process.env.PORT || 3000;

//Path configs  
const publicPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates");

//Template engine and view configs
app.set('view engine', 'hbs');
app.set('views', templatesPath + "/views");
hbs.registerPartials(templatesPath + "/partials");

//Define static directory to serve
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.render('index', {
        title: "'I am index page'",
        footerTitle: "In the future you will see a lot of contents here"
    });
})

app.get('/weather', (req, res) => {
    if(!req.query.adress) return res.send({error: "Adress is missing"});

    geocode(req.query.adress, (error, {longitude, latitude, location} = {}) => {
        if(error) return res.send({error});
        weather(longitude, latitude, (error, weatherData) => {
                if(error) return res.send({error});
                res.send({weather: weatherData})
        });
    })
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: "'I am about page'",
        footerTitle: "In the future you will see a lot of contents here"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: "'I am helping page'",
        footerTitle: "In the future you will see a lot of contents here"
    });
})

app.get('*', (req, res) => {
    res.render('404', {
        title: "404"
    });
})

app.listen(port, () => {
    console.log("Server started.")
})