$(document).ready(function(){

		$(".divs .ques").each(function(e) {
			console.log(e);
		    if (e != 0)
		        $(this).hide();
		});
		
		$("#next").click(function(){
			if ($(".divs .ques:visible").next().length != 0)
			{
				$(".divs .ques:visible").next().show().prev().hide();
			}
		    else {

		    }
		    return false;
    	});
		$("#prev").click(function(){
			if ($(".divs .ques:visible").prev().length != 0)
			{
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
				console.log(ele[i].checked);
				ele[i].checked = false;
				console.log(ele[i].checked);
			}
			return false;
		});
});