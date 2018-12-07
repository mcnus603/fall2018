
//Google Maps and Craigslist Final

var startCity= "atlanta";
var cities = ["atlanta", "austin","boston", "chicago", "dallas", "denver", "detroit", "houston", "lasvegas", "losangeles", "miami", "minneapolis", "newyork", "philadelphia", "phoenix", "portland", "raleigh", "sacramento", "sandiego", "seattle", "sfbayarea", "washdc" ];

var clCities;
var cityInfo = [];
var geocodeCounter = 0;
var loaded = false; 
var timer;
var map;
var locArray = [];

//GOOGLE MAPS
//init map

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9, 
    center:  {lat: 33.7490, lng: -84.3880}, 
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    styles: [
      {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{color: '#000000'}, {lightness: 80}]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{color: '#000000'}, {lightness: 80}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#3C3C3C'}]
      },
      {
        featureType : 'landscape',
        elementType : 'geometry.fill',
        stylers : [{color: '#000000'}, {lightness: 85}]
      },
      {
        featureType : 'all',
        elementType : 'labels.text.fill',
        stylers : [{color: '#000000'}, {lightness: 40}]
      },
      {
        featureType : 'all',
        elementType : 'labels.text.stroke',
        stylers : [{visibility: "off"}]
      },
      {
        featureType : 'all',
        elementType : 'labels.icon',
        stylers : [{visibility: "off"}]
      },
      {
        featureType : 'all',
        elementType : 'labels.icon',
        stylers : [{visibility: "off"}]
      },
      {
        featureType : 'road.highway',
        elementType : 'geometry.fill',
        stylers : [{color: '#000000'}, {lightness: 70}]
      },
      {
        featureType : 'road.local',
        elementType : 'geometry.fill',
        stylers : [{color: '#000000'}, {lightness: 70}]
      },
      {
        featureType : 'road.arterial',
        elementType : 'geometry.fill',
        stylers : [{color: '#000000'}, {lightness: 70}]
      },
      {
        featureType : 'road.highway',
        elementType : 'geometry.stroke',
        stylers : [{visibility: "off"}]
      },
    ]

  });

  makeMarkers();

}

$.getJSON("assets/cityLatLong.json", function(json){
  cityInfo = json.array;
  // console.log(cityInfo);

});

function makeMarkers() {

  for (var i = 0; i < cityInfo.length; i++) {
    var latitude =cityInfo[i][1];
    var longitude = cityInfo[i][2];

    var both = {lat: latitude, lng: longitude};
    var marker = new google.maps.Marker({position: both, map: map});
    //add an id?
    marker.metadata = {id: i};

    marker.addListener('click', function(){
      // console.log(this);
      var index = this.metadata.id;
      var cityClicked = cityInfo[index][0];
      console.log(cityClicked);

      cityClick(cityClicked);
    });

  }
}

   
//DEFAULT CITIES
//add cities to the DOM

// for (var i = 0; i < cities.length; i++) {
//   var city = cities[i];
//   var para = document.createElement('p'); 
//   para.className = "city";
//   para.innerHTML = city;
//   document.getElementById('banner').appendChild(para);
//   //add event lsiteners to them 
//   para.addEventListener("click",function() {
//     cityClick (this.innerText);
//   });
    
// }

function cityClick (text) {
  var theCity = text;
  clearContent(theCity);
}

function clearContent(city) {
  var newCity = city;
  var theImgs = document.getElementsByClassName('free');
  var theTitle = document.getElementsByClassName('missedTitle');
  var theText = document.getElementsByClassName('missedDescrip');
  var theDate = document.getElementsByClassName('missedDate');
  for(var i = theImgs.length; i >= 0; i--) {
    var thisImage = theImgs[i];
    if(thisImage) {
      document.getElementById('images').removeChild(thisImage);
    }
  }
  for(var i = theText.length; i >= 0; i--) {
    var thisText = theText[i];
    console.log(thisText);
    if(thisText) {
      document.getElementById('text').removeChild(thisText);
    }
  }
  for(var i = theTitle.length; i >= 0; i--) {
    var thisTitle = theTitle[i];
    console.log(thisTitle);
    if(thisTitle) {
      document.getElementById('text').removeChild(thisTitle);
    }
  }
  for(var i = theDate.length; i >= 0; i--) {
    var thisDate = theDate[i];
    console.log(thisDate);
    if(thisDate) {
      document.getElementById('text').removeChild(thisDate);
    }
  }
  rss(newCity);
}

//CRAIGSLIST

function rss (city) {
  //barter
  // craigslist.org/search/bar?format=rss
  //free
  //".craigslist.org/search/zip?format=rss&hasPic=1"
  var freeURL =  "'" + "https://" + city + ".craigslist.org/search/zip?format=rss&hasPic=1" + "'";
  var allURL =  "'" + "https://" + city + ".craigslist.org/search/sss?format=rss&hasPic=1" + "'";
  var missingURL =  "'" + "https://" + city + ".craigslist.org/search/ccc?format=rss" + "'";
  var freeStatement = "select * from feed where url =" + freeURL;
  var missingStatement = "select * from feed where url =" + missingURL;
  var allStatement = "select * from feed where url =" + allURL;

  //FREE STUFF
  $.queryYQL(allStatement, "json", undefined, function(data){

    var allFreeImgs = data.query.results.item;
    // console.log(data.query.results.item);

    for (var i = 0; i < allFreeImgs.length; i++) {
      // console.log(allFreeImgs[0].description);

      var img = allFreeImgs[i].enclosure.resource;
      var description = allFreeImgs[i].description;
      // console.log(description)
      $('#images').append(`
      <img src = ${img} class = "free"> 
      `)

    }
  }); 

  //MISSED CONNECTIONS
  $.queryYQL(missingStatement, "json", undefined, function(data){

    var allTheText = data.query.results.item;

    for(var i =0; i < allTheText.length; i++) {
      console.log(allTheText[i]);
      var title = allTheText[i].title[0];
      var date = allTheText[i].date;
      var description = allTheText[i].description;
    $('#text').append(`
      <p class = "missedDate"> ${date}</p>
      <p class = "missedTitle"> ${title} </p>
      <p class = "missedDescrip"> ${description}</p>

      `)
      // console.log(description);
    }

  }); 
}
//call craislist for the first time
$(document).ready(function(){
  rss(startCity);
});




//DONT NEED THIS -- ALREADY RAN IT ONCE AND GOT JSON


// $.getJSON("assets/craigslist.json", function(json) {
//   clCities = json.array;
//   var arrayLength = clCities.length;

//   timer = setInterval( function () {
//      geocodeForLoop(arrayLength)
// }, 1100);

// });

// function geocodeForLoop (max) {
//   var start = geocodeCounter
//   var end = geocodeCounter + 45;
//   console.log(geocodeCounter);

//   for (var i = start; i < end; i++) {

//     if(i < max) {
//       var city = clCities[i];
//       geocode(city); 
//     }
//   }

//   if(end < max) {
//     geocodeCounter+= 45;
//     // geocodeForLoop(max);
//   } else {
//     loaded = true;
//     clearInterval(timer);
//     console.log('all cities loaded');

//     makeMarkers();
//   }
// }

// function geocode(city) {

//   var location = city;
//   var request = "https://maps.googleapis.com/maps/api/geocode/json?address=" +  location +"&key=AIzaSyD90kLlEqkUGdBVHeH8YLc-lW2FTeqqbOc"; 
//   $.getJSON(request, function(data) {

//       var theData = data.results[0].geometry.location;
//       var lat = theData.lat;
//       var lng = theData.lng;

//       var array = [location, lat, lng];
//       cityInfo.push(array);

//       // console.log(array); 
//     // }

//   });

// }

