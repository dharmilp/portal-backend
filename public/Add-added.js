function change()
{
    console.log("Done");
    var element = document.getElementById("Add");
    if( element.value == "ADD" ) element.value = "ADDED";        
    else if( element.value == "ADDED" ) element.value = "ADD";
}