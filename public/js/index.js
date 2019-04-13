var socket = io();

let startTime;
let endTime;
let duration;
let dateTime;
let latitude;
let longitude;
let direction;

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
})

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
    let d = new Date().getTime();
    socket.emit('new-trip', d);
}