function WindowBind(marker, map, infowindow, html, pinloc) {
    marker.addListener('click', function() {
        infowindow.setContent(html);
        infowindow.open(map, this);
    
        Cookie.set('bar-selected', pinloc);
    });
}

function initMap() {
        
    window.navigator.geolocation.getCurrentPosition(show_map);
    
    function show_map(position,favorites) { 
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
                SetCurrentLocationMarker(myLatLng, map, coords)  
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error getting map. Please contact j714a273@ku.edu for support (Server error).");
            }
        });
    }
}

function SetCurrentLocationMarker(myLatLng, map, coords){
    var currentMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Current Location'
    });    
}

function SetMarkers(results, myLatLng, map){
    var favorites = results[results.length -1];
    for(var i = 0; i < results.length - 1; i++){
        let position = { lat: results[i].latitude, lng: results[i].longitude };

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: '/images/baricon.png',
            title: results[i].BarName
        });
        var spec = results[i].Specials;

        spec = spec.replace(/(?:\r\n|\r|\n)/g, '<br>');

        let dist = distance(position.lat, position.lng, myLatLng.lat, myLatLng.lng, 'M');

        var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">' + results[i].BarName + '</h1>' +
        '<h2>' + (parseFloat(Math.round(dist * 100) / 100).toFixed(2)) + ' miles away.</h2>' +
        '<h3>' +
	    '<input type="button" value="More Information" id="submit" onclick="viewSpecialsPage(' + results[i].UserID + ')\"/>';
        if (favorites.includes(results[i].UserID)){
            contentString += '<input type="button" value="Remove From Favorites" id="submit" class="Bar-' + results[i].UserID + '" onclick="RemoveFromFavorites(' + results[i].UserID + ',\'' + results[i].BarName + '\', \'' + spec + '\')\"/>';
            AddToFavoritesBar(results[i].UserID, results[i].BarName, spec);
        }
        else
            contentString += '<input type="button" value="Add To Favorites" id="submit" class="Bar-' + results[i].UserID + '" onclick="AddToFavorites(' + results[i].UserID + ',\'' + results[i].BarName + '\', \'' + spec + '\')\"/>';
        contentString += '</h3></div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        
        WindowBind(marker, map, infowindow, contentString, position);
    }
}

function AddToFavoritesBar(bid, bname, specials){
    var html = '<div class="col-md-12"><div class="col-md-2"></div><div class="col-md-8 bar-fav bar-' + bid + '-fav">';
    html += '<div class="bar-name">' + bname + '</div>';
    html += '<div class="bar-specials">' + specials + '</div>';
    html += '</div><div class="col-md-2"></div></div>';
    $('.favorites').append(html);
}

function AddToFavorites(bid, bname, specials){
    var favorite = { BarID: bid };
    $.ajax({
        url: "addFavorite",
        type: "POST",
        data: favorite,
        dataType: "json",
        success: function (result) {
            if (result.err){
                alert("Error updating user's favorites.");
            }
            else{
                $('.Bar-' + bid).val("Remove From Favorites");
                //$('.Bar-' + bid).onsubmit(removeFromFavorites(bid));
                $('.Bar-' + bid).removeAttr('onclick');
                
                $('.Bar-' + bid).attr('onclick', 'RemoveFromFavorites(' + bid + ',\'' + bname + '\', \'' + specials + '\')');
                AddToFavoritesBar(bid, bname, specials);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error when updating user's favorites.");
        }
    });
}

function RemoveFromFavorites(bid, bname, specials){
    var favorite = { BarID: bid };
    $.ajax({
        url: "removeFavorite",
        type: "POST",
        data: favorite,
        dataType: "json",
        success: function (result) {
            if (result.err){
                alert("Error updating user's favorites.");
            }
            else{
                $('.Bar-' + bid).val("Add to Favorites");
                //$('.Bar-' + bid).onsubmit(removeFromFavorites(bid));
                $('.Bar-' + bid).removeAttr('onclick');
                $('.Bar-' + bid).attr('onclick', 'AddToFavorites(' + bid + ',\'' + bname + '\', \'' + specials + '\')');
                $('.bar-' + bid + '-fav').remove();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error when updating user's favorites.");
        }
    });
}

function viewSpecialsPage(uid) {
	document.cookie = "MoreInfoUserID=" + encodeURIComponent(uid) + ";";
    window.location.assign('/MoreInfo');
}

function DegreesToRadians(degrees){
    return (Math.PI * degrees) / 180;
}