
//////////
////IMAGE
////////
var nonSafari2d;
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
		}
		img.id = image._id;
		img.style.position = 'absolute';
		img.className = 'editableElement';
		img.style.cursor='move';
		img.style.zIndex = 100; 
		document.getElementById("mainDiv").appendChild(img);	
	}
	
	//TODO: optimise this
	nonSafari2d={}
	if(contentType=="image" && img.src != image.url)
		img.src=image.url;
	else{				
		if(image.backgroundColor != undefined)
			img.style.backgroundColor = image.backgroundColor;
		if(image.backgroundImage != undefined)
			img.style.backgroundImage = 'url(' + image.backgroundImage + ')';
		if(image.content != undefined)
			img.innerHTML = image.content;
		img.style.padding="30px";
		//img.style.webkitTransformStyle= "preserve-3d";
		//img.style.MozTransformStyle= "preserve-3d";
		if(contentType=='media' && !is_safari){
			
/*
			if(!image.d2d){
				image.d2d=true;
				pageData.images[image._id].d2d=true;
				nonSafari2d[image._id]=1;
			}
*/
			
/* 			$("img").attr("wmode", "opaque").wrap('<div>'); */

			//$(img).remove();
			//document.body.appendChild(img);	

		}
	}
	img.style.left = image.left;
	img.style.top = image.top;	
	img.style.width = image.width;
	img.style.height = image.height;
	
	if(!image.d2d){
	var z = image.z;
	var anglex = image.anglex
	var angley = image.angley;
	var angler = image.angler;
	
	var transform = 'translateZ('+ z + 'px)'+' '+ 'rotateY('+ anglex+'deg)'+ ' ' + 'rotateX('+angley +'deg)'+' '+'rotateZ('+angler+'deg)';
	
		img.style.webkitTransform = transform;
		img.style.MozTransform = transform;
	}
	else{
		var z = 0;
		var transform = 'translateZ('+ z + 'px)';
		img.style.zIndex = 100;
	}
	
	img.style.webkitTransform = transform;
	img.style.MozTransform = transform;

}




/////////
////PAGE
///////


function jsonToDom(pageDataIn){
	

	lastPost=null;
	pageData = pageDataIn;
	onlineObj = {}
	
	if(pageData.pageName=='profile'){
		$('#editPageButton').hide();
		$('#helpButton').hide();
		$('#animateButton').hide();
		$('.mainMenu').hide()
		$('.profileOnly').show()
	}
		
	else{
		$('#editPageButton').show();
		$('#helpButton').show();
		$('#animateButton').show();
		$('.mainMenu').show()
		$('.profileOnly').hide()
	}	

		
	document.getElementById('activeNow').innerHTML='';
	document.getElementById('feed').style.display="none"


	document.body.style.backgroundColor = '';
	document.body.style.backgroundImage = '';

	document.getElementById("mainDiv").innerHTML="";
	document.getElementById("mainDiv").style.webkitTransform ='rotateX(0deg)' + ' ' + 'rotateY(0deg)';
	document.getElementById("mainDiv").style.MozTransform ='rotateX(0deg)' + ' ' + 'rotateY(0deg)';


	document.getElementById('mainFeedDiv').style.display="none"
	document.getElementById('userPages').style.display='none';
	document.getElementById('pagesList').innerHTML="";
	document.getElementById('contributePages').style.display='none';
	document.getElementById('cList').innerHTML="";

	document.getElementById('profileContainer').style.display='none';
	//document.getElementById('profileContainer').innerHTML="";
	
	document.getElementById('chatBox').innerHTML="";

	addEditorsEl.tagify('removeAll');
	addEditorsEl.tagify('inputField').val('')
	addEditorsEl.val('');


	if(currentUser == 'n00b' || pageName=='main' || pageName == 'profile')
		$('#likePageButton').hide();
	else 
		$('#likePageButton').show();
		
	if(pageData.likesN==undefined || pageData.likesN==0)
		pageData.likesN='';
	liked = jQuery.inArray(currentUser, pageData.likes);
	if(liked == -1)
		$('#likeButtonText').html(pageData.likesN + ' like page');
	else
		$('#likeButtonText').html(pageData.likesN + ' unlike page');
		

	if(pageData.editors != undefined){
		var editorsText="";
		for(var k = 0;k<pageData.editors.length;k++){
			addEditorsEl.tagify('inputField').val(pageData.editors[k])
			addEditorsEl.tagify('add');
		}
	}

	if(pageData.pageName=='main' && pageData.notify!=undefined){
		$('#feedContainer').html('');
		now.notify(pageData.notify,null,true);
	}
			
	$("#userImage").remove();
	$("#userName").remove();
	
	if(prevVersion!=undefined)
	  $("#prevVersionDiv").show();
	else
	  $("#prevVersionDiv").hide();
	if(version!=undefined)
	  $("#nextVersionDiv").show();
	else
	  $("#nextVersionDiv").hide();


	if(pageData.pageName != "main" && pageData.pageName != "profile")
		document.getElementById('pageName').innerHTML = "<a href='javascript:goToPage(\""+pageData.pageName+"\")'>" +pageData.pageName+"</a> by <a href='javascript:goToPage(\""+pageData.owner+"\",\"profile\")'>"+pageData.owner+"</a> ";
	else
		document.getElementById('pageName').innerHTML="";

	if(pageData.images != undefined){
		for(var i=0; i<pageData.images.length; i++){
		
			imageToDom(pageData.images[i])
		
		}
	}
		
//////////Added text::			
	if(pageData.text != undefined){
		for(var i=0; i<pageData.text.length; i++){
				fillChat(pageData.text[i].user,pageData.text[i].text);
		}
	}
	document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;

	var div3d = document.getElementById("div3d");

	//TODO: gradients, drop types
	if(pageData.backgroundImageType == undefined){
		document.body.style.backgroundImage='url('+pageData.backgroundImage+')';
	}
	
	if(pageData.backgroundImageType == 0)
		document.body.style.backgroundImage ='url('+pageData.backgroundImage+')';
		
		
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
		
	if(currentUser != 'n00b'){
		$('#notifyDiv').show();	
		$('#notifyDiv').position({ 
			of: $('.notifyBox'), 
			my:"left top",
			at:"left bottom" })
		$('#notifyDiv').hide();
	}	
		
}


//////////////
////PROFILE
///////////


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
//switch chat for profile page	
	var lastPost="";
	var lastTxtDiv;	
	if(profileInfo.text != undefined){
		for(var i=0; i<profileInfo.text.length; i++){
			fillChat(profileInfo.text[i].user, profileInfo.text[i].text);
		}
	}
		
	//}
	
	///fill out pages

	for(var i =0;i<profileInfo.pages.length;i++){
	
		var thisPage=profileInfo.pages[i];
	
		if(thisPage.pageName!= "profile" && thisPage.pageName!= "main"){
			var newDiv = document.createElement('div');
			var txtDiv = document.createElement('div');
			var infoDiv = document.createElement('div');

			txtDiv.innerHTML = "<a href='javascript:goToPage(\""+profileInfo.pages[i].pageName+"\")'>"+profileInfo.pages[i].pageName+"</a>";
			txtDiv.style.paddingBottom="1px";
			//txtDiv.style.position='relative'
	

			infoDiv.id=thisPage._id;
			infoDiv.className="infoDiv";
			infoDiv.style.paddingTop="2px";

			//$(infoDiv).addClass('miniButton');
			//$(newDiv).addClass('miniButton');


			var infoTxt=""
			if(pageName=="profile"){
				if(thisPage.owner==profileInfo.username)
					infoTxt +='(owner'
				else
					infoTxt +='(contributor'
		
				var vDiv = document.createElement('div')
				vDiv.style.fontSize='11px'
				vDiv.style.color='grey'
				vDiv.style.display='inline'
				vDiv.style.display='inline'
				vDiv.style.marginLeft='2px'
				if(thisPage.versions != undefined && thisPage.versions.length > 0){
					infoTxt+=", "+thisPage.versions.length+" v"
				}
				vDiv.innerHTML = infoTxt+")"; 
				txtDiv.appendChild(vDiv);
			}			
			
			
			
			if(thisPage.likes!=undefined && thisPage.likes.length > 0){
				var likeDiv = document.createElement('div')
				
				//if(thisPage.vLikes!=undefined)
				//	thisPage.likesN+=thisPage.vLikes
				
				likeDiv.innerHTML = " " +thisPage.likesN+" likes";
				likeDiv.data={id:i}
				
				likeDiv.onclick = (function(index,id){ 
					return function(){
						disableSelection(document.getElementById(id))
						showLikes(index,id)}
					})(i,thisPage._id);
					
				likeDiv.style.display = "inline"; 
				likeDiv.className="miniButton";

			}
						
			txtDiv.style.minHeight='30px'
			newDiv.style.marginBottom='4px';
			
/*
			var div1 = document.createElement('div');
			div1.style.width='20px';
			div1.style.height='20px';
			div1.onclick=null;
			newDiv.appendChild(div1);
*/
			var imgBox = new imgBoxClass(thisPage.pageName,'page',30,true);
			newDiv.appendChild(imgBox.imgDiv);

			//infoDiv.innerHTML = infoTxt;
			if(likeDiv != undefined)
				infoDiv.appendChild(likeDiv);
			txtDiv.appendChild(infoDiv);
			newDiv.appendChild(txtDiv);


			//txtDiv.style.zIndex=100000000
			//$("newDiv").addClass("miniButton")
			likeDiv=undefined;
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
				newDiv.style.paddingTop="2px";
				
			document.getElementById('cList').appendChild(newDiv);
	
			//}		
		}
		document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
		document.getElementById('contributePages').style.display='block';
		document.getElementById('mainFeedDiv').style.display="block"
		changeProfileColor();
		//$('#mainFeedDiv').show;
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
	//document.getElementById('userPages').style.backgroundColor='rgba(255,255,255,.85)';
	//document.getElementById('contributePages').style.backgroundColor='rgba(255,255,255,.85)';

	var r = Math.random()
	var color=bgColorList2[Math.floor(r*bgColorList2.length)];
	document.getElementById('mainFeedDiv').style.backgroundColor= color;
	containerDiv.style.backgroundColor=color;
	var r = Math.random()
	var color=bgColorList2[Math.floor(r*bgColorList2.length)];
	document.getElementById('feed').style.backgroundColor= color;

}


////////////////
///MAIN ONLINE
//////////////


fillOnline = function(onlineNow){

	if(onlineNow != undefined){
		for(var i = 0; i<onlineNow.length;i++){
			if(onlineObj[onlineNow[i].page]==undefined){
				onlineObj[onlineNow[i].page]=[]
			}
			onlineObj[onlineNow[i].page].push(onlineNow[i].user)
		}
	}
	var onlineArr=[];
	for(var key in onlineObj){
		var newObj={}
		var page = key.split('profile___')
		if(page[0]=='' || key=='main' || onlineObj[key].length==0){
			continue;
			}
		else{
			newObj.page=key;
			newObj.type=null;
		}
		newObj.users=onlineObj[key]
		onlineArr.push(newObj)	
	}
	
	onlineArr.sort(function(a,b){
		if(a.users.length>b.users.length)
			return -1	
		else if(a.users.length<b.users.length)
			return 1
		else return 0	
	})
	
	console.log(onlineArr)	
	var mainOnlineDiv = document.getElementById('activeNow')
	mainOnlineDiv.innerHTML='';
	
	for(var i=0;i<onlineArr.length;i++){
		var onlineDiv = document.createElement('div');
		onlineDiv.style.marginLeft='6px';
		onlineDiv.style.color='white';
		
		txtDiv = document.createElement('div');
		txtDiv.style.height='50px'
		txtDiv.style.overflow='auto'
		var imgBox = new imgBoxClass(onlineArr[i].page,'page',50,true);
		
		if(onlineArr[i].type==null)
			txtDiv.innerHTML= "<a href='javascript:goToPage(\""+onlineArr[i].page+"\")'>"+onlineArr[i].page+"</a>: ";		
		else txtDiv.innerHTML= "<a href='javascript:goToPage(\""+onlineArr[i].page+"\",\"profile\")'>"+onlineArr[i].page+"</a>: ";		
			
		txtDiv.id='activePages'+onlineArr[i].page;
		
		for(var n=0;n<onlineArr[i].users.length;n++){
		
			var usrDiv = document.createElement('div');
			usrDiv.innerHTML="<a href='javascript:goToPage(\""+onlineArr[i].users[n]+"\",\"profile\")'>"+onlineArr[i].users[n]+"</a> "
			usrDiv.style.display='inline'
			usrDiv.style.fontSize='12px'
			usrDiv.id='onlineUser'+onlineArr[i].users[n];
			txtDiv.appendChild(usrDiv);
		}
		onlineDiv.appendChild(imgBox.imgDiv)
		onlineDiv.appendChild(txtDiv)
		onlineDiv.className='activePages'
		mainOnlineDiv.appendChild(onlineDiv)
		
	}
	
	$('#feed').show();	
	changeBackground();
	
}

