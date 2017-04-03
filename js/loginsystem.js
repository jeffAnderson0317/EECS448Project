function SubmitForm(){
    var user = {};
    user.username = $('#username').val();
    user.password = $('#password').val();
    user.isOwner = $('#owner').is(':checked');

    if (user.username != ""){
        $.ajax({
            url: "login",
            type: "POST",
            data: user,
            dataType: "json",
            success: function (result) {
                alert("You have signed up!");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Could not sign up correctly");
            }
        });
    }
    else{
        alert("Username and password fields were left blank.");
    }
}