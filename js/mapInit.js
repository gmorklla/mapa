var map;
var map_marker;
var lat = null;
var lng = null;
var lineCoordinatesArray = [];

var latId = document.getElementById("lat");
var lngId = document.getElementById("lng");

// sets your location as default
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
            var locationMarker = null;
            if (locationMarker) {
                // return if there is a locationMarker bug
                return;
            }

            lat = position.coords["latitude"];
            lng = position.coords["longitude"];

            // calls PubNub
            //pubs();

            // initialize google maps
            google.maps.event.addDomListener(window, 'load', initialize());
        },
        function(error) {
            console.log("Error: ", error);
        }, {
            enableHighAccuracy: true
        }
    );
}


function initialize() {
    console.log("Google Maps Initialized")
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 15,
        center: {
            lat: lat,
            lng: lng,
            alt: 0
        }
    });

    map_marker = new google.maps.Marker({
        position: {
            lat: lat,
            lng: lng
        },
        map: map
    });
    map_marker.setMap(map);
}

function getLocation() {
    console.log('Get location');
    navigator.geolocation.watchPosition(showPosition);
}

function showPosition(position) {
    map.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        alt: 0
    });
    map_marker.setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        alt: 0
    });

    latId.innerHTML = position.coords.latitude;
    lngId.innerHTML = position.coords.longitude;
}

var firebaseRef = new Firebase("https://gmorkllapos.firebaseio.com/");
var geoFire = new GeoFire(firebaseRef);

var ref = geoFire.ref(); // ref === firebaseRef

geoFire.set({
    "NATIVITAS 1, BENITO JUAREZ": [19.3798, -99.13811],
    "INDEPENDENCIA": [19.37814, -99.14242],
    "AMERICAS UNIDAS": [19.38129, -99.14344],
    "TLALPAN 4": [19.39142, -99.13816],
    "IZTACALCO 4": [19.38868, -99.11578],
    "JARDIN BALBUENA": [19.4187, -99.10632]
}).then(function() {
    console.log("Provided keys have been added to GeoFire");
}, function(error) {
    console.log("Error: " + error);
});

geoFire.get("INDEPENDENCIA").then(function(location) {
    if (location === null) {
        console.log("Provided key is not in GeoFire");
    } else {
        console.log("Provided key has a location of " + location);
    }
}, function(error) {
    console.log("Error: " + error);
});

function getRadio(arguments) {
    var geoQuery = geoFire.query({
        center: [map.getCenter().lat(), map.getCenter().lng()],
        radius: 5
    });

    var onReadyRegistration = geoQuery.on("ready", function() {
        console.log("GeoQuery has loaded and fired all other events for initial data");
    });

    var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
        console.log(key + " entered query at " + location + " (" + distance + " km from center)");
    });
}
