var Timer;
var TotalSeconds;
var durationInMinutesString = document.getElementById("quizTimer").getAttribute('value');
var durationInMinutesInt = parseInt(durationInMinutesString);
var durationInSecondsInt = durationInMinutesInt * 60;
window.onload = CreateTimer("quizTimer", durationInSecondsInt);
function CreateTimer(TimerID, Time)
{
    Timer = document.getElementById(TimerID);
    TotalSeconds = Time;

    UpdateTimer();
    window.setTimeout("Tick()", 1000);
}

function Tick()
{
    if (TotalSeconds <= 0)
    {
        alert("Time's up!");
        submitQuiz();
        return;
    }

    TotalSeconds -= 1;
    UpdateTimer();
    window.setTimeout("Tick()", 1000);
}

function UpdateTimer() {
    var Seconds = TotalSeconds;
    var Days = Math.floor(Seconds / 86400);
    Seconds -= Days * 86400;
    var Hours = Math.floor(Seconds / 3600);
    Seconds -= Hours * (3600);
    var Minutes = Math.floor(Seconds / 60);
    Seconds -= Minutes * (60);
    var TimeStr = ((Days > 0) ? Days + " days " : "") + LeadingZero(Hours) + ":" + LeadingZero(Minutes) + ":" + LeadingZero(Seconds);
    Timer.innerHTML = 'Time Left : ' + TimeStr;
}


function LeadingZero(Time)
{
    return (Time < 10) ? "0" + Time : + Time;
}

function submitQuiz()
{
    document.getElementById('quizForm').submit();
}