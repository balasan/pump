
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
			if(isUrl(image.backgroundImage))
				img.style.backgroundImage = 'url(' + image.backgroundImage + ')';
		if(image.content != undefined && contentType!='youtube' && contentType!='soundCloud' && contentType!='vimeo'){
		
			var testImg = document.createElement('div');
			testImg.innerHTML=image.content;
			if(img==undefined || img.innerHTML!=testImg.innerHTML){		
				img.innerHTML = image.content;
				img.style.padding="30px";
			}
		}
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
	
	if(contentType=="youtube" ){
	
		var video_id = image.content.split('v=')[1];
		if(video_id!=undefined){
			var ampersandPosition = video_id.indexOf('&');
			if(ampersandPosition != -1) {
			  video_id = video_id.substring(0, ampersandPosition);
			}	
			
			var vidHtml='<object width="100%" height="100%">\
			<param name="movie" value="http://www.youtube-nocookie.com/v/' + video_id + '?autoplay=1&amp;&amp;loop=1version=3&amp;hl=en_US"></param>\
			<param name="allowFullScreen" value="true"></param>\
			<param name="allowscriptaccess" value="always"></param>\
			<param value="transparent" name="wmode">\
			<embed wmode="transparent" src="http://www.youtube-nocookie.com/v/' + video_id + '?autoplay=1&amp;loop=1&amp;version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="100%" height="100%" allowscriptaccess="always" allowfullscreen="true"></embed></object>'
		
		
			var testImg = document.createElement('div');
			testImg.innerHTML=vidHtml;
			if(img==undefined || img.innerHTML!=testImg.innerHTML)		
				img.innerHTML=vidHtml;
		
		}

	}
	else if(contentType=="soundCloud"){
		var scUrl = image.content;
		scUrl=scUrl.split('url=')[1]
		if(scUrl==undefined)
			return;
		scUrl=scUrl.split('\"><')[0]
		vidHtml='<object height="100%" width="100%">\
		<param name="movie" value="https://player.soundcloud.com/player.swf?url='+scUrl+'"></param>\
		<param name="allowscriptaccess" value="always"></param> \
		<param value="transparent" name="wmode">\
		<embed wmode="transparent" allowscriptaccess="always" height="100%" src="https://player.soundcloud.com/player.swf?url='+scUrl+'" type="application/x-shockwave-flash" width="100%"></embed> </object>'
	
		var testImg = document.createElement('div');
		testImg.innerHTML=vidHtml;
		if(img==undefined || img.innerHTML!=testImg.innerHTML)
			img.innerHTML=vidHtml;
	
		$(img).addClass('noDrag');
	}
	else if(contentType=="vimeo"){
		var vimeoId = image.content;

		vimeoId=vimeoId.split('vimeo.com/')[1];
		vidHtml='<object width="100%" height="100%"><param name="allowfullscreen" value="true" />\
		<param name="allowscriptaccess" value="always" />\
		<param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id='+vimeoId+'&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=00adef&amp;fullscreen=1&amp;autoplay=1&amp;loop=1" />\
		<param value="transparent" name="wmode">\
		<embed wmode="transparent""  src="http://vimeo.com/moogaloop.swf?clip_id='+vimeoId+'&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=00adef&amp;fullscreen=1&amp;autoplay=1&amp;loop=1" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="100%" height="100%"></embed></object>'
		
		var testImg = document.createElement('div');
		testImg.innerHTML=vidHtml;
		if(img==undefined || img.innerHTML!=testImg.innerHTML)
			img.innerHTML=vidHtml;	
	}
	else if(contentType=="mp3"){
			var mp3url = image.content;
			
			var fileType =mp3url
			
			fileType = mp3url.split('.').pop();
			//console.log(fileType);

		if(!is_firefox && (fileType=='mp3' || fileType=='mp4')){
			vidHtml='<video width="100%" height="100%" controls autoplay="autoplay">\
			<source src="'+mp3url+'" type="audio/mp4"\>'+  
			'<object width="100%" height="100%">\
			<param name="src" value="'+mp3url+'">\
			<param name="autoplay" value="true">\
			<param name="controller" value="true">\
			<param name="bgcolor" value="">\
			<param name="bgcolor" value="">\
			<param name="wmode" value="transparent">\
			<embed wmode="transparent" src="'+mp3url+'" autostart="true" loop="false" width="100%" height="100%"\
			controller="true" bgcolor=""></embed>\
			</object>\
			</video>'
			
			var testImg = document.createElement('div');
			testImg.innerHTML=vidHtml;
			if(img==undefined || img.innerHTML!=testImg.innerHTML)
				img.innerHTML=vidHtml;
		}
		else{
			//TODO firefox!
			vidHtml='<object width="100%" height="100%">\
			<param name="src" value="'+mp3url+'">\
			<param name="autoplay" value="true">\
			<param name="controller" value="true">\
			<param name="bgcolor" value="">\
			<param name="bgcolor" value="">\
			<param name="wmode" value="transparent">\
			<embed wmode="transparent" src="'+mp3url+'" autostart="true" loop="false" width="100%" height="100%"\
			controller="true" bgcolor=""></embed>\
			</object>'
			
			var testImg = document.createElement('div');
			testImg.innerHTML=vidHtml;
			if(img==undefined || img.innerHTML!=testImg.innerHTML)
				img.innerHTML=vidHtml;
			
		}

	}
	if(contentType=="media"){	
		$(img).addClass('noDrag');
	}
	
	img.style.left = image.left;
	img.style.top = image.top;	
	img.style.width = image.width;
	img.style.height = image.height;
	img.style.zIndex=image.z;
	
	if(!image.d2d){
	var z = image.z;
	var anglex = image.anglex
	var angley = image.angley;
	var angler = image.angler;
	
	var transform = 'translateZ(' + z + 'px)'+ ' '+ 'rotateZ('+angler+'deg)'+' '  + 'rotateX('+angley+'deg)'+' '  +  'rotateY('+anglex+'deg)';
	
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
	
	
/*
	$(img).draggable({
		drag:null,
		scroll:true,
		distance:10,
		start:function(e,el){
		//console.log(el.helper[0])
		dragHandler(e.originalEvent,el.helper[0])
		}
	})
*/
	//.widget

	return false;
}


/////////
////PAGE
///////

function jsonToDom(pageDataIn){

	//var r = Math.random()
	//$('.menuHead').css('backgroundColor', colorList[Math.floor(r*colorList.length)])
	//$('#mainMenu').css('backgroundColor', colorList[Math.floor(r*colorList.length)])
	//r = Math.random()
	//$('.menuC').css('background', colorList[Math.floor(r*colorList.length)])

	//document.getElementById(menuType).style.backgroundColor=colorList[Math.floor(r*colorList.length)];

	console.log('loading page')

	if(pageName!='profile'){




		var newFBurl = "gifpumper.com/"+encodeURI(pageName);
		$('#fb-like').html('<div data-href=' + newFBurl + ' class="fb-like" id="fb-like"   layout="button_count" data-send="false" data-width="90" data-show-faces="false" style="float:left;width:90px;opacity:.8"></div>');
		
		}
	else{
		var newFBurl = "gifpumper.com/profile/"+userProfile;
		
		$('#fb-like').html('<div data-href=' + newFBurl + 'class="fb-like" id="fb-like"   layout="button_count" data-send="false" data-width="90" data-show-faces="false" style="float:left;width:90px;opacity:.8"></div>');	
		}		


	
	if(pageName=='main'){
		if(currentUser=='n00b')
		$("#invite").show();
		$('#fb-like').hide();
		}
	else{
		$("#invite").hide();
		$('#fb-like').show();
		}
			
	if(currentUser!='n00b' || pageName=='invite'){	
		$('#miniLogo').hide();
		$('#tipDiv').hide();
	}
	else{
		$('#miniLogo').show();
		$('#tipDiv').show();
		document.getElementById('tipDiv').style.right='5px';
	
	}
	if(pageName == 'main'){
		//$('#miniLogo').show();

	}
	if(currentUser!='n00b')
		document.getElementById('tipDiv').style.right='180px';

	lastPost=null;
	pageData = pageDataIn;
	onlineObj = {}
	$('input:radio[name=privacy]').filter('[value='+pageData.privacy+']').attr('checked', true);

	mainDivTrasfrom.z=0;
	mainDivTrasfrom.rotY=0;
	mainDivTrasfrom.x=0;
	mainDivTrasfrom.rotX=0;
	updateMainDiv();
	
	if(pageData.pageName=='profile'){
		$('#editPageButton').hide();
		
		if($('#editPageButton').hasClass('menuButtonP'))
			buttonPress('editPage');
		$('#editPageMenu').hide();
		
		$('#helpButton').hide();
		$('#animateButton').hide();
		$('.mainMenu').hide()
		$('.profileOnly').show()
		$('#mainDiv,#div3d').hide()
		$('#likeIm').hide();
		document.title = userProfile;

	}		
	else{
		$('#editPageButton').show();
		$('#helpButton').show();
		$('#animateButton').show();
		$('.mainMenu').show()
		$('.profileOnly').hide()
		$('#mainDiv,#div3d').show()
		$('#likeIm').show();
		document.title = pageName;
	}
	if(pageData.pageName=='main'){
		$('#mainDiv,#div3d').hide()	
	}

	
	if(pageData.pageName=='main' || pageData.pageName=='invite'){
		$('#fbLike').show()
		

	}
	else{
		$('#fbLike').hide()	
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
	
	//document.getElementById('pagesList').innerHTML="";
	//$('.refreshPageItmes').remove();
	//$('#pagesList').isotope( 'remove', $('.refreshPageItmes'), null )

	
	if($('#pagesListProfile').data('isotope'))
		$('#pagesListProfile').isotope( 'destroy' )
	//$('#pagesListProfile').isotope( 'remove', $('pageItem'))

	
	document.getElementById('pagesListProfile').innerHTML="";
	
	document.getElementById('contributePages').style.display='none';
	document.getElementById('cList').innerHTML="";

	document.getElementById('profileContainer').style.display='none';
	//document.getElementById('profileContainer').innerHTML="";
	
	document.getElementById('chatBox').innerHTML="";

	addEditorsEl.tagify('removeAll');
	addEditorsEl.tagify('inputField').val('')
	addEditorsEl.val('');


	if(pageName=='main'){
		$('#likePageButton').hide();
		

				
		}
	else 
		$('#likePageButton').show();
		

		
	if(pageData.likesN==undefined || pageData.likesN==0)
		pageData.likesN='';
	liked = jQuery.inArray(currentUser, pageData.likes);
	if(liked == -1){
		$('#likeIm').css('opacity','1')
		likeIm.src='http://asdf.us/im/84/heart03_1323653907.gif'
		$('#likeButtonText').html(pageData.likesN);
		}
	else{
		$('#likeIm').css('opacity','1')
		likeIm.src='https://s3.amazonaws.com/gifpumper/ui/heart-03.gif'

		$('#likeButtonText').html(pageData.likesN);
		}

	if(pageData.editors != undefined){
		var editorsText="";
		for(var k = 0;k<pageData.editors.length;k++){
			addEditorsEl.tagify('inputField').val(pageData.editors[k])
			addEditorsEl.tagify('add');
		}
	}



	if(pageData.pageName=='main' && pageData.notify!=undefined){
		//$('#feedContainer').html('');
		if(loadNotify)
			now.notify(pageData.notify,null,true);
		loadNotify=false;
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


	if(pageData.pageName != "main" && pageData.pageName != "profile" && pageData.pageName != "invite"){

		var pageInfo = document.getElementById('pageName');
		
		var pLink = document.createElement('span')
		var profileLink = document.createElement('span')

		pLink.innerHTML = makePageLink(pLink,pageData.pageName);

		profileLink.innerHTML = makePageLink(profileLink,pageData.owner,'profile');		
		pageInfo.innerHTML=' by '; 

		$(pageInfo).prepend($(pLink))
		pageInfo.appendChild(profileLink);
		
		}
	else
		document.getElementById('pageName').innerHTML="";

	if(pageData.images != undefined){
		for(var i=0; i<pageData.images.length; i++){
		
			imageToDom(pageData.images[i])
		
		}
	}


	if(currentUser=='n00b' || pageName=='profile'){
		$('#likePageButton').css('left','70px')
		$("#likeButtonText").hide();
		$("#likeIm").hide();

		}
	else{
		$('#likePageButton').css('left','250px')
		$("#likeButtonText").show();
		$("#likeIm").show();
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
	document.body.style.backgroundColor = pageData.background;

	
	if(isUrl(pageData.backgroundImage) && pageData.backgroundImage!='')
		document.body.style.backgroundImage ='url('+pageData.backgroundImage+')';
	//TODO gradients mozilla
	else if (pageData.backgroundImage){
		
		var backgroundGradient=pageData.backgroundImage
		backgroundGradient=backgroundGradient.replace(/;/g,"")
		
		if(backgroundGradient.match('background-image:'))
			backgroundGradient=backgroundGradient.split('background-image:')
		else if(backgroundGradient.match('background:'))
			backgroundGradient=backgroundGradient.split('background:')
		
		for(var b =0;b<backgroundGradient.length;b++){
			document.body.style.backgroundImage=backgroundGradient[b];
		
		}
	}		

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

	
	if(pageName=="profile"){
		$('#pagesListProfile').show().isotope({
		  	// options
		  	itemSelector : '.pageItem',

	  		layout: 'masonry'
	  	})
		now.loadProfileInfo( userProfile,loadProfileInfo,fillPages);		
		$('#pagesList').hide();
	
	}
	
	//TODO: customise for user
	
	
	if(pageName=="main"){
		$('#pagesList').show();
		if(updateMainFlag && updateMainPage){
			mainPageData={}
			updateMainPage=false;	
		if($('#pagesList').data('isotope'))
			
			$('#pagesList').isotope( 'destroy' )			

		  	$('div').remove('.pageItemTemp')

			
			$('#pagesList').isotope({
			  	// options
			  	itemSelector : '.pageItem',
		  		layout: 'masonry'
		  	})
		  	
		  				
			nextPageSkip=0;
			updateMainFlag=false;
			}
		if(mainPageData.pages==undefined){
			now.loadMainPage(null,0,mainPageFilter,function(_page){
				mainPageData.pages=[];
				loadProfileInfo(_page); 
				fillPages(_page)
			});

			}
		else{
			//fillPages(mainPageData)
			document.getElementById('userPages').style.display='block';
			loadProfileInfo(mainPageData)
		}
		
/*
		var blackOut = document.getElementById('blackOut')
		if(blackOut==undefined){
		
			var blackOut = document.createElement('div');
			blackOut.id='blackOut';
	
			blackOut.style.backgroundColor='#000000';
			blackOut.style.width=window.innerWidth+'px';
			blackOut.style.height=window.innerHeight+'px';
			blackOut.style.position='fixed';
			blackOut.style.webkitTransform='translateZ(100000px)';
			blackOut.style.zIndex='100000';
	
			document.body.appendChild(blackOut);
		}
		blackOut.style.display='block';
*/
		
	}
	else if(document.getElementById('blackOut') != undefined) 
		document.getElementById('blackOut').style.display="none";

	if(currentUser != 'n00b'){
		$('#notifyDiv').show();	
		$('#notifyDiv').position({ 
			of: $('.notifyBox'), 
			my:"right top",
			at:"right bottom" })
		$('#notifyDiv').hide();
	}	

	$('#loadingImg').hide();
	
	if (typeof FB !== 'undefined') {
		FB.XFBML.parse(document.getElementById('like'));
	}	

}


//////////////
////PROFILE
///////////

now.updateClicks=function(){
	profileClicks++;
	document.getElementById('profileClicks').innerHTML=profileClicks+' clicks';
	
}

var profileInfo={}
var profileClicks=0;

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

	if(pageName=='profile'){
		document.body.style.backgroundColor=profileInfo.background;
		
		if(profileInfo.backgroundImage !=undefined && profileInfo.backgroundImage.match(/url\(/))
			document.body.style.backgroundImage = profileInfo.backgroundImage;
		
		if(isUrl(profileInfo.backgroundImage) && profileInfo.backgroundImage!='' && profileInfo.backgroundImage!=undefined)
			document.body.style.backgroundImage ='url('+profileInfo.backgroundImage+')';
		//TODO gradients mozilla
		else if (profileInfo.backgroundImage !=undefined){
			
			var backgroundGradient=profileInfo.backgroundImage
			backgroundGradient=backgroundGradient.replace(/;/g,"")
			if(backgroundGradient.match('background-image:'))
				backgroundGradient=backgroundGradient.split('background-image:')
			else if(backgroundGradient.match('background:'))
				backgroundGradient=backgroundGradient.split('background:')			
			for(var b =0;b<backgroundGradient.length;b++){
				document.body.style.backgroundImage=backgroundGradient[b];
			
			}
		}
	}
		
	
	if(pageName=="profile"){
		profileClicks=profileInfo.clicks;
		document.getElementById('profileContainer').style.display="block"
		var containerDiv=document.getElementById('profileContainer');
		
		var userNameDiv=document.createElement('div');
		userNameDiv.id="userName";
		userNameDiv.innerHTML="<a href='javascript:changeProfileColor()'>"+profileInfo.username+"</a>"
		containerDiv.appendChild(userNameDiv);
		
		if(profileInfo.clicks!=undefined){
			var clicks=document.createElement('div')
			clicks.id='profileClicks';
			clicks.innerHTML=profileInfo.clicks+" clicks"
			clicks.style.color='white';
			clicks.style.fontSize='12px';
			userNameDiv.appendChild(clicks)
		}
		
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


	if(pageName=="main"){

		document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
		//document.getElementById('mainFeedDiv').style.display="block"
		changeProfileColor();
		$('#feed').show();	

		$(window).scrollTop(mainPageScroll);

	}

	changeBackground();
	changeProfileColor()
	
		
	return false;
}

var nextPageSkip=0;
var loadingPages=false;
var updateMainFlag=false;

now.updateMain=function(){
	updateMainFlag=true;;
}

loadMorePages=function(){
	
	if(!loadingPages && mainPageData.pages!=undefined){
		loadingPages=true;
		now.loadMainPage(null,nextPageSkip,mainPageFilter,fillPages);
	}

}

fillPages = function(_profileInfo){

	if(_profileInfo.type=='main'){
		profileInfo=_profileInfo
		nextPageSkip+=20;
		mainPageData.pages=mainPageData.pages.concat(profileInfo.pages);


		}
	else
		profileInfo=_profileInfo;

	
	for(var i =0;i<profileInfo.pages.length;i++){
	
		var thisPage=profileInfo.pages[i];
	
		if(thisPage.privacy==3 && pageName=="main")
			continue;
		else if(thisPage.privacy==3 && currentUser != thisPage.owner)
			continue;
	
		if(thisPage.pageName!= "profile" && thisPage.pageName!= "main" && thisPage.pageName!= "invite"){
			
			var infoDiv = document.createElement('div');
			var pageItem = document.createElement('div');			
			pageItem.className = 'pageItem';
			$(pageItem).addClass('refreshPageItmes');


 			var pageNameLink = profileInfo.pages[i].pageName.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/])/g,'\$1') 
 
 			//var pageNameLink = pageNameLink.replace('"','&rdquo');

			var pageLink = document.createElement('div');
			pageLink.style.fontSize = '14px';			
 			pageLink.style.width = '160px';
			pageLink.style.overflow = 'hidden';
			pageLink.style.textOverflow = 'ellipsis';
 			pageLink.style.maxHeight = '300px'

			pageLink.innerHTML = makePageLink(pageLink,profileInfo.pages[i].pageName) 			
			

			infoDiv.appendChild(pageLink);
			infoDiv.style.cursor='pointer';
			infoDiv.className='infoDiv';			


			infoDiv.id=thisPage._id;
			infoDiv.style.paddingTop="2px";

			var infoTxt=""
			if(pageName=="profile"){
				if(thisPage.owner==profileInfo.username)
					infoTxt +='owner'
				else
					infoTxt +='contributor'
			}
			else {
				if(thisPage.privacy==0)
					infoTxt='public'							
				else if(thisPage.privacy==1)
					infoTxt='semi-public'
				else 
					infoTxt='private'

			}	
			var vDiv = document.createElement('div')
			
			vDiv.style.fontSize='11px'
			//vDiv.style.color='grey'
			vDiv.style.marginTop='2px';
			vDiv.style.marginBottom='2px';
			vDiv.style.display='inline';


			if(thisPage.versions != undefined && thisPage.versions.length > 0){
				infoTxt+=", "+thisPage.versions.length+"v"
			}
			vDiv.innerHTML = infoTxt+""; 
			infoDiv.appendChild(vDiv);
			
			
						
			if(thisPage.likes!=undefined && thisPage.likes.length > 0){
				var likeDiv = document.createElement('div')
				
				likeDiv.innerHTML = " " +thisPage.likesN;
			    likeDiv.style.fontSize='11px'
			    likeDiv.style.marginTop='4px'
				
				var likeImg = new Image();
				likeImg.src='https://s3.amazonaws.com/gifpumper/ui/heart-03.gif'
				likeImg.style.width='15px'
				likeImg.style.marginBottom='-4px'
				likeImg.style.marginLeft='1px'
				likeDiv.appendChild(likeImg)
				likeDiv.data={id:i}
				
				likeDiv.onclick = (function(index,id){ 
					return function(){
						disableSelection(document.getElementById(id))
						showLikes(index,id)}
					})(i,thisPage._id);
					
				//likeDiv.style.display = "inline"; 
				likeDiv.style.float = "right";
				likeDiv.className="miniButton";

			}
						
			infoDiv.style.width='160px'
			infoDiv.style.marginBottom='4px';
			//infoDiv.style.paddingLeft='4px';

			infoDiv.style.overflow = 'hidden';
			infoDiv.style.textOverflow = 'ellipsis';
			
			var imgBox = new imgBoxClass(thisPage.pageName,'page',160,false,'mason');
			//imgBox.imgDiv.style.display='inline-block'

			if(likeDiv != undefined)
				infoDiv.appendChild(likeDiv);
			
			imgBox.imgDiv.appendChild(infoDiv);

			pageItem.appendChild(imgBox.imgDiv);
			pageItem.appendChild(infoDiv);
			$(pageItem).addClass('pageItem');
			$(pageItem).addClass('pageItemTemp');

			
			likeDiv=undefined;
			imgBox.imgDiv.style.display='block'
			
			//document.getElementById('pagesList').appendChild(pageItem);
			
			if(pageName=='main')
				$('#pagesList').append( $(pageItem) ).isotope( 'appended', $(pageItem));
			else
				$('#pagesListProfile').append( $(pageItem) ).isotope( 'appended', $(pageItem));
				
		}
	}
	document.getElementById('userPages').style.display='block';
	loadingPages=false;
	
	if(profileInfo.type=='main'){
		$(window).scrollTop(mainPageScroll);
		if(mainPageScroll> window.pageYOffset)
			loadMorePages()

	}
	

	
}


changeProfileColor =function(){
	var r = Math.random()
	var color=bgColorList2[Math.floor(r*bgColorList2.length)];
	var r = Math.random()
	var color2=bgColorList2[Math.floor(r*bgColorList2.length)];
	containerDiv=document.getElementById('profileContainer');
	//document.getElementById('userPages').style.backgroundColor='rgba(255,255,255,.85)';
	//document.getElementById('contributePages').style.backgroundColor='rgba(255,255,255,.85)';

	var r = Math.random()
	var color=bgColorList2[Math.floor(r*bgColorList2.length)];
	document.getElementById('mainFeedDiv').style.backgroundColor= color2;
	document.getElementById('feedContainer').style.backgroundColor= color;
	
	if(pageName=='profile')
		{}//document.getElementById('userPages').style.backgroundColor= color2;
	else
		document.getElementById('userPages').style.backgroundColor= '';
	
	//$("#mainFeedDiv a").css('color',oppositeColor(color));	
	containerDiv.style.backgroundColor=color;
	var r = Math.random()
	var color=bgColorList2[Math.floor(r*bgColorList2.length)];
	//document.getElementById('feed').style.backgroundColor = color;
	//$("#feed a").css('color',oppositeColor(color));	

	return false;
}


////////////////
///MAIN ONLINE
//////////////


fillOnline = function(onlineNow){

	if(onlineNow != undefined && onlineNow.length>0){
		
		for(var i = 0; i<onlineNow.length;i++){
			if(onlineObj[onlineNow[i].page]==undefined){
				onlineObj[onlineNow[i].page]=[];
			}
			onlineObj[onlineNow[i].page].push(onlineNow[i].user)
		}
		
		
	}
	
	var onlineArr=[];
	var showOnline=false;

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
	
	if(onlineArr.length<1){
		$('#mainFeedDiv').hide();
		$('#mainFeedDiv').css({'height':'0px','margin':'0px','width':'0px','padding':'0px'});
		}
	else{
		$('#mainFeedDiv').show();
		$('#mainFeedDiv').css({'height':'auto','margin':'5px','width':'160px','padding':'7px'});
		}
	
	//console.log(onlineArr)	
	var mainOnlineDiv = document.getElementById('activeNow')
	mainOnlineDiv.innerHTML='';
	

	for(var i=0;i<onlineArr.length;i++){
		var onlineDiv = document.createElement('div');
		onlineDiv.style.color='white';
		onlineDiv.style.backgroundColor='rgba(255,255,255,.4)';
		onlineDiv.style.margin='5px';
		onlineDiv.style.padding='5px';
		onlineDiv.style.className='activePage';

		
		txtDiv = document.createElement('div');
		txtDiv.style.overflow = 'hidden';
		txtDiv.style.textOverflow = 'ellipsis';

		var imgBox = new imgBoxClass(onlineArr[i].page,'page',140,false,'mason');

		var pageLink = document.createElement('span');

		if(onlineArr[i].type==null){

			pageLink.innerHTML=makePageLink(pageLink,onlineArr[i].page)+" - ";
			
			}
		else{ 
		
			pageLink.innerHTML=makePageLink(pageLink,onlineArr[i].page,"profile")+" - ";
			
			}
			
		txtDiv.appendChild(pageLink);
		txtDiv.id='activePages'+onlineArr[i].page;
		
		for(var n=0;n<onlineArr[i].users.length;n++){
		
			var usrDiv = document.createElement('div');						
			
			usrDiv.innerHTML = makePageLink(usrDiv,onlineArr[i].users[n],'profile');
						
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
	
	changeBackground();
	

	if(!$('#userPages').is(':hidden')){
		$('#pagesList').isotope( 'reLayout', null )

	}

	
	return false;
}


makePageLink = function(_el, _page, _profile, _version,img){

	var el;
	if(_el==null){
		
		el=document.createElement('span');
		if(img)
			el.style.width='300px'
			el.style.height='300px'
			
		}
	else el=_el
	
	var linkText;
	
	var profileNameLink 
	var pageNameLink = _page.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/])/g,'\$1') 
	pageNameLink=encodeURI(pageNameLink);

	if(!img){
		if(_profile == 'profile')
			linkText = '<a href=profile/'+pageNameLink+'>'+_page+'<a>';
		else if(_version !=undefined)
			linkText = '<a href='+pageNameLink+'/'+_version+'>'+_page+' v'+_version+'<a>';
		else
			linkText = '<a href='+pageNameLink+'>'+_page+'<a>';
	}
	else{
		if(_profile == 'profile')
			linkText = '<a href=profile/'+pageNameLink+'>';
		else if(_version !=undefined)
			linkText = '<a href='+pageNameLink+'/'+_version+'>';
		else
			linkText = '<a href='+pageNameLink+'>';
	}

	el.onclick=(function(page,profile,version) {
	    return function() {
	       goToPage(page,profile,version);
	       return false;
	    };
	})(_page,_profile,_version);
	
	el.style.cursor='pointer';
	//el.className='fakeLink';

	if(_el==null){
		el.innerHTML=linkText;
		return el;
	}
	else
		return linkText;				

}
