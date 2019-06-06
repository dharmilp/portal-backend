function AddRemove(id)
{
    // when document is ready load this function
    $(document).ready(function() {
        var reqAddr = '/quiz/addQuizQuestion/' + id;
        // jQuery styled get request
        $.get(reqAddr,function(data,status) {
            if( document.getElementById(id).innerHTML == "ADD" )
            {
                document.getElementById(id).innerHTML = "ADDED";
                document.getElementById(id).className = "btn btn-success btn-round";
            }
            else if( document.getElementById(id).innerHTML == "ADDED" ) 
            {
                document.getElementById(id).innerHTML = "ADD";
                document.getElementById(id).className = "btn btn-primary btn-round";
            }
        });
    });
}

function editAddRemove(id)
{
    // when document is ready load this function
    console.log("success");
    $(document).ready(function() {
        var reqAddr = '/quiz/editQuizQuestion/' + id;
        // jQuery styled get request
        $.get(reqAddr,function(data,status) {
            console.log("Success");
            if( document.getElementById(id).innerHTML == "ADD" )
            {
                document.getElementById(id).innerHTML = "ADDED";
                document.getElementById(id).className = "btn btn-success btn-round";
            }
            else if( document.getElementById(id).innerHTML == "ADDED" ) 
            {
                document.getElementById(id).innerHTML = "ADD";
                document.getElementById(id).className = "btn btn-primary btn-round";
            }
        });
    });
}

function addQuizRemove(id)
{
    // when document is ready load this function
    $(document).ready(function() {
        var reqAddr = '/quiz/addQuizRemove/' + id;
        // jQuery styled get request
        $.get(reqAddr,function(data,status) {
            $("body").html(data);
        });
    });
}

function editQuizRemove(id)
{
    // when document is ready load this function
    $(document).ready(function() {
        var reqAddr = '/quiz/editQuizRemove/' + id;
        // jQuery styled get request
        $.get(reqAddr,function(data,status) {
            $("body").html(data);
        });
    });
}