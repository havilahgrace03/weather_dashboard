function getWeatherIcon(code){
const icons={
0:'☀️',1:'🌤️',2:'⛅',3:'☁️',
45:'🌫️',48:'🌫️',
61:'🌧️',63:'🌧️',65:'🌧️',
71:'🌨️',73:'🌨️',75:'🌨️',
80:'🌦️',81:'🌧️',
95:'⛈️'
};
return icons[code] || '🌤️';
}

function getWeatherDescription(code){
const descriptions={
0:'Clear sky',
1:'Mainly clear',
2:'Partly cloudy',
3:'Overcast',
61:'Rain',
71:'Snow',
95:'Thunderstorm'
};
return descriptions[code] || 'Unknown';
}

async function getCoordinates(city){
const response=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
const data=await response.json();

if(!data.results){
throw new Error("City not found");
}

return{
lat:data.results[0].latitude,
lon:data.results[0].longitude,
name:data.results[0].name,
country:data.results[0].country
};
}

async function getWeather(lat,lon){
const response=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl&timezone=auto`);

return await response.json();
}

function updateCurrentWeather(location,weather){

const current=weather.current;

document.getElementById("location").textContent=`${location.name}, ${location.country}`;
document.getElementById("temperature").textContent=Math.round(current.temperature_2m)+"°C";
document.getElementById("description").textContent=getWeatherDescription(current.weather_code);
document.getElementById("currentIcon").textContent=getWeatherIcon(current.weather_code);
document.getElementById("feelsLike").textContent=Math.round(current.apparent_temperature)+"°C";
document.getElementById("humidity").textContent=current.relative_humidity_2m+"%";
document.getElementById("windSpeed").textContent=current.wind_speed_10m+" km/h";
document.getElementById("pressure").textContent=current.pressure_msl+" hPa";

}

async function searchWeather(){

const city=document.getElementById("cityInput").value;

const loading=document.getElementById("loading");
const content=document.getElementById("weatherContent");
const error=document.getElementById("errorMsg");

loading.style.display="block";
content.style.display="none";
error.style.display="none";

try{

const location=await getCoordinates(city);
const weather=await getWeather(location.lat,location.lon);

updateCurrentWeather(location,weather);

loading.style.display="none";
content.style.display="block";

}

catch(err){

loading.style.display="none";
error.style.display="block";
error.textContent=err.message;

}

}

document.getElementById("cityInput").addEventListener("keypress",function(e){
if(e.key==="Enter"){
searchWeather();
}
});

searchWeather();