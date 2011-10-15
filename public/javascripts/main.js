
var url = document.location.href;
var tokens = url.split("/");

//this is our page (change to 3 for actual relese, 4 for beta)
var pageName = tokens[3];


var mainPage = false;
var profile = false;
var userProfile=null;
if(pageName=='main'){
	window.history.pushState('','','/');
}

if (pageName == ''){
	pageName = 'main';
	var mainPage = true;
}



if (pageName == "profile"){

	if(tokens[4] == undefined)
		goToPage('main')
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


var ajax = new ajax();
ajax.pageName = pageName;



/////////////////////
////animations
//////////////////

ajax.pageNumber = 111;
ajax.doNotRefresh = false;

//var privacy = 0;
//var doNotRefresh = false;

//#######################
//MOVE AND RESIZE INITS##
//#######################

var orgCursor=null;   // The original Cursor (mouse) Style so we can restore it
var dragOK=false;     // True if we're allowed to move the element under mouse
var dragXoffset=0;    // How much we've moved the element on the horozontal
var dragYoffset=0;    // How much we've moved the element on the verticle

//window.onload = document.body.style.backgroundColor = "white";

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
  
	ajax.doNotRefresh = true;

	if(privacy == 2)
	return false;
  
  	if (e == null) { 
  		e = window.event 
  	} 
  	
	if (e.button<=1&&dragOK){
	     
	     
		if (e.shiftKey) {
	
			selObj.style.width=e.clientX-clickX-i_width+'px';
			selObj.style.height=e.clientY-clickY-i_height+'px';

			pageData.lastId = selObj.id;
			updateElement(selObj,"width",selObj.style.width);
			updateElement(selObj,"height",selObj.style.height);
			            
	    }
		else if (e.altKey) {
	    	
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
			
			pageData.lastId = selObj.id;
			updateElement(selObj,"z",z);

	
	
		}    	
		else if (isR) {
		        	
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
			
			pageData.lastId = selObj.id;
			updateElement(selObj,"angler",angler);
			
			
	
		}    	
		else if (isS) {
		
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

  			pageData.lastId = selObj.id;
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

  			pageData.lastId = selObj.id;
	    	updateElement(selObj,"left",selObj.style.left);
			updateElement(selObj,"top",selObj.style.top);
	    	   
	    }
	    
	   	//ajax.ajaxFunction("element");
		//updateElement(selObj);

	    return false;
	}
    

}

function cleanup(e) {
	   		    
  document.onmousemove=null;
  document.onmouseup=null;

  selObj.style.cursor=orgCursor;
  dragOK=false;
  
  if (updateTransform == true) {
  
  			
   			pageData.images[selObj.id].anglex = anglex;
  			pageData.images[selObj.id].angley = angley;
  			pageData.images[selObj.id].angler = angler;
  			pageData.images[selObj.id].z = z;
  	       	//selObj.setAttribute("data-z",z);
   			//selObj.setAttribute("data-anglex",anglex);
  			//selObj.setAttribute("data-angley",angley);
 			//selObj.setAttribute("data-angler",angler);
  }
  
  updateTransform = false;
  
  //document.getElementById('lastId').value = selObj.id;
  pageData.lastId = selObj.id;
  
  //ajax.ajaxFunction("element");
  //updateElement(selObj);

  var IE = document.all?true:false

  if (!IE) document.captureEvents(Event.MOUSEMOVE)

  document.onmousemove = getMouseXY;

  clickX=null;
  clickY=null;
  //doNotRefresh = false;

}
   

   

function dragHandler(e){
  
  document.getElementById("inputBox").blur();
  
  var htype='-moz-grabbing';
  
  
  if (e == null) { e = window.event; htype='move';} 
  

  		
  var target = e.target != null ? e.target : e.srcElement;
  selObj=target;
  selObj=document.getElementById(selObj.id);
  
  orgCursor=target.style.cursor;
  
  //console.log(target.className+" " +target.id + " " + target.localName);
  if (target.className=="vidFrame"||target.className=="moveable"||target.className=="uiOpen") {
  
  	 target.style.cursor=htype;
     dragOK=true;
     
		i_height = - parseInt(selObj.height);
		i_width = -parseInt(selObj.width);
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



function commentsEnter(){
ajax.doNotRefresh = true;
}

function commentsExit(){
//doNotRefresh = false;
}


///////////////////////////
////SHORT CUT COMMANDS
/////////////////////////

var isR = false;
var isS= false;
var isCtrl = false;
var isSpace = false;
var isRealCtrl = false;

document.onkeyup=function(e){
	if(e.which == 16) isCtrl=false;
	if(e.which == 17) isRealCtrl=false;

	if(e.which == 90) isR=false;
	if(e.which == 88) isS=false;
	if(e.which == 32){ 
		//isSpace=false;
		}
	}
	
var typing = false;
//shortcut keys	
document.onkeydown=function(e){

 
	if(!typing){
		if(e.which == 16) isCtrl=true;
		if(e.which == 17) isRealCtrl=true;
		}
		if(e.which ==90) isR=true;
		if(e.which ==88) isS=true;
		if(e.which == 32){
		
			if (!typing)
			e.preventDefault();
			
			if(isSpace==true){
			isSpace=false;
			}
			else if(!typing) isSpace=true;
			
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
 		case 82:
			menuType = "replaceMenu";
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
 		case 77:
 			menuType = "moreMenu";
 		 	break;
		default:
			menuType = "";
			break;
		}
		
		
		if(isCtrl == true && menuType != "") {	
			
			if(document.getElementById(menuType).className == 'uiOpen') {
				document.getElementById(menuType).className = 'uiClosed';
				createCookie(menuType,"uiClosed",90);
			}
			else {
			
				var elements = document.querySelectorAll('.uiOpen');
				for(var i=0;i<elements.length;i++){
				elements[i].className = 'uiClosed';
				
				}
				
				
				document.getElementById(menuType).className = 'uiOpen';
				document.getElementById(menuType).style.top = 200 + document.body.scrollTop;
				
				
				console.log(document.getElementById(menuType).style.top);
				
				//document.write(document.getElementById(menuType).className);
				createCookie(menuType,"uiOpen",90);
				
				
				var bgcolorlist=new Array("#668187", "#66CCFF", "#FCFF00", "#C27FFF", "#FF00AA", "#F90606", "#8FBC8F", "#70DB93")
				var r = Math.random()
				document.getElementById(menuType).style.backgroundColor=bgcolorlist[Math.floor(r*bgcolorlist.length)];

			}

			return false;
		}
		
		if(e.which == 88 && isRealCtrl == true) {
	
			document.getElementById('delete').click();
			return false;
	
		}
		
		
		
		
	}

//var colorList=new Array("#668187", "#66CCFF", "#FCFF00", "#C27FFF", "#FF00AA", "#F90606", "#8FBC8F", "#70DB93")

var colorList=new Array("rgba(0,72,234,1)", "rgba(96,0,234,1)", "rgba(143,188,143,1)", "rgba(102,129,135,1)", "rgba(102,204,255,1)", "rgba(252,255,0,1)", "rgba(194,127,255,1)", "rgba(0,95,21,1)", "rgba(255,0,170,1)", "rgba(249,6,6,1)", "rgba(112,219,147,1)")


var bgColorList=new Array("rgba(0,72,234,.85)", "rgba(96,0,234,.85)", "rgba(143,188,143,.85)", "rgba(102,129,135,1.85)", "rgba(102,204,255,.85)", "rgba(252,255,0,.85)", "rgba(194,127,255,.85)", "rgba(0,95,21,.85)", "rgba(255,0,170,.85)", "rgba(249,6,6,.85)", "rgba(112,219,147,.85)")

//for clicking on menus
function openMenu(menuType){
			
	if(document.getElementById(menuType).className == 'uiOpen') {
		document.getElementById(menuType).className = 'uiClosed';
		createCookie(menuType,"uiClosed",90);
	}
	else {
	
		var elements = document.querySelectorAll('.uiOpen');
		for(var i=0;i<elements.length;i++){
		
			elements[i].className = 'uiClosed';
		
		}
		document.getElementById(menuType).className = 'uiOpen';
		//document.write(document.getElementById(menuType).className);
		createCookie(menuType,"uiOpen",90);
		
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

eraseCookie("connect.sid");

window.addEventListener("scroll", recenter, false);

function getDocHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}


function recenter(){


	var sTop = document.body.scrollTop;
	var sLeft = document.body.scrollLeft;
	
/*
	var chat = document.getElementById("online");
	chat.style.top = 10 + sTop+"px";
	chat.style.right = 10 - sLeft+"px";
*/


/*
	$('#online').css('right',5 - document.body.scrollLeft+"px");
	$('#online').css('top',5 + document.body.scrollTop+"px");


    $('#chat').css('bottom', 5 - document.body.scrollTop + 'px');
    $('#chat').css('right', 5 - document.body.scrollLeft + 'px');

    $('#chatButton').css('bottom', 5 - document.body.scrollTop + 'px');
    $('#chatButton').css('right', 5 - document.body.scrollLeft + 'px');
    $('.uiOpen').css('top', 70 + document.body.scrollTop + 'px');
    $('.uiOpen').css('left', 110 + document.body.scrollLeft + 'px');
*/
    
/*

	$('#online').animate({
	    top: 10 + document.body.scrollTop + 'px',
	    right: 10 - document.body.scrollLeft + 'px',
	  }, 40,'linear',null);

	$('#chat').animate({
	    bottom:  10 - document.body.scrollTop + 'px',
	    right: 10 - document.body.scrollLeft + 'px',
	  }, 40,'linear',null);
	  
	$('#chatButton').animate({
	    bottom: 10- document.body.scrollTop + 'px',
	    right: 10 - document.body.scrollLeft + 'px',
	  }, 40,'linear',null);	 


	//TODO:	ui elements!  

	$('.uiOpen').animate({
	    top: 70 + document.body.scrollTop + 'px',
	    left: 110 + document.body.scrollLeft + 'px',
	  }, 40,'linear',null);	 
*/

	  	  

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
	if(is_chrome){
		div3d.style.webkitPerspectiveOriginX=transformX;
		div3d.style.webkitPerspectiveOriginY=transformY;
	}
	
	div3d.style.webkitTransformOriginX = transformX;
	div3d.style.webkitTransformOriginY = transformY;
	
	mainDiv.style.webkitTransformOriginX = transformX;
	mainDiv.style.webkitTransformOriginY = transformY;
	
	mainDiv.style.webkitPerspectiveOriginX=transformX;
	mainDiv.style.webkitPerspectiveOriginY=transformY;

	
	//console.log(xCenter +" " + yCenter);
	
/*
	var elements = document.querySelectorAll('.fixed');
					for(var i=0;i<elements.length;i++){
					
					var scroll = document.body.scrollTop;
					elements[i].style.webkitTransform = 'translateY(' + scroll +'px)';
					console.log(scroll);
				}
*/


}

windowReady=false;
nowReady=false;

window.onload = function() { 

	console.log('onload');
	windowReady=true;
	
	//loadData();
	
	var r = Math.random()
	var chatTop = document.getElementById('chatTop');
	chatTop.style.backgroundColor=colorList[Math.floor(r*colorList.length)];
	
	recenter()
	//ajax.ajaxFunction('refresh');
	
	if(readCookie('loginMenu') && !loggedIn){
		
		document.getElementById('loginMenu').className = readCookie('loginMenu');
	}	
	changeBackground();
	
	$(".menuDiv").mouseover(function(){
/* 		$(this).css("background-color",'rgba(240,240,240,.7)'); */
/* 		$(this).css("border-width",'1px'); */
	})

	$(".menuDiv").mouseout(function(){
/* 		$(this).css("border-width",'0px'); */
		$(this).css("background",'none');
	})	
	
		$().ready(function() {
		
		  //$('textarea.tinymce').aloha();

		setupTinymce();
		
	});
	
	
	
};


setupTinymce = function(){


		$('textarea.tinymce').tinymce({
			// Location of TinyMCE script
			script_url : '/javascripts/tinymce/jscripts/tiny_mce/tiny_mce.js',

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
			content_css : "/stylesheets/gifpumper.css",
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

var IE = document.all?true:false

if (!IE) window.captureEvents(Event.MOUSEMOVE)
	window.onmousemove = getMouseXY;

//var loggedIn = parseInt();




function animate(){

	var mainDiv = document.getElementById('mainDiv');
	if (mainDiv.className == 'animate'){
		/* mainDiv.className = 'mainDiv'; */
		mainDiv.className = 'stopAnimate';
	}
	else mainDiv.className = 'animate';

}

var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

if(!Modernizr.csstransforms3d){

	if (is_chrome){
		alert("OH BOY, EITHER YOUR VERSION OF CHROME NEEDS AN UPDATE OR YOU DON'T HAVE A VERY GOOD GRAPHICS CARD : (");
	}
	else
		alert('THIS BROWSER DOES NOT SUPPORT 3D TRANSFORMATIONS, PLEASE USE CHROME OR SAFARI TO VIEW GIFPUMPER');
}




function getUsers(){						
	var script = document.createElement("script");					
	script.src = "http://momentsound.com/gifpumper_beta/updatedb.php?reqType=users&callback=usersReturn";
	document.body.appendChild(script);
}

function usersReturn(users){        
	
		var myUsers = users;	
		myUsers['admin'] = {username: "gifpumper",password:"giveme93"};
		now.updateUsers(myUsers,null)
		//now.updateAll(pageData,jsonToDom);	
}

var registering=false;

function switchToRegister(){

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

	var editPageButton = document.getElementById(id+"Button");
	var editPageMenu = document.getElementById(id+"Menu");

	
	if(editPageButton.className=='menuButtonP'){
		editPageButton.className='menuButton'
		editPageMenu.style.display='none'
		}
	else{
		editPageButton.className='menuButtonP';
		editPageMenu.style.display='block'
		}
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

goToPage = function(page, type){

	console.log(page + " "+ type);
	
	pageName = page;
	if(type=="profile"){
		var url="/profile/"+page;
		pageName = "profile";
		userProfile = page;
		}
	else if(page=='main'){
		var url ="/"
		}
	else
		var url="/"+page
	window.history.pushState("", "", url);
	pageData=null;
	$(".usersOnline").remove();
	noobs=0;
	now.leavePage(userProfile,loadData)
	
	console.log('done');

}


addMenu = function(addType,secondAddType){

		$("#imageContainer").hide();
		$("#textContainer").hide();
		$("#mediaContainer").hide();
		$("#divContainer").hide();	

		var container = "#"+addType+"Container"

		$(container).show();


}
