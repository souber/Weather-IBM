var pathToIcon, weatherUnit;

onload = init;

function init() {
	//draw initial outside look for the map
	DrawMap(44.5403,-78.5463,1);
}

//draw the map using the specified location's longitude, latitude, and a chosen zoom amount
function DrawMap(lat,lng, myZoom){
	var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: myZoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);		
}

//decide if we will search by zip or city
function FindWeather(input,unit){
	//if all the characters are numbers. it must be a zip
	if (isNaN(input) == false){
		WeatherByZip(input,unit);
	}else{
		WeatherByCity(input,unit);
	}	
}

//query by city
function WeatherByCity(city,unit){
	
	var myPath = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit ;
	
	var xhr = new XMLHttpRequest();	
	xhr.open("GET", myPath, true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				var r = JSON.parse(xhr.responseText);				
				var sameCity = r.name.toUpperCase() === city.toUpperCase()				
				if (sameCity == false)
					window.alert("There is no city with such name. We made the closest prediction.");
				
				//Create JSON object 
				var formulated_JSON_object = { 
				"coordinates":{"lon":r.coord.lon,"lat":r.coord.lat}, "currentConditions": r.weather[0]['description'],
				"temperature" : {"current":r.main.temp,"high":r.main.temp_max,"low":r.main.temp_min}};
				
				SetWeatherUnitSymbol(unit);
				SetWeatherIconPath(r.weather[0]['id']);								
				FillWidget(r.name, formulated_JSON_object.currentConditions,formulated_JSON_object.temperature.current,formulated_JSON_object.temperature.high,formulated_JSON_object.temperature.low,weatherUnit,pathToIcon);
				DrawMap(formulated_JSON_object.coordinates.lat,formulated_JSON_object.coordinates.lon,8);
				
			} else {
			}
		}else{
		}
	};
	xhr.onerror = function (e) {
	};
	xhr.send(null);	
}

function WeatherByZip(zip,unit){
	
	var myPath = "http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&units=" + unit ;
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", myPath, true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {				
				var r = JSON.parse(xhr.responseText);
				if ( r.cod == "404"){
					window.alert("Zip Code Not Found");
				}else{
					
					//Create JSON object
					var formulated_JSON_object = { 
						"coordinates":{"lon":r.coord.lon,"lat":r.coord.lat}, "currentConditions": r.weather[0]['description'],
						"temperature" : {"current":r.main.temp,"high":r.main.temp_max,"low":r.main.temp_min}};
																										
					SetWeatherUnitSymbol(unit);
					SetWeatherIconPath(r.weather[0]['id']);
				
					FillWidget(zip, formulated_JSON_object.currentConditions,formulated_JSON_object.temperature.current,formulated_JSON_object.temperature.high,formulated_JSON_object.temperature.low,weatherUnit,pathToIcon);
					DrawMap(formulated_JSON_object.coordinates.lat,formulated_JSON_object.coordinates.lon,13);					
				}				
			} else {
			}
		}else{
		}
	};
	xhr.onerror = function (e) {
	};
	xhr.send(null);	
}

function FillWidget(myLocation, myCondition, myTemp, myHTemp, myLTemp,myUnit,myIconPath){
	document.getElementById('unit-big').innerHTML = myUnit;
	document.getElementById('unit-small_1').innerHTML = myUnit;
	document.getElementById('unit-small_2').innerHTML = myUnit;	
	document.getElementById('location-condition').innerHTML = myLocation + "<br />" + myCondition;
	document.getElementById('temp').innerHTML = myTemp;
	document.getElementById('high-temp').innerHTML = "H: " + myHTemp;
	document.getElementById('low-temp').innerHTML = "L: " + myLTemp;
	document.getElementById("icon").src = myIconPath;	
}

//Set the weather symbol in the widget to either K, C, or F
function SetWeatherUnitSymbol(unitIdentifier){
	if (unitIdentifier == "Default")
		weatherUnit = "&#8490;";
	else if (unitIdentifier == "Metric")
		weatherUnit = "&#8451;";
	else
		weatherUnit = "&#8457;";	
}

//Find the right icon for the current weather
function SetWeatherIconPath(weatherId){	
	if (weatherId >= 200 && weatherId <= 232)
		pathToIcon = "img/200-232.png";
	else if (weatherId >= 300 && weatherId <= 321)
		pathToIcon = "img/300-321.png";
	else if (weatherId >= 500 && weatherId <= 504)
		pathToIcon = "img/500-504.png";
	else if (weatherId == 511)
		pathToIcon = "img/511.png";
	else if (weatherId >= 520 && weatherId <= 522)
		pathToIcon = "img/520-522.png";
	else if (weatherId >= 600 && weatherId <= 621)
		pathToIcon = "img/600-621.png";
	else if (weatherId >= 701 && weatherId <= 741)
		pathToIcon = "img/701-741.png";
	else if (weatherId == 800){
		if ((new Date).getHours() >= 6 && (new Date).getHours() <=18)
			pathToIcon = "img/800-d.png";
		else
			pathToIcon = "img/800-n.png";
	} else if (weatherId == 801){
		if ((new Date).getHours() >= 6 && (new Date).getHours() <=18)
			pathToIcon = "img/801-d.png";
		else
			pathToIcon = "img/801-n.png";
	}else if (weatherId == 802)
		pathToIcon = "img/802.png";
	else if (weatherId == 803){
		if ((new Date).getHours() >= 6 && (new Date).getHours() <=18)
			pathToIcon = "img/803-d.png";
		else
			pathToIcon = "img/803-n.png";
	} else if (weatherId == 804)
		pathToIcon = "img/804.png";	
	else
		pathToIcon = "img/Not-Available.png";		
}


