function WindowBind(marker, map, infowindow, html, pinloc) {
    marker.addListener('click', function() {
        infowindow.setContent(html);
        infowindow.open(map, this);
    
        Cookie.set('bar-selected', pinloc);
    });
}

function initMap() {

    window.navigator.geolocation.getCurrentPosition(show_map);
    
    function show_map(position) { 
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var dist = 15;
        var lon1 = longitude - dist/Math.abs(Math.cos(DegreesToRadians(latitude))*69);
        var lon2 = longitude + dist/Math.abs(Math.cos(DegreesToRadians(latitude))*69);
        var lat1 = latitude - (dist/69); 
        var lat2 = latitude + (dist/69);
        var myLatLng = {lat: latitude, lng: longitude};
        
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: myLatLng
        });

        data = {latitude: latitude, longitude: longitude, lon1: lon1, lon2: lon2, lat1: lat1, lat2: lat2};

        $.ajax({
            url: "getbars",
            type: "POST",
            data: data,
            dataType: "json",
            success: function (results) {
                SetMarkers(results, myLatLng, map);
                var coords = new google.maps.LatLng(latitude, longitude);
                map.setCenter(coords);
                map.panTo(coords);
                wins.setPosition(coords);
                wins.setContent('Location found');         
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error getting map. Please contact j714a273@ku.edu for support (Server error).");
            }
        });
    }
}

function SetMarkers(results, myLatLng, map){

    for(var i = 0; i < results.length; i++){
        let position = { lat: results[i].latitude, lng: results[i].longitude };

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: '/images/baricon.png',
            title: results[i].BarName
        });

        let dist = distance(position.lat, position.lng, myLatLng.lat, myLatLng.lng, 'M');

        var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">' + results[i].BarName + '</h1>' +
        '<h2>' + (parseFloat(Math.round(dist * 100) / 100).toFixed(2)) + ' miles away.</h2>'
        '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        
        WindowBind(marker, map, infowindow, contentString, position);
    }
    
    var wins = new google.maps.InfoWindow({map:map});

}

function DegreesToRadians(degrees){
    return (Math.PI * degrees) / 180;
}