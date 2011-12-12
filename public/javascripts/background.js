var currentRotation = 0;

var tempX = 0;
var tempY = 0;
var oldX=0;
var oldY=0;

var mainDivTrasfrom={rotX:0,rotY:0,z:0,x:0}
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
		mainDivTrasfrom.rotX=yRot/3
		mainDivTrasfrom.rotY=xRot/3

		//document.getElementById("mainDiv").style.webkitTransformStyle ='preserve3d';
		updateMainDiv();
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
		$(".label2 a,#pageName a,.label2,#pageName,#likePageButton a").animate({color:color}, 300, function(){
			okToAnimate=true;
		});
		
		$(".menuButton,.miniButton").animate({color:color2}, 300, function(){
			okToAnimate=true;
		});

		$(".notifyBox,.headTab").animate({backgroundColor:color2}, 300, function(){
			okToAnimate=true;
		});		

	}


	return true;
}

updateMainDiv = function(eye){

		document.getElementById("mainDiv").style.webkitTransform =
			'rotateX('+ mainDivTrasfrom.rotX + 'deg) rotateY('+ mainDivTrasfrom.rotY + 'deg) translateZ('+mainDivTrasfrom.z+'px) translateX('+mainDivTrasfrom.x+'px)';
		document.getElementById("mainDiv").style.MozTransform =
			'rotateX('+ mainDivTrasfrom.rotX + 'deg) rotateY('+ mainDivTrasfrom.rotY + 'deg) translateZ('+mainDivTrasfrom.z+'px)translateX('+mainDivTrasfrom.x+'px)';
/*
		document.getElementById("mainDiv").style.webkitTransform =
			'translateZ('+mainDivTrasfrom.z+'px) translateX('+mainDivTrasfrom.x+'px) rotateX('+ mainDivTrasfrom.rotX + 'deg) rotateY('+ mainDivTrasfrom.rotY + 'deg)';
		document.getElementById("mainDiv").style.MozTransform =
			'translateZ('+mainDivTrasfrom.z+'px)translateX('+mainDivTrasfrom.x+'px) rotateX('+ mainDivTrasfrom.rotX + 'deg) rotateY('+ mainDivTrasfrom.rotY + 'deg)';
*/

}

oppositeColor=function(color){
	var bgcolor = color.replace(/rgba\(|\)/g, "").split(",");
	var r = 255-parseInt(bgcolor[0]);
	var g = 255-parseInt(bgcolor[1]);
	var b = 255-parseInt(bgcolor[2]);
	var a = parseInt(bgcolor[3]);
	return bgcolor='rgba('+r+','+g+','+b+',1)';
}