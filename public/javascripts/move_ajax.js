

/////////////////////
////animations
//////////////////



var doNotRefresh = false;


//#######################
//MOVE AND RESIZE INITS##
//#######################

   var orgCursor=null;   // The original Cursor (mouse) Style so we can restore it
   var dragOK=false;     // True if we're allowed to move the element under mouse
   var dragXoffset=0;    // How much we've moved the element on the horozontal
   var dragYoffset=0;    // How much we've moved the element on the verticle

document.body.style.backgroundColor = "<?=$background?>";



//#######################
//MOVE and RESIZE FUNCTIONS
//#######################

   var selObj = null;
	var i_width;
	var i_height;
	var zindex;
	
	var clickX;
	var clickY;
	
	//var anglex=0;
    //var angley=0;
    //var angler=0;

	var updateTransform = false;


	
   function moveHandler(e){
   
      if (e == null) { e = window.event } 
      if (e.button<=1&&dragOK){
         
          if (e.shiftKey) {

			selObj.style.width=e.clientX-clickX-i_width+'px';
			selObj.style.height=e.clientY-clickY-i_height+'px';
			            
        	}
        	
        	else if (e.altKey) {
            	
            	zindex = Math.round((e.clientX-clickX)/10);

        	}
        	
        	else if (isR) {
        	
        	    anglex = parseInt(selObj.getAttribute("data-anglex"));
        		angley = parseInt(selObj.getAttribute("data-angley"));
        		angler = parseInt(selObj.getAttribute("data-angler"))+(e.clientX-clickX)/5;
        		
        		var transform = 'skew('+anglex+'deg,'+angley+'deg)'+' ' + 'rotate('+angler+'deg)';
        	        		
        		selObj.style.webkitTransform=transform;
        		selObj.style.MozTransform=transform;
        		
        		updateTransform = true;
        		

        	}
        	
        	else if (isS) {
        	
        	    //document.write(selObj.getAttribute("data-angley"));

        		anglex = parseInt(selObj.getAttribute("data-anglex"))+(e.clientX-clickX)/5;
        		angley = parseInt(selObj.getAttribute("data-angley"))+(e.clientY-clickY)/5;
				angler = parseInt(selObj.getAttribute("data-angler"));

        		var skew = 'skew('+anglex+'deg,'+angley+'deg)'+' ' + 'rotate('+angler+'deg)';

        		selObj.style.webkitTransform=skew;
        		selObj.style.MozTransform=skew;
        		
        		updateTransform = true;

        		
        	}
        	
        	
         else{
         selObj.style.left=e.clientX-dragXoffset+'px';
         selObj.style.top=e.clientY-dragYoffset+'px';    
         }
         return false;
      }
      
      
   }

   function cleanup(e) {
   	   		    
      document.onmousemove=null;
      document.onmouseup=null;
      //document.onmousedown=null;
      
     selObj.style.zIndex = parseInt(zindex)+parseInt(selObj.style.zIndex)+'';
   	  zindex = 0;	
   	  if(parseInt(selObj.style.zIndex) < 0)
  	   selObj.style.zIndex = '0';

        	        	//document.myForm.gifUrl.value =selObj.style.zIndex;


      selObj.style.cursor=orgCursor;
      dragOK=false;
      
      if (updateTransform == true) {
       			selObj.setAttribute("data-anglex",anglex);
	  			selObj.setAttribute("data-angley",angley);
	 			selObj.setAttribute("data-angler",angler);
      }
      
      updateTransform = false;
      
      ajaxFunction("element");

      
      var IE = document.all?true:false

	  if (!IE) document.captureEvents(Event.MOUSEMOVE)

      document.onmousemove = getMouseXY;

	  
	  //document.write(selObj.getAttribute("data-angley"));
		
		//anglex=0;
		//angley=0;
      clickX=null;
      clickY=null;
      doNotRefresh = false;

   }
   

   

   function dragHandler(e){
      var htype='-moz-grabbing';
      
      doNotRefresh = true;
      
      if (e == null) { e = window.event; htype='move';} 
      
      //document.onmousedown=clickHandler;

      		
      var target = e.target != null ? e.target : e.srcElement;
      selObj=target;
      selObj=document.getElementById(selObj.id);
      
      orgCursor=target.style.cursor;
      
      if (target.className=="vidFrame"||target.className=="moveable") {
      
      target.style.cursor=htype;
         dragOK=true;
         
   		i_height = - parseInt(selObj.height);
  		i_width = -parseInt(selObj.width);
  		
         dragXoffset=e.clientX-parseInt(selObj.style.left);
         dragYoffset=e.clientY-parseInt(selObj.style.top);
         
         clickY=e.clientY;
         clickX=e.clientX ;
      
      	//document.console.console1.value = e.clientX +","+ clickX;
         
         document.onmousemove=moveHandler;
         document.onmouseup=cleanup;

         return false;
      }
   }
	 
	 document.onmousedown=dragHandler;

//########################	 
  ////////////////////
 /////AJAX STUFF/////
////////////////////
//######################

function ajaxFunction(reqType){
	
	
	if(doNotRefresh && reqType == 'refresh')
	{
	
		setTimeout("ajaxFunction('refresh')",10000);

	return false;
	}
	
	
	var ajaxRequest;  // The variable that makes Ajax possible!
		
	try{
		// Opera 8.0+, Firefox, Safari
		ajaxRequest = new XMLHttpRequest();
	} catch (e){
		// Internet Explorer Browsers
		try{
			ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try{
				ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e){
				// Something went wrong
				alert("Your browser broke!");
				return false;
			}
		}
	}
	
	// Create a function that will receive data sent from the server
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4){		
			
			

/*
			if (reqType == "replace"){
			document.write(ajaxRequest.responseText);
			}
*/

			//document.write(ajaxRequest.responseText);

			//var myObject =eval('(' + ajaxRequest.responseText + ')'); // JSON.parse(ajaxRequest.responseText, reviver);
			
			if(reqType != "element" || doNotRefresh){
			
			var myObject = JSON.parse(ajaxRequest.responseText);
			
			document.getElementById("mainDiv").innerHTML = myObject.images;
			document.body.style.backgroundColor = myObject.background;
			document.getElementById('console1').value = myObject.text;
			document.getElementById('console1').style.backgroundColor = myObject.background;
			
			}



			//document.write(ajaxRequest.responseText);
		
		}
	}
	
			if (reqType == 'refresh')
		{
		setTimeout("ajaxFunction('refresh')",10000);
		}
	
	var pageNumber = '<?= $pageNumber[0]?>';
	var table = '<?= $tableName ?>';

	
	if(reqType == "element"){
	
	var id = selObj.id;
	var left = selObj.style.left;
	var top = selObj.style.top;	
	var width = selObj.width;
	var height = selObj.height;	
	var anglexA = selObj.getAttribute("data-anglex");
	var angleyA = selObj.getAttribute("data-angley");
	var anglerA = selObj.getAttribute("data-angler");
	var zIndex = selObj.style.zIndex;
	
	
	var queryString = "?id=" + id + "&anglex=" + anglexA + "&angler=" + anglerA + "&angley=" + angleyA + "&height=" + height + "&zIndex=" + zIndex + "&left=" + left + "&top=" + top + "&table=" + table + "&width=" + width +  "&reqType=" + reqType + "&pageNumber=" + pageNumber;
	ajaxRequest.open("GET", "updatedb.php" + queryString, true);
	
	document.getElementById('lastId').value = selObj.id;
	
	//document.write(queryString);

	
	}
	
	if(reqType == "background"){
	var background = document.getElementById('background').value;
	if (background=="type color name or hex"){
	  background = '';
	}
	var queryString = "?background=" + background + "&name=" + table + "&reqType=" + reqType + "&pageNumber=" + pageNumber;
	ajaxRequest.open("GET", "updatedb.php" + queryString, true);
	}


	if(reqType == "text"){
	
	doNotRefresh = false;
	var text = document.getElementById('console1').value;
	//if (background=="type color name or hex"){
	//background = '';
	//}
	var table = 'text';	
	var queryString = "?text=" + text + "&name=" + table + "&reqType=" + reqType + "&pageNumber=" + pageNumber;
	ajaxRequest.open("GET", "updatedb.php" + queryString, true);
	}	
	
	if(reqType == "refresh"){	
	
	var queryString = "?name=" + table + "&reqType=" + reqType + "&pageNumber=" + pageNumber;
	ajaxRequest.open("GET", "updatedb.php" + queryString, true);

	}


	if(reqType == "add"){
	
	
		var ScrollTop = document.body.scrollTop;
 
		if (ScrollTop == 0)
		{
    		if (window.pageYOffset)
        		ScrollTop = window.pageYOffset;
    		else
        		ScrollTop = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;
		}
		
		
		var imgUrl = document.getElementById('gifUrlA').value;
		var addNumber = document.getElementById('addNumber').value;
		
		var queryString = "?imgUrl=" + imgUrl + "&ScrollTop=" + ScrollTop + "&addNumber=" + addNumber + "&reqType=" + reqType + "&pageNumber=" + pageNumber;
		ajaxRequest.open("GET", "updatedb.php" + queryString, true);
	}	
	
	
	if(reqType == "delete"){
	
	
	var deleteType = "";
	var	len = document.f1.deleteType.length;


	for (i = 0; i <len; i++) {
	if (document.f1.deleteType[i].checked) {
		deleteType = document.f1.deleteType[i].value;		
	}
	}
	
		//document.write(deleteType);

		var lastId = document.getElementById('lastId').value;
		
		var queryString = "?lastId=" + lastId + "&deleteType=" + deleteType + "&reqType=" + reqType + "&pageNumber=" + pageNumber;
		ajaxRequest.open("GET", "updatedb.php" + queryString, true);
	}
	
	
	if(reqType == "replace"){
	
	
		var replaceType = "";
		var	len = document.f2.replaceType.length;
		var imgUrl = document.getElementById('gifUrlR').value;

		for (i = 0; i <len; i++) {
		if (document.f2.replaceType[i].checked) {
			replaceType = document.f2.replaceType[i].value;		
		}
		}
	

		var lastId = document.getElementById('lastId').value;
		
		var queryString = "?lastId=" + lastId + "&imgUrl=" + imgUrl + "&replaceType=" + replaceType + "&reqType=" + reqType + "&pageNumber=" + pageNumber;
		

		
		ajaxRequest.open("GET", "updatedb.php" + queryString, true);
	}
	
	
	ajaxRequest.send(null);

	//return false;
	
}

function commentsEnter(){
doNotRefres = true;

}

ajaxFunction('refresh');

///////////////////////////
////SHORT CUT COMMANDS
/////////////////////////

var isR = false;
var isS= false;
var isCtrl = false;
document.onkeyup=function(e){
	if(e.which == 16) isCtrl=false;
	if(e.which == 82) isR=false;
		if(e.which == 83) isS=false;
	}
	
//shortcut keys	
document.onkeydown=function(e){

		if(e.which == 16) isCtrl=true;
		if(e.which == 17) isRealCtrl=true;
		if(e.which ==82) isR=true;
		if(e.which ==83) isS=true;

		
		if(e.which == 72 && isCtrl == true) {	
			if(document.getElementById("helpMenu").style.visibility == 'visible') {
				document.getElementById("helpMenu").style.visibility = 'hidden';
				createCookie('helpMenu',"hidden",90);
			}
			else {
				document.getElementById("helpMenu").style.visibility = 'visible';
				createCookie('helpMenu',"visible",90);
			}

			return false;
		}

		if(e.which == 65 && isCtrl == true) {
	
			if(document.getElementById("addMenu").style.visibility == 'visible') {
				document.getElementById("addMenu").style.visibility = 'hidden';
				createCookie('addMenu',"hidden",90);
		}
		else {
			document.getElementById("addMenu").style.visibility = 'visible';
			createCookie('addMenu',"visible",90);
		}

		return false;
	
		}
		
		if(e.which == 82 && isCtrl == true) {
	
			if(document.getElementById("replaceMenu").style.visibility == 'visible') {
				document.getElementById("replaceMenu").style.visibility = 'hidden';
				createCookie('replaceMenu',"hidden",90);
			}
			else {
				document.getElementById("replaceMenu").style.visibility = 'visible';
				createCookie('replaceMenu',"visible",90);
			}

		return false;
		}
		
		if(e.which == 68 && isCtrl == true) {
	
			if(document.getElementById("deleteMenu").style.visibility == 'visible') {
				document.getElementById("deleteMenu").style.visibility = 'hidden';
				createCookie('deleteMenu',"hidden",90);
			}
			else {
				document.getElementById("deleteMenu").style.visibility = 'visible';
				createCookie('deleteMenu',"visible",90);
			}

		return false;
	
		}
		
		if(e.which == 66 && isCtrl == true) {
	
			if(document.getElementById("backgroundMenu").style.visibility == 'visible') {
				document.getElementById("backgroundMenu").style.visibility = 'hidden';
				createCookie('backgroundMenu',"hidden",90);
			}
			else {
				document.getElementById("backgroundMenu").style.visibility = 'visible';
				createCookie('backgroundMenu',"visible",90);
			}

		return false;
	
		}
		
		if(e.which == 70 && isCtrl == true) {
	
			if(document.getElementById("faceMenu").style.visibility == 'visible') {
				document.getElementById("faceMenu").style.visibility = 'hidden';
				createCookie('faceMenu',"hidden",90);
			}
			else {
				document.getElementById("faceMenu").style.visibility = 'visible';
				createCookie('faceMenu',"visible",90);
			}

		return false;
	
		}
				
		if(e.which == 67 && isCtrl == true) {
	
			if(document.getElementById("newMenu").style.visibility == 'visible') {
				document.getElementById("newMenu").style.visibility = 'hidden';
				createCookie('newMenu',"hidden",90);
			}
			else {
				document.getElementById("newMenu").style.visibility = 'visible';
				createCookie('newMenu',"visible",90);
			}

		return false;
	
		}
		
		if(e.which == 88 && isRealCtrl == true) {
	
			document.getElementById('delete').click();
			return false;
	
		}
		
		
	}

//for clicking on menus
function openMenu(menuType){

	if(document.getElementById(menuType).style.visibility == 'visible') {
				document.getElementById(menuType).style.visibility = 'hidden';
				createCookie(menuType,"hidden",90);
			}
			else {
				document.getElementById(menuType).style.visibility = 'visible';
				createCookie(menuType,"visible",90);
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



