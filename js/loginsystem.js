function SubmitForm(){
    var user = {};
    user.username = $('#username').val();
    user.password = $('#password').val();
    user.isOwner = $('#owner').is(':checked');

    if (user.username != ""){
        var loader = document.getElementById("loader");
        $.ajax({
            url: "auth",
            type: "POST",
            data: user,
            dataType: "json",
            success: function (result) {
                loader.className = "";
                if(result.isValid == "true")
                    window.location.assign('/');
                else
                    alert("Incorrect password! Please try again.");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error when logging in.");
                loader.className = "";
            }
        });
        loader.className = "loader";
    }
    else{
        alert("Username and password fields were left blank.");
    }
    return false;
}