var currentRotation = 0;

var tempX = 0;
var tempY = 0;
var oldX=0;
var oldY=0;

function getMouseXY(event) {
  if (IE) { 
    tempX = event.clientX + document.body.scrollLeft
    tempY = event.clientY + document.body.scrollTop
  } 
  else {  
    tempX = event.clientX + document.body.scrollLeft
    tempY = event.clientY + document.body.scrollTop
  }  

  if (tempX < 0){tempX = 0}
  if (tempY < 0){tempY = 0}  

	var bgcolorlist=new Array("#0048EA", "#6000EA", "#722600", "#668187", "66ccff", "#FCFF00", "#C27FFF", "#005F15", "#FF00AA", "#F90606", "#FFF", "#000")
	if (tempX > 0 && tempX < 1200 && (Math.abs(tempY-oldY)>5 || Math.abs(tempX-oldX)>5)){	
	
		changeBackground();
		oldX=tempX;
		oldY=tempY;
	}

	if(isSpace && !typing){
		var xRot = tempX -document.body.scrollLeft- window.innerWidth / 2;
		var yRot = tempY -document.body.scrollTop - window.innerHeight /2;
		document.getElementById("mainDiv").style.webkitTransform ='rotateX('+ yRot/3 + 'deg)' + ' ' + 'rotateY('+ xRot/3 + 'deg)';
		document.getElementById("mainDiv").style.MozTransform ='rotateX('+ yRot/3 + 'deg)' + ' ' + 'rotateY('+ xRot/3 + 'deg)';

		//document.getElementById("mainDiv").style.webkitTransformStyle ='preserve3d';

	}

}
var okToAnimate = true;
var globalBG;
function changeBackground(){


var bgcolorlist=new Array("rgba(0,72,234,1)", "rgba(96,0,234,1)", "rgba(114,34,0,1)", "rgba(102,129,135,1)", "rgba(102,204,255,1)", "rgba(252,255,0,1)", "rgba(194,127,255,1)", "rgba(0,95,21,1)", "rgba(255,0,170,1)", "rgba(249,6,6,1)", "rgba(173,216,230,1)","rgba(40,40,40,1)","rgba(40,40,40,1)")
	var r = Math.random()
	var r2 = Math.random()
	
	//document.getElementById("shortMenu").style.color=bgcolorlist[Math.floor(r*bgcolorlist.length)];

	var color=bgcolorlist[Math.floor(r*bgcolorlist.length)];	
	var color2=bgcolorlist[Math.floor(r2*bgcolorlist.length)];	

	var bgcolor = color.replace(/rgba\(|\)/g, "").split(",");
	var r = 255-parseInt(bgcolor[0]);
	var g = 255-parseInt(bgcolor[1]);
	var b = 255-parseInt(bgcolor[2]);
	bgcolor='rgba('+r+','+g+','+b+',.5)';
	
	globalBG = bgcolor;

	if(okToAnimate){
		okToAnimate = false;
		$("a, .menuButtonP,").animate({color:color}, 300, function(){
			okToAnimate=true;
		});
		
		$(".menuButton,.miniButton").animate({color:color2}, 300, function(){
			okToAnimate=true;
		});
		$(".notifyBox").animate({backgroundColor:color2}, 300, function(){
			okToAnimate=true;
		});		


		

/*
	if(okToAnimate){
		okToAnimate = false;
		$(".menuButton").animate({color:color}, 300, function(){
			okToAnimate=true;
		});
*/
			
/*
	if($('.menubutton').data("okshadow")){	
		$('.menuButton').data("okshadow").setoption({
  		"color": color,
  		"fuzzMin": 10,})
		}
*/
/*
		$("a").animate({backgroundColor:bgcolor}, 500, function(){
			//okToAnimate=true;
		});
*/
	}

/*
	var links = document.querySelectorAll('a');

	for (var i = 0; i< links.length; i++){
		
		links[i].style.color=bgcolorlist[Math.floor(r*bgcolorlist.length)];
	
	}
*/

	//document.getElementById("console1").style.color=bgcolorlist[Math.floor(r*bgcolorlist.length)];
	return true;
}
