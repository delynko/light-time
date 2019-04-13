var socket = io();

let startTime;
let endTime;
let duration;
let dateTime;
let latitude;
let longitude;
let direction;
let tripStartTime;
let tripEndTime;
let tripStartCoords;
let tripEndCoords;

const options = {
    enableHighAccuracy: true
}

$('#north').click((e) => {
    getData(e);
});

$('#east').click((e) => {
    getData(e);
});

$('#west').click((e) => {
    getData(e);
});

$('#south').click((e) => {
    getData(e);
});

$('#stop').click((e) => {
    stop();
});

$("#trip").click((e) => {
    trip()
});

$("#end-trip").click((e) => {
    endTrip();
});

const getData = (e) => {
    direction = e.target.id;
    startTime = new Date();
    navigator.geolocation.getCurrentPosition(function(position, options) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    });
    dateTime = new Date().toLocaleString("en-US", {timeZone: "America/Denver"});
}

const stop = () => {
    endTime = new Date();
    duration = (endTime - startTime) / 1000;
    let stopData = {
        date: dateTime,
        direction,
        duration,
        latitude,
        longitude,
    }
    setTimeout(()=>{
        socket.emit('lightData', stopData);
    }, 1000)
}

const trip = () => {
    tripStartTime = new Date();
    tripDOW = new Date().getDay();
    navigator.geolocation.getCurrentPosition(function(position, options) {
        tripStartCoords = [position.coords.latitude, position.coords.longitude]
    });
    let d = new Date().getTime();
    setTimeout(() => {
        socket.emit('new-trip', [d, tripStartCoords, tripStartTime, tripDOW]);
    }, 5000);
}

const endTrip = () => {
    tripEndTime = new Date();
    tripDuration = (tripEndTime - tripStartTime) / 1000;
    navigator.geolocation.getCurrentPosition(function(position, options) {
        tripEndCoords = [position.coords.latitude, position.coords.longitude]
    });
    setTimeout(() => {
        socket.emit('end-trip', [tripEndCoords, tripDuration]);
    }, 5000);
}