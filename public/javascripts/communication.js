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

	if(nowReady && windowReady){
	
		if(currentUser==undefined){
			currentUser="n00b"
			privacy=null;
			}
		now.getPagePermissions(pageName,userProfile, function(err,name,_permissions){
			if (!err)
				privacy=_permissions;
				currentUser=name;
				now.loadAll(pageName,userProfile,version,loadAll)
		})
	}
}

now.pushChanges = function(pageData){

/*
	var currentPageVersions={}
	currentVersions[pageData.pageName]=pageData.versions
	currentVersions[pageData.pageName].reverse;
	var totalVersions = pageData.currentVersion;
*/

	if(version != undefined){
		versions[0].text=pageData.text
		jsonToDom(pageData.versions[0]);
		}		
	else
		jsonToDom(pageData);
}    	

now.setPagePermissions = function(_permissions, _owner){
	privacy = _permissions;
	if (privacy=='owner')
		privacy=0;
	var owner = _owner;
	if(owner){
		$("#settingsButton").show();
		if(version!=undefined)
			$("#deleteVersion").show();			
	}
	else{
		$("#settingsButton").hide();
		$("#deleteVersion").hide();			
	}
}


function loadAll(error, pageData, notifications){
	if(error != null){
		
		//TODO: re-enable this
		alert('PLEASE LOGIN TO DO THIS')
		//alert(error)
		goToPage('main')
		console.log(error)
		return;
	}
		
	var lastVersion=pageData.currentVersion;
	
	if(pageData.pageName=='main')
		now.getAllUsers(function(allPages){fillOnline(allPages)})
		
		
	if(version != undefined){
		if(version>0)
			prevVersion=version-1;
		else prevVersion=undefined;
		
		if(version == undefined || version==lastVersion-1)
			nextVersion=undefined;
		else nextVersion=version+1;	

		pageData.versions[0].text=pageData.text;
		jsonToDom(pageData.versions[0]);

	}
	else{
		if(lastVersion>0)
			prevVersion=lastVersion-1;	
		jsonToDom(pageData);
	}
}

/////////////
//PAGE USERS
///////////

var n00bs=0;
var defaultIcon = new Image();
defaultIcon.src = 'http://dump.fm/images/20110926/1317014842765-dumpfm-FAUXreal-1297659023374-dumpfm-frankhats-yes.gif';
defaultIcon.style.width = '20px';

now.updatePageUser = function(action, userArray, profileName){

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
				
				if(user!="n00b")
					newDiv.innerHTML += " <b><a href='/profile/"+user+"'>"+user+"</a></b> ";
				else
					newDiv.innerHTML += " <b>"+user+"</b>";
									
				newDiv.style.paddingLeft="7px";
				newDiv.style.paddingRight="7px";
				newDiv.style.paddingBottom="2px";

				document.getElementById('online').appendChild(newDiv);
				if (user=='n00b')
					n00bs++;
			}
			else if(user=='n00b'){
				n00bs++;
				document.getElementById('n00b').innerHTML="";
				document.getElementById('n00b').appendChild(defaultIcon);
				document.getElementById('n00b').innerHTML+="<b>"+n00bs+" n00bs</b>";
			}
		}
	}	
	}
	if(action == 'delete'){
		var user = userArray;
		if(user!='n00b' || n00bs == 1)
			document.getElementById('online').removeChild(document.getElementById(user));		
		else if (user == 'n00b'){
			n00bs--;
			if(n00bs>1){
				document.getElementById('n00b').innerHTML="";
				document.getElementById('n00b').appendChild(defaultIcon);
				document.getElementById('n00b').innerHTML+="<b>"+n00bs+" n00bs</b>";				}
			else{
				document.getElementById('n00b').innerHTML="";
				document.getElementById('n00b').appendChild(defaultIcon);
				document.getElementById('n00b').innerHTML+="<b>"+n00bs+" n00b</b>";				}
		}
	}
}


/////////
/////ADD
///////

function addNewImg(){

		if(version!=undefined){
			alert("You can't edit saved versions")
			return;
		}

		var number = parseInt(document.getElementById('addNumber').value);

		var is2d = $('#add2d').is(':checked'); 

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
		var imgArray =[];

		for(var i =0;i<number;i++){
		
			var addObject = {};
			
			addObject.d2d=is2d;
			
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
				addObject.content = $('#addContent').val();
			}
			if(addType == "div"){
				addObject.backgroundColor=document.getElementById("divColor").value;
				addObject.backgroundImage=document.getElementById("divBgUrl").value;
				number=1;
			}
			imgArray.push(addObject);
		}		
		now.addNewImg(pageName, imgArray, scrollTop, scrollLeft);
}

now.newImg = function(img){

	if(version!=undefined)
		return;
	//TODO: watch out on page save! not necessary?
	if(img.length!=undefined){
		for(var i=0;i<img.length;i++){
			if(pageData.images[img._id]==undefined)
				pageData.images.push(img[i]);
				imageToDom(img[i])		
		}
	}
	else{	
		if(pageData.images[img._id]==undefined)
			pageData.images.push(img);
	
		//TODO: make this more efficient?
		imageToDom(img)
	}

}

///////////
////DELETE
/////////

function deleteImage(){

	if(version!=undefined){
		alert("You can't edit saved versions")
		return;
	}

	var deleteType = "";
	var	len = document.f1.deleteType.length;
	var lastId =pageData.lastId;

	for (i = 0; i <len; i++) {
		if (document.f1.deleteType[i].checked) {
			deleteType = document.f1.deleteType[i].value;
		}		
	}
	var all = false;
	if(deleteType == "all")
		all=true;
		
	if(!all && lastId == undefined)
		return;

	now.deleteImage(pageName, lastId, all);
	
	$("input[name=deleteType]").filter("[value=one]").attr("checked",true);	
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
	
	if(version!=undefined){
		alert("You can't edit saved versions")
		return;
	}
	
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
	if( editElement.contentType == "media")
		editElement.content = $("#editMedia").val()
	if( editElement.contentType == "text")
		editElement.content = $("#editContent").val();
	editElement.backgroundColor = $("#editBackgroundColor").val()
	editElement.backgroundImage = $("#editBackgroundImage").val()
	editElement.d2d=$('#edit2d').is(':checked');

	//var newUrl = document.getElementById('gifUrlR').value;
	
	//now.updateElement(pageName, lastId, 'url', newUrl, all, null);
	now.editElement(pageName, lastId,editElement,all,false, null);	
}

/////////
//UPDATE
///////

function updateElement(element, property, value){

	if(version!=undefined){
		alert("You can't edit saved versions")
		return;
	}
	
	var all = false;
	now.updateElement(pageName, element.id, property, value, all, function(error,response){
		if(error!=null)
			console.debug("there was an error")
		else if(response=="done")
			doNotRefresh=false;
	});
}

now.updateChanges = function(_id, property, value){


	if(version!=undefined){
		//alert("You can't edit saved versions")
		return;
	}
			
	pageData.images[_id][property]=value;
	pageData.images[_id].id=_id;
	imageToDom(pageData.images[_id]);
}


//////////
//PRIVACY
////////

function setPrivacy(){
	var setPrivacy;
	
	var is2d = $('#2d').is(':checked'); 
	
	var	len = document.privacyForm.privacy.length;
	for (i = 0; i <len; i++) {
		if (document.privacyForm.privacy[i].checked) {
			setPrivacy = document.privacyForm.privacy[i].value;
		}		
	}
	
	var editors = addEditorsEl.tagify('serialize').split(',');
	
	now.setPrivacy(pageName, setPrivacy,editors,is2d, function(error){		
		if(!error) openMenu('pageMenu');
		else console.log(error);
		}
	);
}

//TODO: better notification of privacy
now.pagePrivacy = function(setPrivacy,d2d){
	privacy = setPrivacy;
	if(pageData.editors != undefined){

		if(currentUser==pageData.owner)
			privacy  =0;
		
		else if(jQuery.inArray(currentUser, pageData.editors)!=-1)
			privacy = 0;
			
	}

/*
	if (d2d){
		//$('#div3d, #mainDiv').css('webkitTransform','none');
		document.getElementById('div3d').style.webkitTransformStyle='flat';
		document.getElementById('mainDiv').style.webkitTransformStyle='flat';
	}
	else{
		document.getElementById('div3d').style.webkitTransformStyle='preserve-3d';
		document.getElementById('mainDiv').style.webkitTransformStyle='preserve-3d';	
	}
*/
	
}


///////////////////
///ADD DELETE SAVE PAGE
//////////////////


function addPage(copyPage){
	if(copyPage==true)
		copyPage=pageName;
	else
		copyPage=null;
		
	var desiredPageName = document.getElementById('newPage').value;
	now.addPage(desiredPageName, copyPage, function(error, newPage){
			if(error) alert(error);
			else goToPage(newPage)		
		})
}

function deletePage(){

	if(version!=undefined){
		alert("this will delete the main page and all versions")
		return;
	}

	var r=confirm("ARE YOU SURE YOU WANT TO DELETE THIS PAGE AND ALL SAVED VERSIONS?");
	if (r==true)
	  {
		now.deletePage(pageName, function(error){		
			if (error != null) alert(error)
			else goToPage('main');		
		})
	  }
	else
	  {
		//
	  }
	show_confirm();
}

function saveVersion(){

	if(version!=undefined){
		alert("You can't save this version again")
		return;
	}

	now.saveVersion(function(err,savedVersion){
		if(err)
			alert(err)
		else {alert("This version of the page has been SAVED as version " + savedVersion);
			prevVersion = savedVersion;
			
			$("#prevVersionDiv").show();
		}
	})

}

function deleteVersion(){

	var r=confirm("ARE YOU SURE YOU WANT TO DELETE THIS VERSION?");
	
	if(version!=undefined){ 
	
			if (r==true){
				now.deletePageVersion(pageData._id,function(error){
	
				if(error)
					alert("THERE WAS AN ARROR, VERSION NOT DELETED")

				else
				  {
				  	if(version>0)
						goToPage(pageName,null,version-1);
					else goToPage(pageName,null,null);
	
				  }
			})
		}
		

		

		show_confirm();	
	}
}

///////////////
///BACKGROUND
///////////

function setBackground(type){

	if(version!=undefined){
		alert("You can't edit saved versions")
		return;
	}

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


	if(version!=undefined)
		return;

		
	if(type=="background")
		document.body.style.backgroundColor = background;
	if(type=="backgroundImage")
		document.body.style.backgroundImage = background;

}



////////////
///TXT/////
//////////
function fillChat(user, text) {

	var newTxtDiv = document.createElement('div');
	//text.remove(/<script\b[^>]*>(.*?)<\/script>/i)
	newTxtDiv.innerHTML ="<b><a href='/profile/"+user+"'>"+user+"</a>:</b> " +text;
	newTxtDiv.style.paddingBottom="1px";
	//newTxtDiv.innerHTML = newDiv.innerHTML;			
	document.getElementById('chatBox').appendChild(newTxtDiv);
	lastPost=user;
	lastTxtDiv=newTxtDiv;
	document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;

}


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
		if(currentUser=='n00b'){
			alert("YOU HAVE TO LOG IN TO DO POST COMMENTS")
			var inputBox = document.getElementById("inputBox");
			inputBox.value="";
			return;
		}

		
		evt.preventDefault;
		var inputBox = document.getElementById("inputBox");
		var inputTxt = inputBox.value;
		
			var textObject = {};
				textObject.text = inputTxt;
				textObject.time = new Date();

		
		inputBox.value="";
		now.submitComment(pageName,textObject, userProfile);
		evt.preventDefault();

	} 		
}

var lastPost="";
var lastTxtDiv;

now.updateText = function(user, text){

	if(user==lastPost){
		lastTxtDiv.innerHTML+="<br>"+text;
	}
	else{
		fillChat(user,text);

	}
	document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
	changeBackground();

}



function searchUsers(){

	var addEditorsEl = $('textarea.addEditors')

	var txt = addEditorsEl.tagify('inputField').val();
	if(txt=="")
		return;
	
	now.findUser(txt,function(userArray){

		var newArray=[]
		for(var i = 0; i<userArray.length;i++){
			newArray.push(userArray[i].username)
		}
		addEditorsEl.tagify('inputField').autocomplete({
		    source: newArray,
		    position: { of: addEditorsEl.tagify('containerDiv'), 
		    			my:"left top",
		    			at:"left bottom" },
		    select: function(){this.okToAdd = true},
		    close: function(event, ui) { if(this.okToAdd) addEditorsEl.tagify('add'); this.okToAdd = false;}
		});

	})

}


/////////
///LIKE
///////

likePage = function(){

	var action;
	if(liked==-1){
		action='like';
		}
	else{
		action='unlike';
		}

	now.likePage(action, version,function(err){
		
		if(err==null){		
			buttonPress("likePage")
			if(action=="like"){
				pageData.likesN++
				$('#likeButtonText').html(pageData.likesN + ' unlike page');
				liked = 0;
				}	
			else{
				liked = -1;
				pageData.likesN--
				$('#likeButtonText').html(pageData.likesN + ' like page');	
				}
		}
	})
}

var lastNote;
var lastMainNote;

now.notify = function(_notify,newN,main){

	if(!windowReady){
		setTimeout(function(){now.notify(_notify,newN)},300);
		return;
	}
		

	for(var n=0;n<_notify.length;n++){
		if(main && lastMainNote &&lastMainNote.version ==_notify[n].version && lastMainNote.user==_notify[n].user && lastMainNote.page==_notify[n].page && lastMainNote.action==_notify[n].action)
			continue;
		if(!main && lastNote &&lastNote.version ==_notify[n].version && lastNote.user==_notify[n].user && lastNote.page==_notify[n].page && lastNote.action==_notify[n].action)
			continue;
		if(_notify[n].action=='like')
			var actionVerb='liked'
		else if(_notify[n].action=='update')
			var actionVerb='updated'
						
			if(newN==undefined && !main)
				notify+=1;
			else if(!main) notify=newN;
			if(!notify){
				$(".notifyBox").html("n");
				document.title="gifpumper"	
				}
			else{
				$(".notifyBox").html(notify);
				document.title="("+notify+") gifpumper"	
			}
			$(".notifyBox").css('padding','2px 4px 2px 4px');
			
			var note = document.createElement('div');
			note.style.padding = '2px';
			note.style.marginLeft = '6px';

			note.style.postion='relative';
			note.style.fontSize='12px';
			if(_notify[n].version !=undefined)
				note.innerHTML="<a href='javascript:goToPage(\""+_notify[n].user+"\",\"profile\")'>"+_notify[n].user+"</a> "+ actionVerb +" <a href='javascript:goToPage(\""+_notify[n].page+"\",\"null\","+_notify[n].version+")'>"+_notify[n].page+" v"+_notify[n].version+"</a>";
			else
				note.innerHTML="<a href='javascript:goToPage(\""+_notify[n].user+"\",\"profile\")'>"+_notify[n].user+"</a> "+ actionVerb +" <a href='javascript:goToPage(\""+_notify[n].page+"\",\"profile\")'>"+_notify[n].page+"</a>";
			
			note.style.display='none';
			if(!main){
				$('#notifyDiv').prepend($(note));
					lastNote=_notify[n];
				}
			else{
				$('#feedContainer').prepend($(note));
					lastMainNote=_notify[n];
				}

			
			$(note).slideDown('fast',function(){changeBackground();});
	}
}

//GET INFO ON REQUEST?
var lastLikeDiv=null;
showLikes = function(index,el){

	whoLikes = document.getElementById('whoLikes');

	var element = el.currentTarget;
	element.currentTarget = el.currentTarget;
	
	if(whoLikes != undefined && whoLikes.style.display!='none'){
		
		$(whoLikes).animate({height:'0px'}, 300, function(){
			whoLikes.style.display='none';
		
			if(lastLikeDiv!=element.currentTarget){
				showLikes(index,element)
				}
			
		});
		return;

	}
	
	if(whoLikes == undefined){
		var whoLikes = document.createElement('div');
		whoLikes.id='whoLikes';
		whoLikes.style.position='relative';
		whoLikes.style.fontSize="12px"
		whoLikes.style.paddingLeft="5px"
		whoLikes.style.overflow='hidden';
	}	

	whoLikes.style.height='auto';
	
	//$(whoLikes).offset({top:$(el).offset.top,left:$(el).offset.left})
	//whoLikes.innerHTML = "";
	$('div').remove('.liker')
	for(var i = 0;i<profileInfo.pages[index].likes.length;i++){
		var liker = document.createElement('div');
		liker.style.padding = '2px';
		liker.innerHTML="<a href='javascript:goToPage(\""+profileInfo.pages[index].likes[i]+"\",\"profile\")'>"+profileInfo.pages[index].likes[i]+"</a>";
		liker.className='liker';
		liker.style.display='inline';
		whoLikes.appendChild(liker);
		liker=undefined;
		
	}
	$(whoLikes).show();

	el.currentTarget.parentNode.appendChild(whoLikes);	
	var height = $(whoLikes).height();

	$(whoLikes).height(0);
	$(whoLikes).animate({height:height+'px'}, 300, function(){
			okToAnimate=true;
			changeBackground();

		});

	lastLikeDiv=el.currentTarget;
}

//////////
///FEED//
////////

now.updateFeed = function(user,page,action){

	if(page.split('profile___')[0]=='' || page=='main')
		return
	
	if(action == 'leave'){
		for(var n=0;n<onlineObj[page].length;n++){
				if(onlineObj[page][n]==user)
					onlineObj[page].splice(n,1);			
		}	
	}
	else if(action =='join'){
		if(onlineObj[page]==undefined)
			onlineObj[page]=[];
		onlineObj[page].push(user);
	}
	fillOnline()
}



