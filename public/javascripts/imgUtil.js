function imgBoxClass(name,type,size,shadow){

	self=this;
	this.img = new Image();
	this.img.className=type+name
	
	this.imgDiv = document.createElement('div')
	this.imgDiv.className="thumbContainer";			
	$(this.imgDiv).addClass(type+name+"div");			

	this.imgDiv.style.width=size+"px";
	this.imgDiv.style.height=size+"px";
	this.imgDiv.style.cursor='pointer'
	this.imgDiv.style.borderRadius="2px";

	
	this.imgDiv.appendChild(this.img);
	$(this.img).hide();

	this.loadImg = function(url,user,type){
		
			var className = type+user
			if(url==undefined || url=="")
				url=defaultIcon.src
			$("."+className).attr("src", url)
			userImages[type+user].img=url;

	}
	
	this.cropImg = function(img,size){
		var height = img.height;
		var width = img.width;
		
		var replaceGif =false
		if((height > 400 || width > 400))
			replaceGif = true;
		//if(replaceGif)
		//   freeze_gif(img)
	
		if(width>height){
			var ratio = size/height;
			img.height=size;
			img.width=width*ratio;
			var offset = -(width*ratio-size)/2
			img.style.marginLeft=offset+'px';
		}
		else {
			var ratio = size/width;
			img.width=size
			img.height=height*ratio;
			var offset = -(height*ratio-size)/2
			img.style.marginTop=offset+'px';
		}

		$(img).show();
		if(replaceGif)
			freeze_gif(img)
	}

	this.img.onload=(function(_img,_div,size,_self){
			return function(){
				_self.cropImg(_img,size,_div);
				//$(_img).show();
			}
		})(self.img,self.imgDiv,size,self)
	
	if(userImages[type+name]==undefined){
		userImages[type+name]={}
		userImages[type+name].img='loading';
		if(type=='user'){
			if(name=='n00b'){
				this.img.src=defaultIcon.src;
				userImages[type+name].img=defaultIcon.src;
			}
			else
				now.getUserPic(name, function(_url,usr){self.loadImg(_url,usr,'user')})
			}
		if(type=='page')
			now.getPagePic(name, function(_url,_img,color,page){
				if(_url!=undefined && isUrl(_url))
					self.loadImg(_url,page,'page')
				else if(_img!=undefined && isUrl(_img))
					self.loadImg(_img,page,'page')
				else{
					$(".page"+page+"div").css('backgroundColor',color) 
					userImages[type+name].color=color;
					userImages[type+name].img=null;
					}
				})
	}
	else if(userImages[type+name].img!='loading'){

		if(userImages[type+name].img!=null)
			this.img.src=userImages[type+name].img;
		else
			this.imgDiv.style.backgroundColor=userImages[type+name].color
	}

	if(shadow)
		$(this.imgDiv).addClass('shadow');
	
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
			})(name);
}

function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}

function is_gif_image(i) {
  return /^(?!data:).*\.gif/i.test(i.src);
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