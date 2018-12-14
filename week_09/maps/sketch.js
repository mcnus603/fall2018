
//Google Maps and Craigslist Final

var startCity= "newyork";
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
    center:  {lat: 40.7127753, lng: -74.0059728}, 
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
        stylers: [{color: '#000000'}, {lightness: 60}]
      },
      {
        featureType : 'landscape',
        elementType : 'geometry.fill',
        stylers : [{color: '#000000'}, {lightness: 70}]
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
        stylers : [{color: '#000000'}, {lightness: 80}]
      },
      {
        featureType : 'road.local',
        elementType : 'geometry.fill',
        stylers : [{color: '#000000'}, {lightness: 80}]
      },
      {
        featureType : 'road.arterial',
        elementType : 'geometry.fill',
        stylers : [{color: '#000000'}, {lightness: 80}]
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
    var pin = {
    url: "assets/marker.png", // url
    scaledSize: new google.maps.Size(10, 10), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
};
    var marker = new google.maps.Marker({position: both, map: map, icon: pin});
    //add an id?
    marker.metadata = {id: i};

    marker.addListener('click', function(){
      // console.log(this);
      var index = this.metadata.id;
      var cityClicked = cityInfo[index][0];

      cityClick(cityClicked);
    });

  }
}


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
  var theImageLinks = document.getElementsByClassName('anImgLink');
  var links = document.getElementsByClassName("aTextLink");
  var errorImage = document.getElementById("errorImage");
  var errorText = document.getElementById("errorText");

  //errors
  if(errorImage) {
    console.log(errorImage);
    document.getElementById('images').removeChild(errorImage);
  }
  if(errorText) {
    document.getElementById('text').removeChild(errorText);
  }


  //backgrounds and images
  for(var i = theImageLinks.length; i >= 0; i--) {
    var thisImage = theImgs[i];

    var thisLink = theImageLinks[i];

    if(thisLink) {

      thisLink.removeChild(thisImage);
    }
    if(thisLink) {
      
      document.getElementById('images').removeChild(thisLink);
    }
  }

  //title
  for(var i = theTitle.length; i >= 0; i--) {
    var thisTitle = theTitle[i];
    var thisLink = links[i];
    
    if(thisTitle) {
      thisLink.removeChild(thisTitle);
    }
  }
  //text
  for(var i = theText.length; i >= 0; i--) {
    var thisText = theText[i];
    var thisLink = links[i];

    if(thisText) {
      thisLink.removeChild(thisText);
    }
  }
  //date
  for(var i = theDate.length; i >= 0; i--) {
    var thisDate = theDate[i];
    var thisLink = links[i];

    if(thisDate) {
      thisLink.removeChild(thisDate);
    }

        if(thisLink) {
      document.getElementById('text').removeChild(thisLink);
    }
  }

  rss(newCity);
}

//CRAIGSLIST

function rss (city) {

  changeBanner(city);

  var freeURL =  "'" + "https://" + city + ".craigslist.org/search/zip?format=rss&hasPic=1" + "'";
  var allURL =  "'" + "https://" + city + ".craigslist.org/search/sss?format=rss&hasPic=1" + "'";
  var missingURL =  "'" + "https://" + city + ".craigslist.org/search/ccc?format=rss" + "'";
  var freeStatement = "select * from feed where url =" + freeURL;
  var missingStatement = "select * from feed where url =" + missingURL;
  var allStatement = "select * from feed where url =" + allURL;

  //FREE STUFF

  $.queryYQL(allStatement, "json", undefined, function(data){

    var allFreeImgs = data.query.results.item;

    if(allFreeImgs.length === undefined) {
      console.log("no images!!! ");
        $('#images').append(`
        <p id = "errorImage"> 

          Uh oh. Looks like there is nothing for sale here.

          </p>

        `
        )

    } else {

      for (var i = 0; i < allFreeImgs.length; i++) {

      var img = allFreeImgs[i].enclosure.resource;
      var description = allFreeImgs[i].description;
      var link = allFreeImgs[i].link;

      $('#images').append(`
        <a href = ${link} target="_blank" class = "anImgLink">
          <img src = ${img} class = "free"> 
        </a>
      `)
      }
    }


  }); 

  //MISSED CONNECTIONS
  $.queryYQL(missingStatement, "json", undefined, function(data){

    var allTheText = data.query.results.item;
  

    if (allTheText.length === undefined) {
      console.log("no text!!! ");

      $('#text').append(`
        <p id = "errorText"> 

          Uh oh. Looks like there is nothing for sale here.

          </p>

        `
        )
    } else {

        for(var i = 0; i < allTheText.length; i++) {
        var link = allTheText[i].link;
        var title = allTheText[i].title[0];
        var date = allTheText[i].date;
        var description = allTheText[i].description;

      $('#text').append(`
          <a href = ${link} class = "aTextLink" target="_blank">
            <p class = "missedDate"> ${date}</p>
            <p class = "missedTitle"> ${title} </p>
            <p class = "missedDescrip"> ${description} <br/> <br/><br/></p>
          <a/>

        `)
      }
    }

  }); 
}
//call craislist for the first time
$(document).ready(function(){
  rss(startCity);
});


function changeBanner(city) {
 var banner1 = document.getElementById('bannerText1');
 var banner2 = document.getElementById("bannerText2");

 var multipleCity = city;
 for(var i = 0; i < 80; i ++ ) {
  multipleCity += ( " " + city + " ");
 }

 banner1.innerText = multipleCity;
 banner2.innerText = multipleCity;
}

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


//NO RECENT POSTS POSTS
