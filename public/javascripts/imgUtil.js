function imgBoxClass(name,type,size,shadow,mason){


	self=this;
	this.img = new Image();
	if(name=="srsly?>?>")	
		console.log(name)
	var origName = name;
	//name.replace(/\?/g,"")
	//name = name.replace(/\?|\]|\s/g,'_')
	//name=RegExp.escape(name)

	this.img.className=type+name
	
	this.imgDiv = document.createElement('div')
	this.imgDiv.className="thumbContainer";			
	$(this.imgDiv).addClass(type+name+"div");			

	this.imgDiv.style.width=size+"px";
	this.imgDiv.style.height=size+"px";
	this.imgDiv.style.cursor='pointer'
	this.imgDiv.style.borderRadius="2px";
	
	this.img.style.width=size+'px';
	//this.imgDiv.appendChild(this.img);
	var linkPage = name
	var profile = null;
	if(type=='user')
		profile='profile'
	
//	var mySpan = $(makePageLink(null,name,profile, null,true))
//	mySpan.children(0).append(this.img)
//	$(this.imgDiv).append($(makePageLink(null,name,profile, null,true)).children(1).append(this.img))

	$(this.imgDiv).append($(makePageLink(this.imgDiv,name,profile, null,true)).append(this.img))
	
	//$(this.imgDiv).append(makePageLink(this.img,name,null,null, null, null,true),this.img,'</a>')
	
	$(this.img).hide();
	
	this.img.onerror=(function(img){
					return function(){
						$(img).hide()}
					})(this.img)

	this.loadImg = function(url,user,type){
		
			var className = type+user
			if(url==undefined || url=="")
				url=defaultIcon.src
				var el = document.getElementsByClassName(className)
				for (var i = 0; i < el.length; i++){
					el[i].src=url;
					$(el[i]).show();
				
				//$("."+className).attr("src", url)
					userImages[type+user].img=url;
				}
	}
	
	this.cropImg = function(img,size,div,_mason){
		var height = img.naturalHeight;
		var width = img.naturalWidth;
		
		var replaceGif =false
		if(!is_safari && (height > 200 || width > 400))
			replaceGif = true;
		else if(is_safari && (height > 200 && width > 400))
			replaceGif = true;
		//if(replaceGif)
		//   freeze_gif(img)
		
/* 		replaceGif = true; */
		$(img).width('auto');
	
		if(width>height){

			if(_mason=='mason'){
				img.width=size
				img.height=height*size/width;
				div.style.height=height*size/width+"px"
				div.style.width=size+"px"
				}
			else{
				var ratio = size/height;
				img.height=size;
				img.width=width*ratio;
				var offset = -(width*ratio-size)/2
				img.style.marginLeft=offset+'px';
			}
		}
		else {
			if(_mason=='mason'){
				img.width=size
				img.height=height*size/width;
				div.style.height=height*size/width+"px"
				div.style.width=size+"px"
				}
			else{
			var ratio = size/width;
			img.width=size
			img.height=height*ratio;
			var offset = -(height*ratio-size)/2
			img.style.marginTop=offset+'px';
			}
		}

		$(img).show();
		if(replaceGif)
			freeze_gif(img)
	}

	this.img.onload=(function(_img,_div,size,_self,_mason){
			return function(){
				_self.cropImg(_img,size,_div,_mason);
				//$(_img).show();
				
				if(mason=='mason'){
					//$('#pagesList, #pagesListProfile').isotope( 'reLayout', null )
					relayout();				
				}
			}
		})(self.img,self.imgDiv,size,self,mason)
	
	if(userImages[type+name]==undefined){
		userImages[type+name]={}
		userImages[type+name].img='loading';
		if(type=='user'){
			if(name=='n00b'){
				this.img.src=defaultIcon.src;
				userImages[type+name].img=defaultIcon.src;
			}
			else
				now.getUserPic(origName, function(_url,usr){
					//usr = usr.replace(/\?|\]|\s/g,'_')
					self.loadImg(_url,usr,'user')
					})
			}
		if(type=='page')
			now.getPagePic(origName, function(_url,_img,color,page){

				//page = page.replace(/\?|\]|\s/g,'_')
				//page=RegExp.escape(page)
				//console.log(page)
				if(_url!=undefined && isUrl(_url))
					self.loadImg(_url,page,'page')
				else if(_img!=undefined && isUrl(_img))
					self.loadImg(_img,page,'page')
				else{
					var el = document.getElementsByClassName("page"+page+"div")
					for (var i = 0; i < el.length; i++){
					//$(".page"+page+"div").css('backgroundColor',color) 
						el[i].style.backgroundColor=color;
						userImages[type+name].color=color;
						userImages[type+name].img=null;
					}
					}
				})
	}
	else if(userImages[type+name].img!='loading'){

		if(userImages[type+name].img!=null){
			this.img.src=userImages[type+name].img;
			if(mason=='mason' ){
				relayout();
		}			}
		else
			this.imgDiv.style.backgroundColor=userImages[type+name].color
		
		
	}

	if(shadow)
		$(this.imgDiv).addClass('shadow');
	
/*
	if(type=='user')
		this.imgDiv.onclick=(function(user) {
			    return function() {
			       goToPage(user,'profile');
			    };
			})(name);
			
	if(type=='page')
		this.imgDiv.onclick=(function(page) {
			    return function() {
			       goToPage(page);
			    };
			})(origName);
*/
}

function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}

function is_gif_image(i) {
  return /^(?!data:).*\.gif/i.test(i.src);
}

RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function freeze_gif(i,div) {
  var c = document.createElement('canvas');
  var w = c.width = i.width;
  var h = c.height = i.height;
  c.getContext('2d').drawImage(i, 0, 0, w, h);
  //c.style.display="block";
  //c.id=i.id;
  $(c).show();

  try {
    i.src = c.toDataURL("image/gif"); // if possible, retain all css aspects
  } catch(e) { // cross-domain -- mimic original with all its tag attributes
    for (var j = 0, a; a = i.attributes[j]; j++)
    	if(a.name=='style')
     	 c.setAttribute(a.name, a.value);
    i.parentNode.replaceChild(c, i);
  }
}

var layingOut=false;
var doLayout=false;

function relayout(){

	//if(mason=='mason' && !$('#userPages').is(':hidden')){
	if(!layingOut){	
		if(pageName=='main' && $('#pagesList').data('isotope')){
			layingOut=true;
			//console.log('started layout')
			$('#pagesList').isotope( 'reLayout', function(){
				layingOut=false; 
				//console.log('stopped layout')
				if(pageName != 'main')
					return;
				if(doLayout) 
					relayout(); 
				doLayout=false;  
				})
		}
		if(pageName=='profile' && $('#pagesListProfile').data('isotope')){
			layingOut=true;
			$('#pagesListProfile').isotope( 'reLayout', function(){
				layingOut=false; 
				if(pageName != 'profile')
					return;
				if(doLayout) 
					relayout(); 
				doLayout=false;  
				})
		
		}
		

	}
	else doLayout=true; 
}

function layoutLoop(){
	if(doLayout){	
	 	layingOut=false;
	 	relayout()
	 	layingOut=true;
	}
	setTimeout(layoutLoop,4000)
}
layoutLoop();