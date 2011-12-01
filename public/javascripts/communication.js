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
	loadNotifications();
	//now.setUserPage(pageName);

});

function loadNotifications(){

	if(nowReady && windowReady){
		now.getNotifications();
	}
}


var myName;
function loadData(){

	$('#loadingImg').show();
	if(nowReady && windowReady){
	
		if(currentUser==undefined){
			currentUser="n00b"
			privacy=null;
			}
		now.getPagePermissions(pageName,userProfile, function(err,name,_permissions){
			if (!err)
				privacy=_permissions;
				currentUser=name;
				if(currentUser=='n00b'){
					if(pageName!='invite'){
						goToPage('invite')
						return;
					}
					//window.history.pushState({page:'invite'}, "", '/invite');
					$('#invite').show();
					$('#chat').hide();
					//animate();
				}
				else{ $('#invite').hide();
				}
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
		//goToPage('main')
		window.history.back();
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
				newDiv.style.padding="0px 7px 2px 7px";

				var imgBox = new imgBoxClass(user,'user',25)
				
				var textDiv=document.createElement('div');
				if(user!="n00b")
					textDiv.innerHTML += " <b><a href='/profile/"+user+"'>"+user+"</a></b> ";
				else{
					textDiv.id="n00bText"					
					textDiv.innerHTML += " <b>"+user+"</b>";
				}
				textDiv.style.textOverflow = 'ellipsis';
				textDiv.style.overflow='hidden';
				textDiv.style.width='70%'
				textDiv.style.paddingTop='4px';
				textDiv.style.height='30px'
				
				newDiv.appendChild(imgBox.imgDiv)
				newDiv.appendChild(textDiv);

				document.getElementById('online').appendChild(newDiv);
				if (user=='n00b')
					n00bs++;
			}
			else if(user=='n00b'){
				n00bs++;
				document.getElementById('n00bText').innerHTML="<b>"+n00bs+" n00bs</b>";
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
				if (n00bs==1)
				document.getElementById('n00bText').innerHTML="<b>"+n00bs+" n00bs</b>";				
			}
			else{
				document.getElementById('n00bText').innerHTML="<b>n00b</b>";				
			}
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
			
				if($("#youtubeUrl").val()!=""){
					addType == 'youtube'
				    addObject.content=$("#youtubeUrl").val()
				    addObject.contentType='youtube';
				    addObject.width='450px'
				    addObject.height='300px'
				}
				else if($("#soundCloud").val()!=""){
					addType == 'soundCloud'
				    addObject.content=$("#soundCloud").val()
				    addObject.contentType='soundCloud';
				    addObject.width='300px'
				    addObject.height='81px'				
				}
				else if($("#vimeoUrl").val()!=""){
					addType == 'vimeo'
				    addObject.content=$("#vimeoUrl").val()
				    addObject.contentType='vimeo';
				    addObject.width='450px'
				    addObject.height='300px'				
				}
				else{
					addObject.content=document.getElementById("media").value;
				}
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
		now.addNewImg(pageName, imgArray, scrollTop, scrollLeft,function(err){
			alert(err)
			});
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

	now.deleteImage(pageName, lastId, all,function(err){
			alert(err)
	});
	
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
	if(editElement.contentType == 'youtube')
		editElement.content = $("#editYoutubeUrl").val();
	if(editElement.contentType == 'vimeo')
		editElement.content = $("#editVimeoUrl").val();
	if(editElement.contentType == 'soundCloud')
		editElement.content = $("#editSoundCloud").val();
			
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
			else {
				openMenu('moreMenu');
				goToPage(newPage)
				}		
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
			else{
			 openMenu('pageSettings');
			 goToPage('main');
			 }		
		})
	  }
	else
	  {
		//
	  }
	show_confirm();
}

///////////
//VERSIONS
/////////

function saveVersion(){

	if(version!=undefined){
		alert("You can't save this version again")
		return;
	}

	now.saveVersion(function(err,savedVersion){
		if(err)
			alert(err)
		else {
			alert("SAVED VERSION " + savedVersion);
			//prevVersion = savedVersion;
			//$("#prevVersionDiv").show();
		}
	})
}

now.updateVersion = function(savedVersion,deleteVersion){
	//alert("This version of the page has been SAVED as version " + savedVersion);
	if(deleteVersion){
		if((prevVersion != undefined && version == undefined) || (version && version>savedVersion)){
			if(prevVersion==0){
				prevVersion=undefined;
				$("#prevVersionDiv").hide();
				}
			else prevVersion--;
		}
		else if(nextVersion) nextVersion--;
	return;
	}
	
	if(version==undefined){
		prevVersion = savedVersion;
		$("#prevVersionDiv").show();
	}
	else{
		nextVersion = savedVersion;
	}
		
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
		

		

		//show_confirm();	
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
	
	if(type=='display')
		var background = $("input[name='bgType']:checked").val()
	
	if(pageName=="profile"){
		now.setProfileBackground(userProfile, type, background,function(err){
			if(!err){
				if(type=="background")
					document.body.style.backgroundColor = background;
				if(type=="backgroundImage")
					document.body.style.backgroundImage = 'url('+ background +')';
				if(type=='display'){
					document.body.style.backgroundSize=background;
					if(background=='cover')
						document.body.style.backgroundPosition="center center";
					else
						document.body.style.backgroundPosition="left top";
					}										
			}
		});
	}
	else
		now.setBackground(pageName, type, background, function(err){
			alert(err)
			});
}

now.backgroundResponce = function(type, background){

	if(version!=undefined)
		return;

	if(type=="background")
		document.body.style.backgroundColor = background;
	if(type=="backgroundImage")
		document.body.style.backgroundImage = 'url('+ background +')';
	if(type=='display'){
		document.body.style.backgroundSize=background;
		if(background=='cover')
			document.body.style.backgroundPosition="center center";
		else
			document.body.style.backgroundPosition="left top";
		}	
}



////////////
///TXT/////
//////////
function fillChat(user, text) {

	
	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	text = text.replace(exp,"<a href=\"$1\">$1</a>"); 
	
	if(user!=lastPost){
		var newTxtDiv = document.createElement('div');
		newTxtDiv.innerHTML ="<b><a href='/profile/"+user+"'>"+user+"</a>:</b> " +text;
		newTxtDiv.style.paddingBottom="1px";
		document.getElementById('chatBox').appendChild(newTxtDiv);
		lastPost=user;
		lastTxtDiv=newTxtDiv;
	}
	else{
		lastTxtDiv.innerHTML+="<br>"+text;
	}
	

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

	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	text = text.replace(exp,"<a href=\"$1\">$1</a>"); 
	
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
				$('#likeButtonText').html(pageData.likesN + ' unlike');
				liked = 0;
				}	
			else{
				liked = -1;
				pageData.likesN--
				$('#likeButtonText').html(pageData.likesN + ' like');	
				}
		}
	})
}

var lastNote;
var lastMainNote;
var lastTextDiv;
var lastMainTextDiv;

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
			var actionVerb='likes'
		else if(_notify[n].action=='update')
			var actionVerb='updated'
		else if (_notify[n].action=='version')
			var actionVerb='saved'
		else if (_notify[n].action=='new')
			var actionVerb='created'
		else if (_notify[n].action=='msg')
			var actionVerb='messaged you'

			//var actionVerb=_notify[n].action;
						
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
			var textDiv=document.createElement('div');
			textDiv.style.textOverflow = 'ellipsis';
			textDiv.style.overflow='hidden';
			//TODO grouping notifications			

		if(main && lastMainNote && lastMainNote.user==_notify[n].user && lastMainNote.action==_notify[n].action){
			if(_notify[n].version !=undefined)
				lastMainTextDiv.innerHTML+=", <a href='javascript:goToPage(\""+_notify[n].page+"\",\"null\","+_notify[n].version+")'>"+_notify[n].page+" v"+_notify[n].version+"</a>";
			else
				lastMainTextDiv.innerHTML+=", <a href='javascript:goToPage(\""+_notify[n].page+"\",\"null\")'>"+_notify[n].page+"</a>";			
			continue;			
		}
		
		if(!main && lastNote && lastNote.user==_notify[n].user && lastNote.action==_notify[n].action){
			if(_notify[n].version !=undefined)
				lastTextDiv.innerHTML+=", <a href='javascript:goToPage(\""+_notify[n].page+"\",\"null\","+_notify[n].version+")'>"+_notify[n].page+" v"+_notify[n].version+"</a>";
			else
				lastTextDiv.innerHTML+=", <a href='javascript:goToPage(\""+_notify[n].page+"\")'>"+_notify[n].page+"</a>";
			continue;			
		}
						
			if(_notify[n].version !=undefined)
				textDiv.innerHTML="<a href='javascript:goToPage(\""+_notify[n].user+"\",\"profile\")'>"+_notify[n].user+"</a> "+ actionVerb +" <a href='javascript:goToPage(\""+_notify[n].page+"\",\"null\","+_notify[n].version+")'>"+_notify[n].page+" v"+_notify[n].version+"</a>";
			else
				textDiv.innerHTML="<a href='javascript:goToPage(\""+_notify[n].user+"\",\"profile\")'>"+_notify[n].user+"</a> "+ actionVerb +" <a href='javascript:goToPage(\""+_notify[n].page+"\")'>"+_notify[n].page+"</a>";
			
			note.style.display='none';
			
			if(!main){
				$('#notifyDiv').prepend($(note));
					lastNote=_notify[n];
			}
			else if(main){
				$('#feedContainer').prepend($(note));
					lastMainNote=_notify[n];
			}
			
			var imgBox = new imgBoxClass(_notify[n].user,'user',40,true)
			
			textDiv.style.paddingTop='4px';
			//textDiv.style.paddingLeft='46px';
			textDiv.style.minHeight='40px'
			if(main)
				lastMainTextDiv=textDiv
			else
				lastTextDiv=textDiv;
			note.appendChild(imgBox.imgDiv);
			note.appendChild(textDiv);
			
			$(note).slideDown('fast',function(){changeBackground();});
	}
}


now.updateUsrImg = function(user,url){
	if(userImages['user'+user]==undefined)
		userImages['user'+user]={}		
	userImages['user'+user].img=url
	var className = 'user'+user
	$("."+className).attr("src", url)
}


//GET INFO ON REQUEST?
var lastLikeId=null;
showLikes = function(index,id){
	whoLikes = document.getElementById('whoLikes');

	if(whoLikes == undefined){
		var whoLikes = document.createElement('div');
		whoLikes.id='whoLikes';
		//whoLikes.style.position='relative';
		whoLikes.style.fontSize="12px"
		whoLikes.style.paddingLeft="10px"
		whoLikes.style.overflow='hidden';
		//whoLikes.style.width='auto'
		whoLikes.style.display='none';
	}
	else if(whoLikes.style.display!='none' && lastLikeId != id){
		lastLikeId=id;
		$(whoLikes).slideToggle('fast',function(){showLikes(index,id)});
		return;
	}	

	//whoLikes.style.height='auto';
	
	var liker = document.createElement('div');
	//liker.style.paddingLeft = '10px';

	whoLikes.innerHTML='';
	liker.innerHTML="<a href='javascript:goToPage(\""+profileInfo.pages[index].likes[0]+"\",\"profile\")'>"+profileInfo.pages[index].likes[0]+"</a>";
	for(var i = 1;i<profileInfo.pages[index].likes.length;i++){
		//var liker = document.createElement('span');
		liker.innerHTML+=", <a href='javascript:goToPage(\""+profileInfo.pages[index].likes[i]+"\",\"profile\")'>"+profileInfo.pages[index].likes[i]+"</a>";
		//liker.className='liker';
		liker.style.display='block';
		//whoLikes.appendChild(liker);
		//liker=undefined;
	}
	//whoLikes.innerHTML+='<div></div>';
	whoLikes.appendChild(liker);
	
	document.getElementById(id).appendChild(whoLikes);	
	//var height = $(whoLikes).height();
	$(whoLikes).slideToggle();	
	lastLikeId=id;
	
}

//////////
///FEED//
////////

now.updateFeed = function(user,image,page,action){

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



