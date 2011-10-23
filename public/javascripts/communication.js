//////////
//INITS
///////

var pageData;



now.ready(function(){
	// "Hello World!" will print on server
	//now.logStuff("Hello World!");
	console.log('loadingData');

	nowReady=true;
	loadData();

	//now.setUserPage(pageName);

});
var myName;
function loadData(){

	if(nowReady){// && windowReady){
	
		if(myName==undefined)
			myName="noob"
		now.getPagePermissions(pageName,userProfile, function(err,name){
			if (!err)
				myName = name;
				now.loadAll(pageName,userProfile,loadAll)
		})
	}
}

now.pushChanges = function(pageData){
	jsonToDom(pageData);
}    	

now.setPagePermissions = function(_permissions, _owner){
	var permissions = _permissions;
	var owner = _owner;
}


function loadAll(error, pageData){
	if(error != null){
		
		//TODO: re-enable this
		alert('PLEASE LOG IN TO VIEW PROFILES')
		window.location= "/"
		console.log(error)
		return;
	}
	jsonToDom(pageData)
}

/////////////
//PAGE USERS
///////////

var noobs=0;

var defaultIcon = new Image();

defaultIcon.src = 'http://dump.fm/images/20110926/1317014842765-dumpfm-FAUXreal-1297659023374-dumpfm-frankhats-yes.gif';

defaultIcon.style.width = '20px';

now.updatePageUser = function(action, userArray, profileName){

/*
	if(pageName=='profile' && userProfile != profileName)
		return;
*/

	if(action == 'add'){
		
	for(var i in userArray){
		username = userArray[i];
		
			for(var user in username){
			if(document.getElementById(user)==undefined){
				var newDiv = document.createElement('div');
				newDiv.id = user;
				newDiv.className ="usersOnline"
				var userIcon = new Image();
				
				if(username[user]){
					if(userIcon.width>userIcon.height)
						userIcon.style.width = '20px';
					else
						userIcon.style.height = '20px';
					userIcon.src = username[user];
				}
				else userIcon = defaultIcon;
				
				newDiv.appendChild(userIcon);
				
				if(user!="noob")
					newDiv.innerHTML += " <b><a href='/profile/"+user+"'>"+user+"</a></b> ";
				else
					newDiv.innerHTML += " <b>"+user+"</b>";
									
				newDiv.style.paddingLeft="7px";
				newDiv.style.paddingRight="7px";
				newDiv.style.paddingBottom="2px";

				document.getElementById('online').appendChild(newDiv);
				if (user=='noob')
					noobs++;
			}
			else if(user=='noob'){
				noobs++;
				document.getElementById('noob').innerHTML="";
				document.getElementById('noob').appendChild(defaultIcon);
				document.getElementById('noob').innerHTML+="<b>"+noobs+" noobs</b>";
			}
		}
	}	
	}
	if(action == 'delete'){
		
/* 	for(var user in userArray){ */
		var user = userArray;
		if(user!='noob' || noobs == 1)
			document.getElementById('online').removeChild(document.getElementById(user));		
		else if (user == 'noob'){
			noobs--;
			if(noobs>1){
				document.getElementById('noob').innerHTML="";
				document.getElementById('noob').appendChild(defaultIcon);
				document.getElementById('noob').innerHTML+="<b>"+noobs+" noobs</b>";				}
			else{
				document.getElementById('noob').innerHTML="";
				document.getElementById('noob').appendChild(defaultIcon);
				document.getElementById('noob').innerHTML+="<b>"+noobs+" noob</b>";				}
		}
	//}
	}
}


/////////
/////ADD
///////

function addNewImg(){


		var imgUrl = document.getElementById('gifUrlA').value;

		if(pageName=="profile"){
			now.updateUserPic(userProfile,imgUrl,function(error){
				if(!error)
					document.getElementById('userImage').src=imgUrl;
				})
			return;
		}

		var scrollTop = document.body.scrollTop;
		var scrollLeft = document.body.scrollLeft;

		if (scrollTop == 0)
		{
    		if (window.pageYOffset){
        		scrollTop = window.pageYOffset;
        		scrollLeft = window.pageXOffset;
			}
    		else{
        		scrollTop = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;
        		scrollLeft = (document.body.parentElement) ? document.body.parentElement.scrollLeft : 0;	
			}
		}
		
		var addObject = {};
		
		//TODO RESET RADIOS!
		
		addObject.top = Math.random()*500 + scrollTop+"px";
		addObject.left = Math.random()*900 + scrollLeft+"px";
		
		if(addType=="div" || addType=="text"){	
			addObject.height="300px";
			addObject.width="400px";	
		}
		else{
			addObject.height="auto";
			addObject.width="auto";		
		}
		addObject.z = Math.random()*50;
		
		
		addObject.angler=0;
		addObject.angley=0;
		addObject.anglex=0;
		if ($("input[name='geoPreset']:checked").val() == 'hPlane') {
			addObject.angley=90;
			addObject.height="1000px";
			addObject.width="1000px";
			addObject.z = -500;
		}		
		else if ($("input[name='geoPreset']:checked").val() == 'vPlane') {
			addObject.anglex=90;
			addObject.width="1000px";
			addObject.height="1000px";
			addObject.z = -500;
		}	

		$('input[name="geoPreset"]').attr('checked', false);
		
		addObject.contentType=addType;

		if(addType == "image"){
			addObject.url = imgUrl;
		}
		else if(addType == "media"){
			addObject.content=document.getElementById("media").value;
			number=1;
		}
		else if(addType =='text'){
			addObject.content = $('textarea.tinymce').val();
		}
		if(addType == "div"){
			addObject.backgroundColor=document.getElementById("divColor").value;
			addObject.backgroundImage=document.getElementById("divBgUrl").value;
			number=1;
		}
				
		var number = parseInt(document.getElementById('addNumber').value);
		now.addNewImg(pageName, addObject, number, scrollTop, scrollLeft);
}

now.newImg = function(img){

	pageData.images.push(img);
	//TODO: make this more efficient?
	imageToDom(img)

}

///////////
////DELETE
/////////

function deleteImage(){

	var deleteType = "";
	var	len = document.f1.deleteType.length;
	var lastId =pageData.lastId;

	if(lastId == undefined)
		return;

	for (i = 0; i <len; i++) {
		if (document.f1.deleteType[i].checked) {
			deleteType = document.f1.deleteType[i].value;
		}		
	}
	var all = false;
	if(deleteType == "all")
		all=true;

	now.deleteImage(pageName, lastId, all);
	
}

now.deleteResponce = function(imgId, all){

	var mainDiv = document.getElementById("mainDiv");	

	if(all){
		mainDiv.innerHTML="";
	}
	else{
 	  var img = document.getElementById(imgId);
  	  mainDiv.removeChild(img);
	}
}

///////////
//REPLACE
/////////

function replaceImg(){
	var replace = "";
	var	len = document.f2.replaceType.length;
	var lastId =pageData.lastId;

	if(lastId == undefined)
		return;
		
	for (i = 0; i <len; i++) {
		if (document.f2.replaceType[i].checked) {
			replaceType = document.f2.replaceType[i].value;
		}		
	}
	var all = false;
	if(replaceType == "all")
		all=true;

	var editElement = {}
	editElement = pageData.images[lastId];
	editElement.url = $("#editImage").val();
	//TODO: media/content
	//editElement.content = $("#editMedia").val()
	editElement.content = $("#editContent").val();
	editElement.backgroundImage = $("#editBackgroundColor").val()
	editElement.backgroundColor = $("#editBackgroundImage").val()
	

	//var newUrl = document.getElementById('gifUrlR').value;
	
	//now.updateElement(pageName, lastId, 'url', newUrl, all, null);
	now.editElement(pageName, lastId,editElement,all, null);	
}

/////////
//UPDATE
///////

function updateElement(element, property, value){
	
	var all = false;

	now.updateElement(pageName, element.id, property, value, all, function(error,response){
		if(error!=null)
			console.debug("there was an error")
		else if(response=="done")
			doNotRefresh=false;
	});
}

now.updateChanges = function(_id, property, value){
			pageData.images[_id][property]=value;
			pageData.images[_id].id=_id;
			imageToDom(pageData.images[_id]);
}


//////////
//PRIVACY
////////

function setPrivacy(){
	var setPrivacy;
	var	len = document.privacy.privacy.length;
	for (i = 0; i <len; i++) {
		if (document.privacy.privacy[i].checked) {
			setPrivacy = document.privacy.privacy[i].value;
		}		
	}
	now.setPrivacy(pageName, setPrivacy, function(error){		
		if(!error) openMenu('pageMenu');
		}
	);
}

	//TODO: better notification of privay
	now.pagePrivacy = function(setPrivacy){
	privacy = setPrivacy;
}


///////////////////
///ADD DELETE PAGE
//////////////////


function addPage(copyPage){
	if(copyPage==true)
		copyPage=pageName;
	else
		copyPage=null;
		
	var desiredPageName = document.getElementById('newPage').value;
	now.addPage(desiredPageName, copyPage, function(error, newPage){
			if(error) alert(error);
			else window.location = newPage;		
		})
}

function deletePage(){

	var r=confirm("ARE YOU SURE YOU WANT TO DELETE THIS PAGE?");
	if (r==true)
	  {
		now.deletePage(pageName, function(error){		
			if (error != null) alert(error)
			else window.location = "./";		
		})
	  }
	else
	  {
		//
	  }
	show_confirm();
}


//////////
////IMAGE
////////

function imageToDom(image, property){

	var img = document.getElementById(image._id);
	pageData.images[image._id]=image;

	var contentType = image.contentType;
	if(contentType==undefined)
		contentType="image"

	if(img == undefined){
		
		if(contentType=="image")
			img = document.createElement('img');
		else{
			
			img = document.createElement('div');
			if(image.backgroundColor != undefined)
				img.style.backgroundColor = image.backgroundColor;
			if(image.backgroundImage != undefined)
				img.style.backgroundImage = 'url(' + image.backgroundImage + ')';
		
		}
		img.id = image._id;
		img.style.position = 'absolute';
		img.className = 'editableElement';
		img.style.cursor='move';
		img.style.zIndex = 100; 
		document.getElementById("mainDiv").appendChild(img);	

	}
	
	//TODO: optimise this
	
	if(contentType=="image" && img.src != image.url)
		img.src=image.url;
	else{
		if(image.content != undefined)
			img.innerHTML = image.content;
		img.style.paddingTop="10px";
		img.style.webkitTransformStyle= "preserve-3d";

	}
	img.style.left = image.left;
	img.style.top = image.top;	
	img.style.width = image.width;
	img.style.height = image.height;
	
	
	var z = image.z;
	var anglex = image.anglex
	var angley = image.angley;
	var angler = image.angler;
	
	var transform = 'translateZ('+ z + 'px)'+' '+ 'rotateY('+ anglex+'deg)'+ ' ' + 'rotateX('+angley +'deg)'+' '+'rotateZ('+angler+'deg)';
	
	img.style.webkitTransform = transform;
		
}

function setBackground(type){

	if(type=="backgroundImage"){
		var background = document.getElementById('backgroundImage').value;
	}

	if(type=="background"){
		var background = document.getElementById('background').value;
		if (background=="type color name or hex"){
		  	background = '';
		}
	}
	
	if(pageName=="profile"){
		now.setProfileBackground(userProfile, type, background,function(err){
			if(!err){
				if(type=="background")
					document.body.style.backgroundColor = background;
				if(type=="backgroundImage")
					document.body.style.backgroundImage = 'url('+background+')';			
			}
		});
	}
	else
		now.setBackground(pageName, type, background);
}

now.backgroundResponce = function(type, background){

	if(type=="background")
		document.body.style.backgroundColor = background;
	if(type=="backgroundImage")
		document.body.style.backgroundImage = background;

}

////////////
///TXT/////
//////////
var maxrows=6;

function doResize() {
	var txtbox=document.getElementById("inputBox");
   
	if (txtbox.value=="")
		txtbox.rows=1;
	   
     while (txtbox.scrollHeight > txtbox.offsetHeight && txtbox.rows < maxrows) {  
            if (txtbox.rows < maxrows) {  
                txtbox.rows = txtbox.rows + 1; 
			}
		}
}

function enter(evt){
	var charCode = (evt.which) ? evt.which : window.event.keyCode; 
	if (charCode == 13){ 
		
		evt.preventDefault;
		var inputBox = document.getElementById("inputBox");
		var inputTxt = inputBox.value;
		
		inputBox.value="";
		now.submitComment(pageName,userProfile,inputTxt);
		evt.preventDefault();
		//inputBox.blur();
		//document.yourform.submit();
	} 		
}

var lastPost="";
var lastTxtDiv;

now.updateText = function(user, text){

	if(user==lastPost){
		lastTxtDiv.innerHTML+="<br>"+text;
	}
	else{
		var newTxtDiv = document.createElement('div');
		//text.remove(/<script\b[^>]*>(.*?)<\/script>/i)
		newTxtDiv.innerHTML ="<b><a href='/profile/"+user+"'>"+user+"</a>:</b> " +text;
		newTxtDiv.style.paddingBottom="1px";
		//newTxtDiv.innerHTML = newDiv.innerHTML;			
		document.getElementById('chatBox').appendChild(newTxtDiv);
		lastPost=user;
		lastTxtDiv=newTxtDiv;
	}
	document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
	changeBackground();
}


/////////
////PAGE
///////


function jsonToDom(pageDataIn){
	
	
	pageData = pageDataIn;

	
	
	document.body.style.backgroundColor = '';
	document.body.style.backgroundImage = '';

	document.getElementById("mainDiv").innerHTML="";
	document.getElementById("mainDiv").style.webkitTransform ='rotateX(0deg)' + ' ' + 'rotateY(0deg)';

	document.getElementById('userPages').style.display='none';
	document.getElementById('pagesList').innerHTML="";
	document.getElementById('contributePages').style.display='none';
	document.getElementById('cList').innerHTML="";

	document.getElementById('profileContainer').style.display='none';
	//document.getElementById('profileContainer').innerHTML="";	
	
	$("#userImage").remove();
	$("#userName").remove();

	if(pageData.pageName != "main" && pageData.pageName != "profile")
		document.getElementById('pageName').innerHTML = pageData.pageName + " by <a href='javascript:goToPage(\""+pageData.owner+"\",\"profile\")'>"+pageData.owner+"</a>";
	else
		document.getElementById('pageName').innerHTML="";

	if(pageData.images != undefined){
		for(var i=0; i<pageData.images.length; i++){
			
			var contentType = pageData.images[i].contentType;
			if(contentType==undefined)
				contentType="image";
			
			pageData.images[pageData.images[i]._id]=pageData.images[i];
			var img = document.getElementById(pageData.images[i]._id);
			
			if(img == undefined){
				
				if(contentType=="image")
					img = document.createElement('img');
				else{
					img = document.createElement('div');
					if(pageData.images[i].backgroundColor != undefined)
						img.style.backgroundColor = pageData.images[i].backgroundColor;
					if(pageData.images[i].backgroundImage != undefined)
						img.style.backgroundImage = 'url('+ pageData.images[i].backgroundImage + ')';
				}
				img.id = pageData.images[i]._id;
				img.style.position = 'absolute';
				img.className = 'editableElement';
				img.style.cursor='move';
				img.style.zIndex = 100; 
			}

			//TODO: optimise this
			
			if(contentType=="image" && img.src != pageData.images[i].url)
				img.src=pageData.images[i].url;
			else{
				if(pageData.images[i].content != undefined)
					img.innerHTML = pageData.images[i].content;
				img.style.paddingTop="10px";
				img.style.webkitTransformStyle= "preserve-3d";


			}
			
			img.style.left = pageData.images[i].left;
			img.style.top = pageData.images[i].top;	
			img.style.width = pageData.images[i].width;
			img.style.height = pageData.images[i].height;	
			img.style.opacity = pageData.images[i].opacity;
			
			var z = pageData.images[i].z;
			var anglex = pageData.images[i].anglex
			var angley = pageData.images[i].angley;
			var angler = pageData.images[i].angler;
			
			var transform = 'translateZ('+ z + 'px)'+' '+ 'rotateY('+ anglex+'deg)'+ ' ' + 'rotateX('+angley +'deg)'+' '+'rotateZ('+angler+'deg)';
			
			img.style.webkitTransform = transform;					
			document.getElementById("mainDiv").appendChild(img);	
		}
	}
		
	//document.getElementById('console1').value = pageData.text;

	//var bgimage = new Image ();
	//bgimage.src=

	var div3d = document.getElementById("div3d");

	if(pageData.backgroundImageType == undefined){
		//document.body.style.backgroundImage = "";
		document.body.style.backgroundImage=pageData.backgroundImage;
	}
	
	if(pageData.backgroundImageType == 0)
		document.body.style.backgroundImage = pageData.backgroundImage;

	if(pageData.backgroundImageType == 1){
		var bgimg = '-webkit-gradient(' + pageData.backgroundImage +')'
		document.body.style.backgroundImage = bgimg;	
	}

	if(pageData.backgroundImageType == 2){
		document.body.style.backgroundImage=pageData.backgroundImage;
	}
	
	document.body.style.backgroundColor = pageData.background;

	
	if(pageName=="profile")
		now.loadProfileInfo( userProfile,loadProfileInfo);		

	//TODO: customise for user
	if(pageName=="main")
		now.loadMainPage( null,loadProfileInfo);	
}

var profileInfo={}

loadProfileInfo = function(info){

	profileInfo=info;
	
	document.body.style.backgroundColor=profileInfo.background;
	document.body.style.backgroundImage=profileInfo.backgroundImage;

	if(pageName=="profile"){
		document.getElementById('profileContainer').style.display="block"
		var containerDiv=document.getElementById('profileContainer');
		//containerDiv.id="profileContainer";
		//containerDiv.className="shadow";
		//var r = Math.random()
		//containerDiv.style.backgroundColor=colorList[Math.floor(r*colorList.length)];
		
		var userNameDiv=document.createElement('div');
		userNameDiv.id="userName";
		userNameDiv.innerHTML="<a href='javascript:changeProfileColor()'>"+profileInfo.username+"</a>"
		containerDiv.appendChild(userNameDiv);
		
		var url;
		if(profileInfo.userImage=="")
			url = "http://dump.fm/images/20110926/1317014842765-dumpfm-FAUXreal-1297659023374-dumpfm-frankhats-yes.gif"	
		else
			url=profileInfo.userImage;
		
		userImage = document.createElement('img');
		userImage.id = 'userImage';
	
		userImage.style.zIndex = 100; 
		userImage.src = url;
		userImage.style.width = "93%";
		userImage.style.height = "auto";
	
		containerDiv.appendChild(userImage);
		containerDiv.style.display='block';
		//document.body.appendChild(containerDiv);
	}
	
	///fill out pages

	for(var i =0;i<profileInfo.pages.length;i++){
	
		var thisPage=profileInfo.pages[i];
	
		if(thisPage.pageName!= "profile" && thisPage.pageName!= "main"){
			newDiv = document.createElement('div');
			newDiv.innerHTML = "<a href='javascript:goToPage(\""+profileInfo.pages[i].pageName+"\")'>"+profileInfo.pages[i].pageName+"</a>";
			newDiv.style.paddingBottom="1px";
			newDiv.style.position='relative'
	
			infoDiv = document.createElement('div');

			infoDiv.id=thisPage._id;
			infoDiv.className="infoDiv";
			
			var infoTxt=""
			if(pageName=="profile"){
				if(thisPage.owner==profileInfo.username)
					infoTxt +='owner'
				else
					infoTxt +='contributor'
			}			
			
			if(thisPage.likes!=undefined && thisPage.likes.length > 0)
				infoTxt += " "+thisPage.likes.length+" likes"; 
			
			if(thisPage.contributors != undefined && thisPage.contributors.length > 0)
				infoTxt += " "+thisPage.contributors.length+" contributors"; 
	
			infoDiv.innerHTML = infoTxt;
			newDiv.appendChild(infoDiv);

			document.getElementById('pagesList').appendChild(newDiv);
		}
	}
	document.getElementById('userPages').style.display='block';

/*
	if(pageName=="main")
		var lastDiv = "users"
	if(pageName=="profile")
		var lastDiv = "contributedTo"
*/
	if(pageName=="main"){
		for(var i =0;i<profileInfo.users.length;i++){
		
			//if(profileInfo.users[i].pageName!= "profile_"+profileInfo.username){
				newDiv = document.createElement('div');
				newDiv.innerHTML = "<a href='javascript:goToPage(\""+profileInfo.users[i].username+"\",\"profile\")'>"+profileInfo.users[i].username+"</a>";
				newDiv.style.paddingBottom="1px";
				
			document.getElementById('cList').appendChild(newDiv);
	
			//}		
		}
	
	
		document.getElementById('contributePages').style.display='block';
}

	changeBackground();
	changeProfileColor()

}

changeProfileColor =function(){
	var r = Math.random()
	var color=bgColorList[Math.floor(r*bgColorList.length)];
	var r = Math.random()
	var color2=bgColorList[Math.floor(r*bgColorList.length)];
	containerDiv=document.getElementById('profileContainer');
	document.getElementById('userPages').style.backgroundColor='rgba(255,255,255,.85)';
	document.getElementById('contributePages').style.backgroundColor='rgba(255,255,255,.85)';

	containerDiv.style.backgroundColor=color;
}