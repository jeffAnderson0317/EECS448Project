function SubmitForm(){
    var user = {};
    user.username = $('#username').val();
    user.firstname = $('#firstname').val();
    user.lastname = $('#lastname').val();
    user.age = $('#age').val();
    user.email = $('#email').val();
    user.password = $('#password').val();
    user.isOwner = $('#owner').is(':checked');
    var fieldsFilled = true;

    $.each(user, function(){
        if(this.toString() == "" && this.toString() != null)
            fieldsFilled = false;
    });
    
    if (fieldsFilled && validateEmail(user.email)){
        $.ajax({
            url: "signup",
            type: "POST",
            data: user,
            dataType: "json",
            success: function (result) {
                    if (result.isSignedUp == "true"){
                        if(user.isOwner)
                            window.location.assign('/');
                        else{
                            window.location.assign('/')
                        }
                    }
                    else{
                        if (result.msg == "User already exists.")
                            alert("Username already exists! Please use a different username.");
                        else
                            alert("Error signing up. Please contact j714a273@ku.edu for support (Database error).");
                    }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Error signing up. Please contact j714a273@ku.edu for support (Server error).");
            }});
    }
    else{
        alert("Required fields incorrectly filled out.");
    }
    
    return false;
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}