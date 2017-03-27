var username = GetCookie("username");

if (username == ""){
    window.location.replace("http://localhost:3000/LoginGateway");
}
else {
    var isOwner = GetCookie("isowner")
    if (isOwner == ""){
        window.location.replace("http://localhost:3000/BarOwnerPage");
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