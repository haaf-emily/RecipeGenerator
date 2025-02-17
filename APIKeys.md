Google API Key:
-> return JSON: https://maps.googleapis.com/maps/api/geocode/json?address={${street+name},+${city},+${country}}&key=YOUR_API_KEY

Ninja API Key:
-> Test call (need to add header):
fetch('https://api.api-ninjas.com/v1/weather?lat=${latitude}&lon=${longitude}', {
method: 'GET',
headers: {
'X-Api-Key': 'tD432pNJCwYy/xXJgEstww==WQtR2R2rq5n9zjM9'
}
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));

Weather alternative:
https://weatherstack.com/
