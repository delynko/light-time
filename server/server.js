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
    tripid: Number,
    date: String,
    direction: String,
    duration: Number,
    latitude: Number,
    longitude: Number,
});

const lightTime = mongoose.model('lightTime', lightSchema);

module.exports = lightTime;

app.use(express.static(path.join(__dirname, '../public')));

app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "hbs");

app.get('/', (req, res) => {
    res.render('index.hbs');
});

io.on('connection', (socket) => {
    console.log('connected');

    let tripId;

    socket.on('new-trip', (d) => {
        tripId = d;
    });

    socket.on('lightData', (stopData) => {
        let light = new lightTime({
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
});

server.listen(port, () => {
    console.log(`listening on ${port}`)
});