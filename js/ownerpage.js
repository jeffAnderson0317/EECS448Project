//Written and Debugged by: Jeff Anderson
//Tested by: All project members

//Get all the information for the owners bar display it in the form.
$.ajax({
    url: "ownerGet",
    type: "POST",
    dataType: "json",
    success: function (result) {
        if (!result.msg){
            document.getElementById("BarName").value = result.BarName;
            document.getElementById("Location").value = result.Location;
            document.getElementById("Specials").value = result.Specials;
            document.getElementById("Reviews").value = result.Reviews;
            if(result.ImageFile1){
                $('#ImageFile1').parent().append('<img style="width: 35%;" src="' + result.ImageFile1 + '"/>');
            }
            if(result.ImageFile2){
                $('#ImageFile2').parent().append('<img style="width: 35%;" src="' + result.ImageFile2 + '"/>');
            }
        }
        else{
            
        }
    },
    error: function (xhr, ajaxOptions, thrownError) {
        alert("Error when getting owner information.");
    }
});