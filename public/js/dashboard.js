fetch('/data')
    .then((res) => {
        return res.json();
    })
    .then((result) => {
        let tripDuration = 0;
        let lightDuration = 0;
        let tripData = JSON.parse(result[0]);
        let lightData = JSON.parse(result[1]);
        tripData.forEach((x) => {
            tripDuration += x.duration;
        });
        lightData.forEach((d) => {
            lightDuration += d.duration;
        })
        setTimeout(() => {
            $('#data').html(`Total number of trips: ${tripData.length}<br>
                            Total time driving: ${(tripDuration / 60).toFixed(2)} minutes<br>
                            Total number of red lights stopped at: ${lightData.length}<br>
                            Time spent stopped at red lights: ${(lightDuration / 60).toFixed(2)} minutes`)
        }, 1000);
    });