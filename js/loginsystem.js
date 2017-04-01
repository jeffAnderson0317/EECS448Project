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
                    },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    }
    else{
        alert("Username and password fields were left blank.");
    }
}