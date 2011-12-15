
var url = document.location.href;
var tokens = url.split("/");

//this is our page (change to 3 for actual relese, 4 for beta)
var pageName = tokens[3];
var version=undefined;
var prevVersion=undefined;
var nextVersion=undefined;
var liked=-1;
var permissions;
var currentUser;
var notify=0;
var onlineObj = {}
var userImages = {};
var mainPageData = {};
var mainPage = false;
var profile = false;
var userProfile=null;
//if(pageName=='main'){
//	window.history.pushState('','','/');
//}

if (pageName == ''){
	pageName = 'main';
	var mainPage = true;
}

var privacy=0;

if (pageName == "profile"){

	if(tokens[4] == undefined)
		window.location = "./";
	else{
		userProfile=tokens[4];
		profile = true; 
		}	
/*
	else{
		pageName = "profile_"+tokens[4];
		profile = true;
	}
*/


}
else{
	var version = tokens[4];
	if(version!="" && version!=undefined)
		version = parseInt(version);
	else version = undefined;
}


//var ajax = new ajax();
//ajax.pageName = pageName;



/////////////////////
////animations
//////////////////

//ajax.pageNumber = 111;
//ajax.doNotRefresh = false;

var privacy = null;

//#######################
//MOVE AND RESIZE INITS##
//#######################

var orgCursor=null;   // The original Cursor (mouse) Style so we can restore it
var dragOK=false;     // True if we're allowed to move the element under mouse
var dragXoffset=0;    // How much we've moved the element on the horozontal
var dragYoffset=0;    // How much we've moved the element on the verticle


//#######################
//MOVE and RESIZE FUNCTIONS
//#######################

var selObj = null;
var i_width;
var i_height;
var zindex;
var clickX;
var clickY;

var updateTransform = false;


function moveHandler(e){

  
	//ajax.doNotRefresh = true;

	if(privacy >= 2)
		return false;
  
  	if (e == null) { 
  		e = window.event 
  	} 
  	
  	if($(selObj).hasClass('editableElement') && selObj.id != pageData.lastId){
  		$(selObj).addClass("selectedEl");
		pageData.lastId = selObj.id;
		fillEditMenu();
		}
  	
	if (e.button<=1&&dragOK){
	     
		if (e.shiftKey) {
	
			selObj.style.width=e.clientX-clickX-i_width+'px';
			selObj.style.height=e.clientY-clickY-i_height+'px';

			updateElement(selObj,"width", selObj.style.width);
			updateElement(selObj,"height",selObj.style.height);
			            
	    }
		else if (e.altKey && !pageData.images[selObj.id].d2d) {
	    	
	    	//zindex = Math.round((e.clientX-clickX)/10);
/*
			z = parseInt(selObj.getAttribute("data-z")) + (e.clientY-clickY)/3;
			anglex = parseInt(selObj.getAttribute("data-anglex"))
			angley = parseInt(selObj.getAttribute("data-angley"));
			angler = parseInt(selObj.getAttribute("data-angler"));
*/
			
			z = pageData.images[selObj.id].z + (e.clientY-clickY)/3;
			anglex = pageData.images[selObj.id].anglex;
			angler = pageData.images[selObj.id].angler;
			angley = pageData.images[selObj.id].angley;
			
			z=parseInt(z);
			anglex=parseInt(anglex);
			angley=parseInt(angley);
			angler=parseInt(angler);
	
			//var skew = 'skew('+anglex+'deg,'+angley+'deg)'+' ' + 'rotate('+angler+'deg)';
	   		var transform = 'translateZ(' + z + 'px)'+ ' ' +  'rotateY('+anglex+'deg)'+' '  + 'rotateX('+angley+'deg)'+' ' + 'rotateZ('+angler+'deg)';
	
			selObj.style.webkitTransform=transform;
			selObj.style.MozTransform=transform;
			
			updateTransform = true;
			
			updateElement(selObj,"z",z);

	
	
		}    	
		else if (isR && !pageData.images[selObj.id].d2d) {
		        	
/*
		    z = parseInt(selObj.getAttribute("data-z"));
		    anglex = parseInt(selObj.getAttribute("data-anglex"));
			angley = parseInt(selObj.getAttribute("data-angley"));
			angler = parseInt(selObj.getAttribute("data-angler"))+(e.clientX-clickX)/3;
*/
			
			z = pageData.images[selObj.id].z;
			anglex = pageData.images[selObj.id].anglex;
			angley = pageData.images[selObj.id].angley;
			angler = pageData.images[selObj.id].angler+(e.clientX-clickX)/3;
			
			z=parseInt(z);
			anglex=parseInt(anglex);
			angley=parseInt(angley);
			angler=parseInt(angler);
			
			//var transform = 'skew('+anglex+'deg,'+angley+'deg)'+' ' + 'rotate('+angler+'deg)';
	   		var transform = 'translateZ(' + z + 'px)'+ ' ' +  'rotateY('+anglex+'deg)'+' '  + 'rotateX('+angley+'deg)'+' ' + 'rotateZ('+angler+'deg)';
		        		
			selObj.style.webkitTransform=transform;
			selObj.style.MozTransform=transform;
			
			updateTransform = true;
			
			updateElement(selObj,"angler",angler);
			
			
	
		}    	
		else if (isS && !pageData.images[selObj.id].d2d) {
		
		    //document.write(selObj.getAttribute("data-angley"));
			
			//z = parseInt(selObj.getAttribute("data-z"));
			//anglex = parseInt(selObj.getAttribute("data-anglex"))+(e.clientX-clickX)/5;
			//angley = parseInt(selObj.getAttribute("data-angley"))+(e.clientY-clickY)/5;
			//angler = parseInt(selObj.getAttribute("data-angler"));
			z = pageData.images[selObj.id].z;
			anglex = pageData.images[selObj.id].anglex+(e.clientX-clickX)/5;
			angley = pageData.images[selObj.id].angley+(e.clientY-clickY)/5;
			angler = pageData.images[selObj.id].angler;
	
	
			z=parseInt(z);
			anglex=parseInt(anglex);
			angley=parseInt(angley);
			angler=parseInt(angler);
	
			//var skew = 'skew('+anglex+'deg,'+angley+'deg)'+' ' + 'rotate('+angler+'deg)';
	   		var transform = 'translateZ(' + z + 'px)'+ ' ' +  'rotateY('+anglex+'deg)'+' '  + 'rotateX('+angley+'deg)'+' ' + 'rotateZ('+angler+'deg)';
	
	
			selObj.style.webkitTransform=transform;
			selObj.style.MozTransform=transform;
			
			updateTransform = true;

			updateElement(selObj,"anglex",anglex);
			updateElement(selObj,"angley",angley);			
			
		}
	    else{
	    	if(selObj.style.left!="")
	    		selObj.style.left=e.clientX-dragXoffset+'px';
	    	else
	    		selObj.style.right=-e.clientX-dragXoffset+'px';
	    	
	    	if(selObj.style.top!="")
	    		selObj.style.top=e.clientY-dragYoffset+'px'; 
	    	else
	    		selObj.style.top=-e.clientY-dragYoffset+'px'; 

	    	updateElement(selObj,"left",selObj.style.left);
			updateElement(selObj,"top",selObj.style.top);
	    	   
	    }
	    
	   	//ajax.ajaxFunction("element");
		//updateElement(selObj);

	}
    
	return false;

}

function cleanup(e) {
	   		    
	document.onmousemove=null;
	changeBackground();
	document.onmouseup=changeBackground;
	
	selObj.style.cursor=orgCursor;
	dragOK=false;
	
	if (updateTransform == true && !pageData.images[selObj.id].d2d) {
		pageData.images[selObj.id].anglex = anglex;
		pageData.images[selObj.id].angley = angley;
		pageData.images[selObj.id].angler = angler;
		pageData.images[selObj.id].z = z;
	}
	
	
	pageData.images[selObj.id].left = selObj.style.left;
	pageData.images[selObj.id].top = selObj.style.top;
	pageData.images[selObj.id].width = selObj.style.width;
	pageData.images[selObj.id].height = selObj.style.height;
	

	updateTransform = false;
	//var sendObj=pageData.images[selObj.id]
	if(nonSafari2d[selObj.id]){
		pageData.images[selObj.id].d2d=false;
		}
		
	now.editElement(pageName, selObj.id,pageData.images[selObj.id],false,true,null);	

	if(nonSafari2d[selObj.id]){
		pageData.images[selObj.id].d2d=true;
	}
	//document.getElementById('lastId').value = selObj.id;
	// $("#"+previousId).removeClass("selected");
	//ajax.ajaxFunction("element");
	//updateElement(selObj);
	
	var IE = document.all?true:false
	//if (!IE) document.captureEvents(Event.MOUSEMOVE)
	
	document.onmousemove = getMouseXY;
	
	clickX=null;
	clickY=null;
	
	return false;

}
   

   

function dragHandler(e,el){
  
  //document.getElementById("inputBox").blur();
  
  now.click();
  
  if(version!=undefined || privacy>=2)
     return;  
  
  var htype='-moz-grabbing';
  
  if (e == null) { e = window.event; htype='move';} 
  
  if(el!=undefined){
  	var target=el;
  	selObj=el;
  	}
  else{ 		
  var target = e.target != null ? e.target : e.srcElement;
  selObj=target;
  selObj=document.getElementById(selObj.id);
  }
  
  if(!$(selObj).is('input') && (selObj==undefined || !$(selObj).hasClass('editableElement'))){
  	
  	if(!$(target.parentElement).hasClass('noDrag'))
  		selObj=target.parentElement;
  }
  
  //if(selObj==null)
  //	return false;
  
  if(!typing)
  	$("#inputBox").blur();
  else{
  	$("#inputBox").blur();
	typing=true;  
  }

 
  if($(selObj).hasClass('editableElement') && selObj.id != pageData.lastId){
		 $(".selectedEl").removeClass("selectedEl");
 		 $(selObj).addClass("selectedEl");
		 pageData.lastId = selObj.id;
		 fillEditMenu();
 	 }
  else if($(selObj).hasClass('editableElement')){
		$(".selectedEl").removeClass("selectedEl");
 	 	pageData.lastId=null;
	
	}
  
  orgCursor=target.style.cursor;
  
  //console.log(target.className+" " +target.id + " " + target.localName);
  if (selObj && (selObj.className=="vidFrame"||$(selObj).hasClass('editableElement')||selObj.className=="uiOpen")) {
  
  	 target.style.cursor=htype;
     dragOK=true;
     
		i_height = - parseInt(selObj.style.height);
		i_width = -parseInt(selObj.style.width);

		i_height = - $(selObj).height();
		i_width = - $(selObj).width();

	 if(selObj.style.left!="")
     	dragXoffset=e.clientX-parseInt(selObj.style.left);	
	 else
     	dragXoffset=-e.clientX+parseInt(selObj.style.right);
     
     if(selObj.style.top!="")
     	dragYoffset=e.clientY-parseInt(selObj.style.top);
     else	
     	dragYoffset=-e.clientY+parseInt(selObj.style.bottom);

     clickY=e.clientY;
     clickX=e.clientX ;
  
  	//document.console.console1.value = e.clientX +","+ clickX;
     
     document.onmousemove=moveHandler;
     document.onmouseup=cleanup;
     return false;

  }

}

document.onmousedown=dragHandler;

document.onmouseup=changeBackground;

/*
function commentsEnter(){
ajax.doNotRefresh = true;
}
*/

function commentsExit(){
//doNotRefresh = false;
}


///////////////////////////
////SHORT CUT COMMANDS
/////////////////////////

var isR = false;
var isS= false;
var isShift = false;
var isSpace = false;
var isCtrl = false;

document.onkeyup=function(e){
	if(e.which == 16) isShift=false;
	if(e.which == 17) isCtrl=false;

	if(e.which == 90) isR=false;
	if(e.which == 88) isS=false;
	if(e.which == 32){ 
		//isSpace=false;
		}
	}
	
var typing = false;
var hideUi = false;
//shortcut keys	
document.onkeydown=function(e){



	if(e.which == 27 && currentUser != 'n00b'){
	
		$('#chat, #online, #rightMenu, #menuContainer').toggle();
		if(hideUi==false)
			hideUi=true;
		else{
			hideUI=false;
			document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;

			}
	}
 
	if(!typing){
		
		if(e.which == 16) isShift=true;
		if(e.which == 17) isCtrl=true;
		if(e.which ==90) isR=true;
		if(e.which ==88) isS=true;
	}

		if(e.which == 32){
		
			if (!typing)
			e.preventDefault();
			
			if(isSpace==true){
			isSpace=false;
			}
			else if(!typing) isSpace=true;
			
		}
		
		if(!isShift && !isCtrl && !typing){
			if(e.which == 38 || e.which == 87){
				e.preventDefault();
				
				mainDivTrasfrom.z+=Math.cos(mainDivTrasfrom.rotY*Math.PI/180)*25;
				mainDivTrasfrom.x-=Math.sin(mainDivTrasfrom.rotY*Math.PI/180)*25;
	
				updateMainDiv();			
			}
			if(e.which == 40 || e.which == 83){
				e.preventDefault();
				mainDivTrasfrom.z-=Math.cos(mainDivTrasfrom.rotY*Math.PI/180)*25;
				mainDivTrasfrom.x+=Math.sin(mainDivTrasfrom.rotY*Math.PI/180)*25;
				updateMainDiv();			
			}		
			if(e.which == 37 || e.which == 65){
				e.preventDefault();
				
				mainDivTrasfrom.rotY-=10;
				//mainDivTrasfrom.z+=Math.sin(mainDivTrasfrom.rotY*Math.PI/180)*25;
				//mainDivTrasfrom.x+=Math.cos(mainDivTrasfrom.rotY*Math.PI/180)*25;
				//mainDivTrasfrom.x-=25;
				updateMainDiv(true);			
			}	
			if(e.which == 39 || e.which == 68){
				e.preventDefault();
				mainDivTrasfrom.rotY+=10;
	
				//mainDivTrasfrom.z-=Math.sin(mainDivTrasfrom.rotY*Math.PI/180)*25;
				//mainDivTrasfrom.x-=Math.cos(mainDivTrasfrom.rotY*Math.PI/180)*25;
				updateMainDiv(true);			
			}
		}
		
		var menuType;
		
		switch(e.which)
			{
		case 72:
			menuType = "helpMenu";
  			break;
		case 65:
			menuType = "addMenu";
 		 	break;
 		case 69:
			menuType = "editMenu";
  			break;
		case 68:
			menuType = "deleteMenu";
 		 	break;
 		case 66:
			menuType = "backgroundMenu";
  			break;
		case 70:
			menuType = "faceMenu";
 		 	break;
 		case 78:
 			menuType = "moreMenu";
 		 	break;
 		case 80:
 			menuType = "pageMenu";
 		 	break; 		 	
 		case 83:
 			//if(isShift)
			menuType = "saveMenu";
 		 	break;
 		default:
			menuType = "";
			break;
		}
		
		
		if(isShift == true && menuType != "") {	
			
			if(document.getElementById(menuType).style.display=="block") {
				
				//document.getElementById(menuType).className = 'uiClosed';
				document.getElementById(menuType).style.display="none";
				createCookie(menuType,"none",90);
			}
			else {
			
				var elements = document.querySelectorAll('.uiOpen');
				for(var i=0;i<elements.length;i++){
					//elements[i].className = 'uiClosed';
					elements[i].style.display="none";

				}
				
				
				document.getElementById(menuType).className = 'uiOpen';
				//document.getElementById(menuType).style.top = 200 + document.body.scrollTop;
				document.getElementById(menuType).style.display = "block";
				
				console.log(document.getElementById(menuType).style.top);
				
				//document.write(document.getElementById(menuType).className);
				createCookie(menuType,"block",90);
				
				
				var bgcolorlist=new Array("#668187", "#66CCFF", "#FCFF00", "#C27FFF", "#FF00AA", "#F90606", "#8FBC8F", "#70DB93")
				var r = Math.random()
				document.getElementById(menuType).style.backgroundColor=bgcolorlist[Math.floor(r*bgcolorlist.length)];

			}

			return false;
		}
		
		if(e.which == 88 && isCtrl == true) {
	
			document.getElementById('delete').click();
			return false;
	
		}
		
		
		
		
	}

//var colorList=new Array("#668187", "#66CCFF", "#FCFF00", "#C27FFF", "#FF00AA", "#F90606", "#8FBC8F", "#70DB93")

var colorList=new Array("rgba(0,72,234,1)", "rgba(96,0,234,1)", "rgba(143,188,143,1)", "rgba(102,129,135,1)", "rgba(102,204,255,1)", "rgba(252,255,0,1)", "rgba(194,127,255,1)", "rgba(0,95,21,1)", "rgba(255,0,170,1)", "rgba(249,6,6,1)", "rgba(112,219,147,1)")


var bgColorList=new Array("rgba(0,72,234,.85)", "rgba(96,0,234,.85)", "rgba(143,188,143,.85)", "rgba(102,129,135,.85)", "rgba(102,204,255,.85)", "rgba(252,255,0,.85)", "rgba(194,127,255,.85)", "rgba(0,95,21,.85)", "rgba(255,0,170,.85)", "rgba(249,6,6,.85)", "rgba(112,219,147,.85)")

var bgColorList2=new Array("rgba(143,188,143,.75)", "rgba(102,204,255,.75)", "rgba(194,127,255,.75)", "rgba(200,105,221,.75)", "rgba(255,0,170,.75)", "rgba(90,215,240,.75)", "rgba(112,219,147,.75)")

//for clicking on menus
function openMenu(menuType){
			
	if(document.getElementById(menuType).style.display=="block") {
				
		//document.getElementById(menuType).className = 'uiClosed';
		document.getElementById(menuType).style.display="none";
		createCookie(menuType,"none",90);
	}
	else {
	
		var elements = document.querySelectorAll('.uiOpen');
		for(var i=0;i<elements.length;i++){
			//elements[i].className = 'uiClosed';
			elements[i].style.display="none";

		}
		
		
		document.getElementById(menuType).className = 'uiOpen';
		//document.getElementById(menuType).style.top = 200 + document.body.scrollTop;
		document.getElementById(menuType).style.display = "block";
		createCookie(menuType,"block",90);
		
		var r = Math.random()
		document.getElementById(menuType).style.backgroundColor=colorList[Math.floor(r*colorList.length)];
	
	}
			
}



function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

//eraseCookie("connect.sid");

window.addEventListener("scroll", function(){recenterFlag=true;}, false);

function getDocHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

var mainPageScroll=0;

var recenterFlag=true;

function recenter(){
	setTimeout(recenter,300);

	if(!recenterFlag)
		return;
	
	var sTop = document.body.scrollTop;
	var sLeft = document.body.scrollLeft;  	  

	var pagesBottom = $('#userPages').position().top + $('#userPages').height();
	
	if(pageName == 'main' && sTop+window.innerHeight>pagesBottom){
		loadMorePages()
	}

	if(pageName=='main'){
		mainPageScroll=sTop;
		recenterFlag=false;
		return false;
	}

	var yCenter = document.body.scrollTop + window.innerHeight / 2;
	var xCenter = document.body.scrollLeft + window.innerWidth / 2;
	
	var transformX = xCenter+"px";
	var transformY = yCenter+"px";
	

	
	var div3d = document.getElementById("div3d")
	var mainDiv = document.getElementById("mainDiv")


/*
	div3d.style.webkitPerspectiveOrigin = transformX + transformY+"0";
	div3d.style.webkitTransformOrigin = transformX + transformY+"0";
	mainDiv.style.webkitPerspectiveOrigin = transformX + transformY+"0";
	mainDiv.style.webkitTransformOrigin = transformX + transformY+"0";
*/
	
	//TODO: CHROME BUG?
	if(is_chrome || is_firefox){
		div3d.style.webkitPerspectiveOriginX=transformX;
		div3d.style.webkitPerspectiveOriginY=transformY;
		div3d.style.MozPerspectiveOriginX=transformX;
		div3d.style.MozPerspectiveOriginY=transformY;
	}
	
	div3d.style.webkitTransformOriginX = transformX;
	div3d.style.webkitTransformOriginY = transformY;
	div3d.style.MozTransformOriginX = transformX;
	div3d.style.MozTransformOriginY = transformY;
		
	mainDiv.style.webkitTransformOriginX = transformX;
	mainDiv.style.webkitTransformOriginY = transformY;
	mainDiv.style.MozTransformOriginX = transformX;
	mainDiv.style.MozTransformOriginY = transformY;
	
	mainDiv.style.webkitPerspectiveOriginX=transformX;
	mainDiv.style.webkitPerspectiveOriginY=transformY;
	mainDiv.style.MozPerspectiveOriginX=transformX;
	mainDiv.style.MozPerspectiveOriginY=transformY;
	
	//console.log(xCenter +" " + yCenter);
	recenterFlag=false;

}

windowReady=false;
nowReady=false;
var addEditorsEl;
var IE = document.all?true:false

var likeIm;

window.onload = function() { 
	
	var type = null;
	if(profile)
		type="profile"
	

	//window.history.pushState({page:pageName,type:type,_version:version}, "", "url");
	window.history.replaceState({page:pageName,type:type,_version:version}, "", document.URL)

	
	window.addEventListener("popstate", popFunction);

	var r = Math.random()
	var chatTop = document.getElementById('chatTop');
	chatTop.style.backgroundColor=colorList[Math.floor(r*colorList.length)];

	setTimeout(recenter,300);
	changeBackground();
	
/*
	$(".menuDiv").mouseover(function(){
		$(this).css("background-color",'rgba(240,240,240,.7)');
		$(this).css("border-width",'1px');
	})

	$(".menuDiv").mouseout(function(){
		$(this).css("background",'none');
	})
*/	
	
	
	$().ready(function() {
	
/*
		$('input').focus(function(){typing=true;})
		$('input').blur(function(){typing=false;})
*/

	
		likeIm = new Image();
		likeIm.src='https://s3.amazonaws.com/gifpumper/ui/heart-03.gif'
		//likeIm.src='http://www.platonicsolids.info/Animated_GIFs/Octahedron.GIF'
		likeIm.style.width='20px'
		likeIm.style.marginBottom='-6px'
		likeIm.style.marginLeft='2px'
		document.getElementById('likeIm').appendChild(likeIm)
		//$('#likeIm').hide();

		
		$('#miniLogo').mouseenter(function(){$('#tipDiv').fadeIn()}).mouseleave(function(){$('#tipDiv').fadeOut()})
		$('#menuContainer').mouseenter(function(){$('#tipDiv').fadeIn()}).mouseleave(function(){$('#tipDiv').fadeOut()})
		
			
		$('#accordion').show();

		$('#accordion').accordion({
			collapsible: true,
			icons: false,
			autoHeight: false
		})
		$('#mainMenu').draggable({handle:'div.headTab'});

		$('input:text').focus(function(){ typing=true;})
		$('input:text').blur(function(){ typing=false;})


		if (!IE) window.captureEvents(Event.MOUSEMOVE)
			window.onmousemove = getMouseXY;
		
			//$( "#chatBox" ).resizable({ handles: 'n, e, s, w' });
		

		    var notifyPostion=false;
			$('.notifyBox').click(function(){
				
				if(!notifyPostion){
/*
					$('#notifyDiv').position({ 
						of: $('.notifyBox'), 
		    			my:"left top",
		    			at:"left bottom" })
			   			notifyPostion=true;
*/
		   		}
				$('#notifyDiv').toggle();
				$('.notifyBox').html('n');
				notify=0;
				document.title="gifpumper"	
			})

			//if(loggedIn || pageName=='invite'){
				$(".gpui").show();
				$('#editElementMenu').position({ 
							of: $('#editElementButton'), 
			    			my:"left top",
			    			at:"left bottom" })
			    			
	   			$('#editPageMenu').position({ 
					of: $('#editPageButton'), 
	    			my:"left top",
	    			at:"left bottom" })	
    		//}	
				$(".gpui").hide();
		
			if(readCookie('loginMenu') && !loggedIn){
				document.getElementById('loginMenu').style.display = readCookie('loginMenu');
				document.getElementById('loginMenu').className ='uiOpen';
			}

			addEditorsEl = $('textarea.addEditors')
			addEditorsEl.tagify( {"addTagPrompt": 'enter username'},{delimiters: [null]});			
			$('.tagify-container').keyup(searchUsers)
			addEditorsEl.tagify('inputField').focus(function(){typing=true});
			addEditorsEl.tagify('inputField').blur(function(){typing=false});

			

			//$('.tagify-container').focus(function(){typing=true})
			//$('.tagify-container').blur(function(){typing=false})
			
			setupTinymce();
			
		$('.menuButton,.notifyBox').okshadow({color:'rgba(60,60,60,.6)'});
/*
		$('#pageName a,#pageName,#rightMenu').okshadow({
		  color: 'white',
		  textShadow: true,
		  transparent: true,
		  xMax: 2,
		  yMax: 2,

		  xMin: 2,
		  yMin: 2,
		  fuzzMin: 1,
		  fuzz: 100
		});
*/

		windowReady=true;
		permissions(pageName,userProfile,version,'/');
		loadNotifications();
	});
	
};




setupTinymce = function(){

		$('textarea.tinymce').tinymce({
			// Location of TinyMCE script
			script_url : '/public/javascripts/tinymce/jscripts/tiny_mce/tiny_mce.js',

			// General options
			theme : "advanced",
			skin : "cirkuit",
        	//skin_variant : "silver",
			
			//inlinepopups
			plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",

			// Theme options
			theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,blockquote,|,link,unlink,image,cleanup,code,",
			
			
			//styleselect,formatselect,fontselect,fontsizeselect",
			
			theme_advanced_buttons2 : "fontsizeselect,styleselect,|,forecolor,backcolor,iespell,media,advhr,pagebreak",
			theme_advanced_buttons3: "",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "bottom",
			theme_advanced_resizing : true,
			// Example content CSS (should be your site CSS)
			
			//TODO: SERVER update url
			content_css : "/public/stylesheets/gifpumper.css",
			theme_advanced_font_sizes : "8px,10px,12px,14px,18px,24px,36px,50px,100px",
    		font_size_style_values : "medium,medium,medium,medium,medium,medium,medium,medium,medium",

			// Drop lists for link/image/media/template dialogs
/*
			template_external_list_url : "lists/template_list.js",
			external_link_list_url : "lists/link_list.js",
			external_image_list_url : "lists/image_list.js",
			media_external_list_url : "lists/media_list.js",
*/

			// Replace values for the template plugin
/*
			template_replace_values : {
				username : "Some User",
				staffid : "991234"
			}
*/
		});
		
/* 		$('textarea.tinymce').css('position','fixed'); */

}




//setTimeout("ajaxFunction('refresh')",2000);
//document.getElementById("ui").style.visibility = readCookie('menu');



//var loggedIn = parseInt();




function animate(){


	var mainDiv = document.getElementById('mainDiv');
	if (mainDiv.className == 'animate'){
		/* mainDiv.className = 'mainDiv'; */
		mainDiv.className = 'stopAnimate';
	}
	else mainDiv.className = 'animate';
	
	if(currentUser=='eyebeam-user')
		now.camera(undefined, true)

}

var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var is_safari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

if(is_chrome)
	is_safari=false;

if(!Modernizr.csstransforms3d){
	if (is_chrome){
		//alert("OH BOY, EITHER YOUR VERSION OF CHROME NEEDS AN UPDATE OR YOU DON'T HAVE A VERY GOOD GRAPHICS CARD : (");
	}
	else
		alert('THIS BROWSER DOES NOT SUPPORT 3D TRANSFORMATIONS, PLEASE USE CHROME OR SAFARI TO VIEW GIFPUMPER');
}






var registering=false;

function switchToRegister(){

	var inviteCode=prompt("Please enter the invitation code");

	now.checkInvite(inviteCode,function(right){
		if(right){	
			var regElements = document.querySelectorAll(".regClass")
				for(var i=0; i<regElements.length;i++){
					regElements[i].style.display='inline';
				}
			var logElements = document.querySelectorAll(".loginClass")
				for(var i=0; i<logElements.length;i++){
					logElements[i].style.display='none';
				}
			registering=true;
		}
		else alert('Sorry, invitation code is incorrect : (')
	})

}

function switchToLogin(){

	var regElements = document.querySelectorAll(".regClass")
		for(var i=0; i<regElements.length;i++){
			regElements[i].style.display='none';
		}
	var logElements = document.querySelectorAll(".loginClass")
		for(var i=0; i<logElements.length;i++){
			logElements[i].style.display='inline';
		}
	var registering=false;
}

function logOut(){
  document.logIn.logout.click();
}

var chatOpen=true;
function openChat(){
	
	if(chatOpen){
		document.getElementById('chat').style.display='none';
		document.getElementById('chatButton').style.display='block';
		chatOpen=false;
	}
	else{
		var r = Math.random()
		document.getElementById('chatTop').style.backgroundColor=colorList[Math.floor(r*colorList.length)];
		document.getElementById('chat').style.display='block';
		document.getElementById('chatButton').style.display='none';
		chatOpen=true;
	}
}


function buttonPress(id){

	var editButton = document.getElementById(id+"Button");
	var editMenu = document.getElementById(id+"Menu");

	
	if($(editButton).hasClass('menuButtonP')){
		//editPageButton.className='menuButton'
		$(editButton).removeClass('menuButtonP').addClass('menuButton');
		//$(editPageButton)
		if(editMenu)
			editMenu.style.display='none'
			$(editButton).data("okshadow").setoption({color:'rgba(60,60,60,.6)'});
		}
	else{
		if(editMenu){
			$(".menu").hide();
			$(".dropButton").removeClass('menuButtonP').addClass('menuButton');
			
			$(".dropButton").data("okshadow").setoption({color:'rgba(60,60,60,.6)'});
			$("#editPageButton").data("okshadow").setoption({color:'rgba(60,60,60,.6)'});

			editMenu.style.display='block'

			}
		//editPageButton.className='menuButtonP';
		$(editButton).removeClass('menuButton').addClass('menuButtonP');
		$(editButton).data("okshadow").setoption({color:""});
		$('.menuButtonP').stop().css('color','blue');
		}

	changeBackground();

}


registerFunc = function(){

	var regUserName = $("[name=username]").val()
	var pass = $("[name=password]").val()
	var passAgain = $("[name=passwordAgain]").val()
	var email = $("[name=email]").val()

	if(regUserName == "" || pass == "" || passAgain == ""){
		alert("please fill in all required fields")
		return;			
	}

	if(pass != passAgain){
		alert("password confirmation is wrong, please try again")
		return;
	}
	
	userObj={username:regUserName,password:pass}
	now.updateUsers([userObj], function(err){
	
		if(err) alert(err)
		else{
			$("[name=login]").click()
		}
	})

}



function popFunction(e){
	console.log(e.state);
	var back=true;
	
	if(e.state!=null){
		if(e.state.page=undefined)
			return;
		goToPage(e.state.page,e.state.type,e.state.version,back)
			//$('window').scrollTop(e.state.scroll);
		}
}
	


var addType = "image";

addMenu = function(_addType,_secondAddType){

		addType = _addType;
		$("#imageContainer").hide();
		$("#textContainer").hide();
		$("#mediaContainer").hide();
		$("#divContainer").hide();	
		$("#editImageContainer").hide();
		$("#editTextContainer").hide();
		$("#editMediaContainer").hide();
		$("#editDivContainer").hide();
		var container = "#"+_addType+"Container"

		$(container).show();
}

fillEditMenu = function(){

	var id = pageData.lastId;
	if(id==undefined || pageData.images[id] == undefined)
		return;
	$(".editType").val("");	 
		 
	$("#editImage").val(pageData.images[id].url)
	$("#editContent").val(pageData.images[id].content)
	
	$('.mediaEdit').val('');
	if(pageData.images[id].contentType=='youtube')
		$("#editYoutubeUrl").val(pageData.images[id].content)
	else if(pageData.images[id].contentType=='vimeo')
		$("#editVimeoUrl").val(pageData.images[id].content)
	else if(pageData.images[id].contentType=='soundCloud')
		$("#editSoundCloud").val(pageData.images[id].content)
  	else if(pageData.images[id].contentType=='mp3')
    	$("#editMp3").val(pageData.images[id].content)
	else
		$("#editMedia").val(pageData.images[id].content)
	
	$("#editBackgroundColor").val(pageData.images[id].backgroundColor)
	$("#editBackgroundImage").val(pageData.images[id].backgroundImage)
	$('#edit2d').prop("checked", pageData.images[id].d2d);


}


function disableSelection(target){
	if (typeof target.onselectstart!="undefined") //IE route
		target.onselectstart=function(){return false}
	else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
		target.style.MozUserSelect="none"
	else //All other route (ie: Opera)
		target.onmousedown=function(){return false}
	target.style.cursor = "default"
}

keyOut = function(){

	var imgUrl = $('#editImage').val()
	if(imgUrl != '' && isUrl(imgUrl))
		$.photoblaster(imgUrl, currentUser, success, error);

}
success = function(cleanImg){
	
	$('#editImage').val(cleanImg['url'])	

} 
error = function(){}