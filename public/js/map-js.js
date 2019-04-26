let map = L.map('map').setView([39.75471275080197, -105.22155761718751], 10);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZGVseW5rbyIsImEiOiJjaXBwZ3hkeTUwM3VuZmxuY2Z5MmFqdnU2In0.ac8kWI1ValjdZBhlpMln3w'
}).addTo(map);

fetch('/data')
    .then((res) => {
        return res.json();
    })
    .then((result) => {
        let lightData = JSON.parse(result[1]);
        lightData.forEach(e => {
            console.log(e);
            L.marker([e.latitude, e.longitude])
            .bindPopup(`Date: ${e.date}<br>
                        Duration: ${e.duration}`)
            .addTo(map);

        });
    });
