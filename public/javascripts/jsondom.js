
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
	if(contentType=="image" && img.src != image.url){
		img.src=image.url;
		img.alt="";
		}
	else{				
		if(image.backgroundColor != undefined)
			img.style.backgroundColor = image.backgroundColor;
		if(image.backgroundImage != undefined)
			img.style.backgroundImage = 'url(' + image.backgroundImage + ')';
		if(image.content != undefined && contentType!='youtube' && contentType!='soundCloud' && contentType!='vimeo')
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
	
	if(contentType=="youtube"){
	
		var video_id = image.content.split('v=')[1];
		if(video_id!=undefined){
			var ampersandPosition = video_id.indexOf('&');
			if(ampersandPosition != -1) {
			  video_id = video_id.substring(0, ampersandPosition);
			}	
			
			img.innerHTML='<object width="100%" height="100%">\
			<param name="movie" value="http://www.youtube-nocookie.com/v/' + video_id + '?version=3&amp;hl=en_US"></param>\
			<param name="allowFullScreen" value="true"></param>\
			<param name="allowscriptaccess" value="always"></param>\
			<param value="transparent" name="wmode">\
			<embed wmode="transparent" src="http://www.youtube-nocookie.com/v/' + video_id + '?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="100%" height="100%" allowscriptaccess="always" allowfullscreen="true"></embed></object>'
		}

	}
	else if(contentType=="soundCloud"){
		var scUrl = image.content;
		scUrl=scUrl.split('url=')[1]
		scUrl=scUrl.split('\"><')[0]
		img.innerHTML='<object height="100%" width="100%">\
		<param name="movie" value="https://player.soundcloud.com/player.swf?url='+scUrl+'"></param>\
		<param name="allowscriptaccess" value="always"></param> \
		<param value="transparent" name="wmode">\
		<embed wmode="transparent" allowscriptaccess="always" height="100%" src="https://player.soundcloud.com/player.swf?url='+scUrl+'" type="application/x-shockwave-flash" width="100%"></embed> </object>'
	}
	else if(contentType=="vimeo"){
		var vimeoId = image.content;
		vimeoId=vimeoId.split('vimeo.com/')[1];
		img.innerHTML='<object width="100%" height="100%"><param name="allowfullscreen" value="true" />\
		<param name="allowscriptaccess" value="always" />\
		<param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id='+vimeoId+'&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=00adef&amp;fullscreen=1&amp;autoplay=0&amp;loop=0" />\
		<param value="transparent" name="wmode">\
		<embed wmode="transparent""  src="http://vimeo.com/moogaloop.swf?clip_id='+vimeoId+'&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=00adef&amp;fullscreen=1&amp;autoplay=0&amp;loop=0" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="100%" height="100%"></embed></object>'	
	
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

	return false;
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
		$('#likeButtonText').html(pageData.likesN + ' like');
	else
		$('#likeButtonText').html(pageData.likesN + ' unlike');
		

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


	if(pageData.pageName != "main" && pageData.pageName != "profile" && pageData.pageName != "invite")
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

	if(pageData.bgDisplay!=undefined){
		document.body.style.backgroundSize=pageData.bgDisplay;
		if(pageData.bgDisplay=='cover'){
			$('input:radio[name="bgType"]').filter('[value="cover"]').attr('checked', true);
			document.body.style.backgroundPosition="center center";
			}
		else{
		$('input:radio[name="bgType"]').filter('[value=""]').attr('checked', true);
			document.body.style.backgroundPosition="left top";
			}
		}
	else{
		document.body.style.backgroundSize="";
		$('input:radio[name="bgType"]').filter('[value=""]').attr('checked', true);
		document.body.style.backgroundPosition="left top";	 	
	}
	$('#background').val(pageData.background);
	$('#backgroundImage').val(pageData.backgroundImage);

	//TODO: gradients, drop types
	if(pageData.backgroundImageType == undefined){
		document.body.style.backgroundImage='url('+pageData.backgroundImage+')';
	}
	
	//if(pageData.backgroundImageType == 0)
	document.body.style.backgroundImage ='url('+pageData.backgroundImage+')';
		
/*
	if(pageData.backgroundImageType == 1){
		var bgimg = '-webkit-gradient(' + pageData.backgroundImage +')'
		document.body.style.backgroundImage = bgimg;	
	}
*/
/*
	if(pageData.backgroundImageType == 2){
		document.body.style.backgroundImage=pageData.backgroundImage;
	}
*/
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

	$('#loadingImg').hide();

}


//////////////
////PROFILE
///////////


var profileInfo={}

loadProfileInfo = function(info){

	profileInfo=info;

	if(profileInfo.bgDisplay!=undefined && pageName!='main'){
		document.body.style.backgroundSize=profileInfo.bgDisplay;
		if(profileInfo.bgDisplay=='cover'){
			$('input:radio[name="bgType"]').filter('[value="cover"]').attr('checked', true);
			document.body.style.backgroundPosition="center center";
			}
		else{
			$('input:radio[name="bgType"]').filter('[value=""]').attr('checked', true);
			document.body.style.backgroundPosition="left top";
			}
		}
	else if(pageName!='main'){
		document.body.style.backgroundSize="";
		$('input:radio[name="bgType"]').filter('[value=""]').attr('checked', true);
		document.body.style.backgroundPosition="left top";	 	
	
	$('#background').val(profileInfo.background);
	$('#backgroundImage').val(profileInfo.backgroundImage);
	}

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
		$('#userPages').css('marginLeft','420px')
		$('#userPages').css('marginTop','100px')

	}
	else{ 
		$('#userPages').css('marginLeft','10px')
		$('#userPages').css('marginTop','40px')
	}
//switch chat for profile page	
	var lastPost="";
	var lastTxtDiv;	
	if(profileInfo.text != undefined){
		for(var i=0; i<profileInfo.text.length; i++){
			fillChat(profileInfo.text[i].user, profileInfo.text[i].text);
		}
	}
		
	
	///fill out pages

	for(var i =0;i<profileInfo.pages.length;i++){
	
		var thisPage=profileInfo.pages[i];
	
		if(thisPage.privacy==3 && pageName=="main")
			continue;
		else if(thisPage.privacy==3 && currentUser != thisPage.owner)
			continue;
	
		if(thisPage.pageName!= "profile" && thisPage.pageName!= "main" && thisPage.pageName!= "invite"){
			
			var newDiv = document.createElement('div');
			var txtDiv = document.createElement('div');
			var infoDiv = document.createElement('div');

			txtDiv.innerHTML = "<a href='javascript:goToPage(\""+profileInfo.pages[i].pageName+"\")'>"+profileInfo.pages[i].pageName+"</a>";
			txtDiv.style.paddingBottom="1px";
			txtDiv.style.paddingLeft="0px";
			txtDiv.style.paddingTop="2px";	

			infoDiv.id=thisPage._id;
			infoDiv.className="infoDiv";
			infoDiv.style.paddingTop="2px";

			var infoTxt=""
			if(pageName=="profile"){
				if(thisPage.owner==profileInfo.username)
					infoTxt +=' (owner'
				else
					infoTxt +=' (contributor'
			}
			else {
				if(thisPage.privacy==0)
					infoTxt=' (public'							
				else if(thisPage.privacy==1)
					infoTxt=' (semi-public'
				else 
					infoTxt=' (private'

			}	
			var vDiv = document.createElement('div')
			vDiv.style.fontSize='11px'
			vDiv.style.color='grey'
			vDiv.style.display='inline'
			vDiv.style.marginLeft='2px'
			if(thisPage.versions != undefined && thisPage.versions.length > 0){
				infoTxt+=", "+thisPage.versions.length+"v"
			}
			vDiv.innerHTML = infoTxt+")"; 
			txtDiv.appendChild(vDiv);
			
			
						
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
						
			txtDiv.style.minHeight='150px'
			newDiv.style.marginBottom='4px';
			txtDiv.style.overflow = 'hidden';
			txtDiv.style.textOverflow = 'ellipsis';

			
			var imgBox = new imgBoxClass(thisPage.pageName,'page',150,true);
			newDiv.appendChild(imgBox.imgDiv);

			if(likeDiv != undefined)
				infoDiv.appendChild(likeDiv);
			txtDiv.appendChild(infoDiv);
			newDiv.appendChild(txtDiv);

			likeDiv=undefined;
			document.getElementById('pagesList').appendChild(newDiv);

		}
	}
	document.getElementById('userPages').style.display='block';


	if(pageName=="main"){
/*
		for(var i =0;i<profileInfo.users.length;i++){
				newDiv = document.createElement('div');
				newDiv.innerHTML = "<a href='javascript:goToPage(\""+profileInfo.users[i].username+"\",\"profile\")'>"+profileInfo.users[i].username+"</a>";
				newDiv.style.paddingBottom="1px";
				newDiv.style.paddingTop="2px";
				document.getElementById('cList').appendChild(newDiv);
		}
*/
		document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
		//document.getElementById('contributePages').style.display='block';
		document.getElementById('mainFeedDiv').style.display="block"
		changeProfileColor();
	}

	changeBackground();
	changeProfileColor()
	return false;
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
	return false;
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
		if(page[0]=='' || key=='main' || onlineObj[key].length==0 || key=='invite'){
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
		txtDiv.style.minHeight='100px'
		txtDiv.style.overflow = 'hidden';
		txtDiv.style.textOverflow = 'ellipsis';
		

		var imgBox = new imgBoxClass(onlineArr[i].page,'page',100,true);
		
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
	return false;
}

