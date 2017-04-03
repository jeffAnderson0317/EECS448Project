var username = GetCookie("username");

if (username == ""){
    window.location.replace("/LoginGateway");
}
else {
    var isOwner = GetCookie("isowner")
    if (isOwner == ""){
        window.location.replace("/BarOwnerPage");
    }
}

function GetCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}