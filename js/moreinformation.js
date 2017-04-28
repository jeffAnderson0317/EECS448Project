function getCookie(cname) {
	//Splits the cookie into an array of values
	var ca = document.cookie.split(';');
	var cnamea = " " + cname; //cname with a space before it
	for(var i = 0; i < ca.length; i++) {
		if(ca[i].split('=')[0] === cname || ca[i].split('=')[0] === cnamea) {
			return decodeURIComponent(ca[i].split('=')[1]);
		}
	}
	return "";
}

function deleteCookie(name) {
	//If the cookie exists, sets it to expire at a time that has already occurred
	if(getCookie(name) !== "") {
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
	}
}

function writeData(name, loc, image1, image2, specials) {
	//If there is a bar name detected, change the title and the header to the name
	if(name !== "") {
		document.getElementById("title").innerHTML = name;
		document.getElementById("header1").innerHTML = name;
	}
	//If there are images stored, display them. Otherwise don't display anything. The images are set to be centered and have a width of 70% of the screen (updates as the window size is changed).
	document.getElementById("image1").innerHTML = '<img src="' + image1 + '" style="display:block; margin: 0 auto; width: 50%" alt="">';
	document.getElementById("image2").innerHTML = '<img src="' + image2 + '" style="display:block; margin: 0 auto; width: 50%" alt="">';
	//If there are specials detected, display them. Otherwise, the default "Specials not found" will display
	if(specials !== "") {
		document.getElementById("specials").innerHTML = 'Specials: ' + specials;
	}
	//If there is an address detected, display it. Otherwise the default "Address not found" will display 
	if(loc !== "") {
		document.getElementById("address").innerHTML = 'Address: ' + loc;
	}
}

function redirectToMap() {
	//redirects the user to the map page
	window.location.assign('/');
}

function GetAndSetBarInfo(){
    //Gets the needed information from the cookies and stores it in the correct variables
    var BarID = { BarID: getCookie("MoreInfoUserID") };

    $.ajax({
        url: "getBarInfo",
        type: "POST",
        data: BarID,
        dataType: "json",
        success: function (result) {
            //Changes the html to display the data in the cookies
            writeData(result.BarName, result.Location, result.ImageFile1, result.ImageFile2, result.Specials);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error get local bar information.");
        }
    });
}

GetAndSetBarInfo();