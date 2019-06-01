function hideShow(divname) {
  console.log(divname);
    var x = document.getElementById(divname);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  } 