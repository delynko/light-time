require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const hbs = require('hbs');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

mongoose.connect(process.env.MLAB_URI, {useNewUrlParser: true});

const Schema = mongoose.Schema;
const lightSchema = new Schema({
    type: String,
    tripid: Number,
    date: String,
    direction: String,
    duration: Number,
    latitude: Number,
    longitude: Number,
});

const tripSchema = new Schema({
    type: String,
    tripid: Number,
    duration: Number,
    startCoords: Array,
    endCoords: Array
});

const lightTime = mongoose.model('lightTime', lightSchema);
const tripData = mongoose.model('tripData', tripSchema);

module.exports = lightTime;
module.exports = tripData;

app.use(express.static(path.join(__dirname, '../public')));

app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "hbs");

app.get('/', (req, res) => {
    res.render('index.hbs');
});

io.on('connection', (socket) => {
    console.log('connected');

    let tripId;
    let tripStartTime;
    let tripStartCoords;
    let tripEndCoords;

    socket.on('new-trip', (d) => {
        tripId = d[0]
        tripStartCoords = d[1];
        tripStartTime = d[2];
    });

    socket.on('lightData', (stopData) => {
        let light = new lightTime({
            type: 'stop',
            tripid: tripId,
            date: stopData.date,
            direction: stopData.direction,
            duration: stopData.duration,
            latitude: stopData.latitude,
            longitude: stopData.longitude
        });
        light.save((err) => {
            if (err) throw err;
        });
    });

    socket.on('end-trip', (endData) => {
        tripEndCoords = endData[0];
        tripDur = endData[1]
        let trip = new tripData({
            type: 'trip',
            tripid: tripId,
            duration: tripDur,
            startCoords: tripStartCoords,
            endCoords: tripEndCoords
        });
        trip.save((err) => {
            if (err) throw err;
        });
    })
});

server.listen(port, () => {
    console.log(`listening on ${port}`)
});