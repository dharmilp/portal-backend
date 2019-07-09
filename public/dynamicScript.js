$(document).ready(function(){

		$(".divs .ques").each(function(e) {
		    if (e != 0)
				$(this).hide();
		});
		
		$("#next").click(function(){
			if ($(".divs .ques:visible").next().length != 0)
			{
				var activeEle = document.getElementsByClassName("active");
				activeEle[0].classList.remove("active");
				var questionIndex = $(".divs .ques:visible").index();
				var sCArray = document.getElementsByClassName("shortCut");
				sCArray[questionIndex + 1].classList.add("active");


				$(".divs .ques:visible").next().show().prev().hide();
			}
		    else {

			}
		    return false;
    	});
		$("#prev").click(function(){
			if ($(".divs .ques:visible").prev().length != 0)
			{

				var activeEle = document.getElementsByClassName("active");
				activeEle[0].classList.remove("active");
				var questionIndex = $(".divs .ques:visible").index();
				var sCArray = document.getElementsByClassName("shortCut");
				sCArray[questionIndex - 1].classList.add("active");

				$(".divs .ques:visible").prev().show().next().hide();
			}
			else {

			}
			return false;
		});

		$("#clearResponse").click(function(){
			var questionIndex = $(".divs .ques:visible").index();
			var questionName = 'a' + questionIndex;
			var ele = document.getElementsByName(questionName);
			for(var i=0;i<ele.length;i++)
			{
				ele[i].checked = false;
			}
			return false;
		});

		$(".shortCut").click(function(e){
			var questionNumber = $(this).attr("number");
			var qNo = parseInt(questionNumber);
			$(".divs .ques:visible").hide();
			var ele = document.querySelectorAll(".divs .ques");
			var activeEle = document.getElementsByClassName("active");
			activeEle[0].classList.remove("active");
			ele[qNo].style.display = "block";
			$(this).addClass("active");
		});

		$(".shortCut").each(function(e) {
		    if (e == 0)
				$(this).addClass("active");
		});
});