/**
 * Module dependencies.
 */

var express = require('express')
	, crypto = require('crypto');

//var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;
//var ArticleProvider = require('./articleprovider-memory').ArticleProvider;


var mongoose = require('mongoose');


var Schema = mongoose.Schema;

mongoose.connect('localhost','gifpumper',27017)


//MemoryStore = express.session.MemoryStore,
var MongoStore = require('connect-mongo');

sessionStore = new MongoStore({db:'gifpumper'})



//TODO:change cookie settings to the right domain
var app = module.exports = express.createServer(    
	express.bodyParser()
  , express.cookieParser()
  , express.session({store: sessionStore, secret: 'something sweet', cookie: {path:'/',domain:".gifpumper.com", expires: false 
}}));
// Configuration

app.configure(function(){

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  



  app.use(express.favicon(__dirname + '/public/images/favicon.ico',{ maxAge: 
2592000000 }));
  app.use('/public', express.static(__dirname + '/public'));
  //app.use(express.static(__dirname + '/public'));

//app.use(express.static(your_path));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var parseCookie = require('connect').utils.parseCookie;

///////////////////////////
//TODO: WHAT DOES THIS DO?
/////////////////////////

app.dynamicHelpers({
  message: function(req){
    var err = req.session.error
      , msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    if (err) return '<p class="msg error">' + err + '</p>';
    if (msg) return '<p class="msg success">' + msg + '</p>';
  }
});


//var articleProvider = new ArticleProvider('localhost', 27017);
//mongoose.connect('mongodb://localhost:27017/gifpumper');

   
/////////////
////MONGOOSE
///////////   

var imageSchema = new Schema({
	width : String,
	height : String,
	top : String,
	left : String,
	anglex : Number,
	angley : Number,
	angler : Number,
	z : Number,
	url : {type:String},
	backgroundColor : String,
	backgroundImage : String,
	backgroundType : String,	
	content : String,
	contentType : String,
	opacity : Number,
	user : String,
    d2d : {type: Boolean, default: false}
});

var divSchema = new Schema({
	width : String,
	height : String,
	top : String,
	left : String,
	anglex : Number,
	angley : Number,
	angler : Number,
	z : Number,
	backgroundColor : String,
	backgroundImage : String,
	backgroundType : String,	
	content : String,
	opacity : Number,
	user : String
});

var versionSchema = new Schema({
    pageName    : String
  , owner 		: String
  , images      : [imageSchema]
  , backgroundImageType : Number
  ,	background 	: String
  ,	backgroundImage: String
  , text 		: [textSchema]
  , contributors : []
  , likes : []
  , likesN : {type: Number, default:0,min:0}
});
	
var pageSchema = new Schema({
    pageName    : {type : String, index: { unique: true }}
  , owner 		: String
  , editors		: []
  , images      : [imageSchema]
  , privacy		: Number
  , backgroundImageType : Number
  ,	background 	: String
  ,	backgroundImage: String
  , text 		: [textSchema]
  , contributors : []
  , parent : String
  , children : []
  , versions : [versionSchema]
  , currentVersion: {type: Number, default:0, min:0}
  , likes : []
  , likesN : {type: Number, default:0,min:0}
  , vLikes : {type: Number, default:0,min:0}
  , d2d : {type: Boolean, default: false}
  , notify : [notifySchema]
  , bgDisplay : String
  , created : { type: Date, default: Date.now }
});

var userSchema = new Schema({
	  username : {type :String,  index: { unique: true }}
	, salt : {type: String}
	, password : Buffer
	, email : String 
	, pages: []
	, contributedTo : []
	, favoritePages : []
	, favoriteUsers : []
	, text : [textSchema]
	, likes: []
	, userImage: {type:String, default:""}
	, backgroundImage : String
	, background : String
	, bgDisplay : String
	, info : String
	, notify : [notifySchema]
	, newNotify : Number
	, nowId : String
	, clicks : {type: Number, default:0,min:0}
});


var notifySchema = new Schema({
	  user: String
	, page: String
	, action: String
	, version: Number
	, time : { type: Date, default: Date.now }
	, img : String
});

var textSchema = new Schema({
	  user : String
	, text : String
	, time : { type: Date, default: Date.now }
	, at : []
	, hash : []
});

var onlineSchema = new Schema({
	  user : String
	, page : String
	, nowId : {type :String,  index: true} 

})

function toLower (v) {
  return v.toLowerCase();
}

function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}

function hash(msg, key) {
  return crypto.createHmac('sha256', key).update(msg).digest('hex');
}



var pageModel = mongoose.model('pageModel', pageSchema);
var imageModel = mongoose.model('imageModel', imageSchema);
var userModel = mongoose.model('userModel', userSchema);
var textSchema = mongoose.model('textModel', textSchema);
var versionModel = mongoose.model('versionModel', versionSchema);
var notifyModel = mongoose.model('notifyModel',notifySchema);
var onlineModel = mongoose.model('onlineModel',onlineSchema);

//var divSchema = mongoose.model('divModel', divSchema);


///////
//GETS
/////

/*
app.get('/', function(req, res){

	var loggedIn = false;
	var user = 'not logged in';	
	var owner= false;
	var privacy=null;

	if (req.session.user) {
		loggedIn = true;
		user = req.session.user;
		
		//TODO default page
				
		pageModel.findOne({'pageName':'main'},{privacy:true, owner:true},function(err, result){
			if(!err){
				var owner=false;
				if(result != null && result.owner == req.session.user){
					owner=true;
				}
				else owner=false
				//oldthis.now.setPagePermissions(oldthis.user.pagePermissions[pageName], owner)
			}
			else(console.log(err))
		
			res.render('index.jade',{ 
				locals: {
	        		loggedIn: loggedIn,
			        user:user,
			        owner:owner,
				    privacy:privacy
	    		}
	   		});	
		
		})
	}
	else{
		res.render('index.jade',{ 
			locals: {
        		loggedIn: loggedIn,
		        user:user,
		        owner:owner,
			    privacy:privacy
    		}
    	})	
	}
});
*/


//var reg = new RegEx('((?![public]).)','gi')

//app.get(/((?!(^[\/public]).))/gi, function(req,res) {

app.get('/*', function(req,res,next) {


	
	var tokens = req.params[0].split("/");
	if(tokens[0]=='public'){
		next();
		return;
	}
	
	//console.log(req.params[0])
	
	var pageName=tokens[0];
	console.log(pageName)
	if(pageName=='')
		pageName='main';	
	if(tokens[0]!='profile'){

		pageModel.findOne({'pageName': pageName},{versions:{$slice: 0},text:{$slice:-20},notify:{$slice:-100}}, function(error, result) {	
		if(!error){

			var img;
			if(result != undefined && result.backgroundImage !=undefined && result.backgroundImage!=""){
				img=result.backgroundImage;
			}
			else if(result!=undefined && result.images !=undefined && result.images[0]!=undefined && result.images[0]!=''){
				img=result.images[0].url;
			}
			else 
				img='http://asdf.us/im/16/recliningnude_02_1318746347_d_magik_1327306294_d_magik.gif'
			
			res.render('index.jade',{locals: {
		        		loggedIn: true,
				        user:'n00b',
				        owner:false,
					    privacy:3,
					    getPageData:result,
					    image:img,
					    title:pageName,
					    url:'http://gifpumper.com/'+encodeURI(pageName)
					    }
					})
				}
		})		
	}
	else{
		res.render('index.jade',{locals: {
	        		loggedIn: true,
			        user:'n00b',
			        owner:false,
				    privacy:3,
				   	getPageData:null,
				   	image:"",
				   	title:'profile',
				   	url:'gifpumper.com'

				    }
	    		})
	   	}
	   
    
})




/*
app.get("/:page/:version?", function(req,res) {

	if(req.params.page == "javascripts" || req.params.page == "stylesheets")
		return;

	if(true){//req.params.page!='favicon.ico'){
		var loggedIn = false;
		var user = 'not logged in';	
		var owner= false;
		var privacy=null;

		if (req.session.user) {
			loggedIn = true;
			user = req.session.user;
			
			//var pageReg = new RegExp("^"+req.params.page+"$",'i')
			var pageReg = req.params.page;
			pageModel.findOne({'pageName':pageReg},{privacy:true, owner:true},function(err, result){
			
			if(!err && result != undefined){
				var owner=false;
				if(result.owner == req.session.user){
					owner=true;
				}
				var privacy=result.privacy;
			}
		
			//TODO: create new page?
			if(result == undefined)
	       		res.redirect('back');
			else
			res.render('index.jade',{ 
				locals: {
	        		loggedIn: loggedIn,
			        user:user,
			        owner:owner,
				    privacy:privacy
	    		}
	   		});	
		
		})
	}
	else{
		res.render('index.jade',{ 
			locals: {
        		loggedIn: loggedIn,
		        user:user,
		        owner:owner,
			    privacy:privacy
    		}
    	})	
	}
	}
});
*/



/*
app.get(/^\/profile?(?:\/(\d+)(?:\.\.(\d+))?)?/, function(req,res) {
	req.params.user=req.params[0];
	if(req.params.user!='favicon.ico'){
		var loggedIn = false;
		var user = 'not logged in';	
		var owner= false;
		var privacy=null;

		if (req.session.user) {
			loggedIn = true;
			user = req.session.user;
			
			var page = 'profile_'+req.params.user;
			
			pageModel.findOne({'pageName':page},{privacy:true, owner:true},function(err, result){
			if(!err && result != undefined){
				var owner=false;
				if(result.owner == req.session.user){
					owner=true;
				}
				var privacy=result.privacy;
			}

			res.render('index.jade',{ 
				locals: {
	        		loggedIn: loggedIn,
			        user:user,
			        owner:owner,
				    privacy:privacy
	    		}
	   		});	
		
		})
	}
	else{
		res.render('index.jade',{ 
			locals: {
        		loggedIn: loggedIn,
		        user:user,
		        owner:owner,
			    privacy:privacy
    		}
    	})	
	}
	}
});
*/




app.listen(80);
var nowjs = require("now");
var everyone = nowjs.initialize(app);

////////
//AUTH
/////
function authenticate(name, pass, fn) {
  
  userModel.findOne({username:name},function(err,user){
	  // query the db for the given username
	  if (err || !user) return fn(new Error('cannot find user'));
	  // apply the same algorithm to the POSTed password, applying
	  // the hash against the pass / salt, if there is a match we
	  // found the user
	  if (user.password == hash(pass, user.salt)) return fn(null, user);
	  // Otherwise password is invalid
	  fn(new Error('invalid password'));  
  });

}


////////
//LOGIN
//////

app.post('/login', function(req, res){

	if(req.body.logout){
	  req.session.destroy(function(){
	    res.redirect('home');
	  });	
	}
	if(req.body.login){
	  authenticate(req.body.username, req.body.password, function(err, user){
	    if (user) {
	      	// Regenerate session when signing in
	      	// to prevent fixation 
	      	req.session.regenerate(function(){
	        // Store the user's primary key 
	        // in the session store to be retrieved,
	        // or in this case the entire user object
	        req.session.user = user.username;
	        res.redirect('/');
	      });
	    } else {
	      req.session.error = 'Authentication failed, please check your '
	        + ' username and password.'
	        + ' (use "tj" and "foobar")';
	      res.redirect('back');
	    }
	  });
	}
});




/////////
///INITS
///////

var inviteCode= {pumpLove93:1,pumpEyebeam:1,innerPump:1,fbPump:1,'319Pump':1}
everyone.now.checkInvite = function(invite,callback){

	if(inviteCode[invite]!=undefined)
		callback(true)
	else
		callback(false)		

}

everyone.on('join', function(){

  	var cookie=this.user.cookie['connect.sid']

	if(cookie==undefined || cookie==null){
		this.user.name = 'n00b'
		return;
	}

	cookie = parseCookie(cookie)['']
		
	var oldthis = this;
	
	sessionStore.get(cookie, function (err, session) {
            if (err) {
               console.log('something is wrong')
            } 
            else {
            	if(session == undefined || session.user == undefined)
					oldthis.user.name = 'n00b'
				else {
					oldthis.user.name = session.user;
					userModel.findOne({username:oldthis.user.name},{userImage:1},function(err, result){
						if(!err){
							oldthis.user.image=result.userImage;
						}
					})												
                }
                console.log(oldthis.user.name + ' connected');
            }
        });	

	}
);

everyone.now.getNotifications = function(){
	
	if(this.user.name=='n00b')
		return;
	userModel.findOne({username:oldthis.user.name},{notify:{$slice:-50},newNotify:1},function(err, result){
		if(!err){
			if(result!=null && result.newNotify==undefined)
				result.newNotify=0	    		
	    		if(oldthis.now.notify != undefined){
	    			oldthis.now.notify(result.notify,result.newNotify)
 	    			userModel.update({username:oldthis.user.name},{$set : {newNotify:0,notify:result.notify, nowId:oldthis.user.clientId}},function(err){
 	    				if(err) console.log(err)
 	    			})
 	    		}
		}		
	})
}

everyone.now.getUserPic= function(username,callback){
	userModel.findOne({username:username},{userImage:1},function(err,res){
		if(!err){
			callback(res.userImage,username)
		}
	})
}

everyone.now.getPagePic = function(page, callback){
	pageModel.findOne({pageName:page},{backgroundImage:1,'images.url':1,background:1},function(err,res){
		if(!err && res!=null){
			var url;
			var img;
			if(res != null && res.backgroundImage !=undefined && res.backgroundImage!="")
				url=res.backgroundImage;
			if(res!=null && res.images !=undefined && res.images[0]!=undefined && res.images[0]!='')
				img=res.images[0].url;
			color = res.background;
			callback(url,img,color,page)
		}
		else(console.log(err))
	})
}

everyone.now.updateAll = function(pageData,callback){	
	for(var page in pageData){			
		pageModel.update({pageName:page}, pageData[page]['pageData'],{upsert:true,multi:false}, function(error) {
	      		if(error) console.log(error)
	    });
    }
}


everyone.now.loadProfileInfo = function(user, callback1,callback2){

/*
	if (this.user.name=='n00b'){
		return;
	}
*/

	userModel.findOne({username:user}, { password : 0, salt:0 },function(error,result){
		if(!error){
			if(callback1!=null)
				callback1(result)	
			pageModel.find({$or :[{owner:user},{"images.user":user}]},{'pageName':1,'likes':1,'likesN':1,'vLikes':1,'contributors':1,'owner':1,'versions.currentVersion':1}).sort('likesN',-1,'pageName',1).run(function(error,result2){
				result.pages=result2;
				result.type='profile'

				callback2(result);
			})
		}		
	})	
}

//TODO finish dynamic loading of main feed
everyone.now.loadMainNotify = function(start,callback){
	if (this.user.name=='n00b'){
		//return;
		}
	pageModel.find({pageName:'main'},{notify:{$slice: [start+20,20]}},function(err,result){
		if(!err) callback(result)
		else console.log(err)
	})

}


everyone.now.loadMainPage = function(user,startN,callback){

	if (this.user.name=='n00b'){
		//return;
		}

		pageModel.find( {privacy:{$ne:3}},{'pageName':1,'likes':1,'likesN':1,'privacy':1,'contributors':1,'owner':1,'vLikes':1,'versions.currentVersion':1}).sort('likesN',-1,'pageName',1).skip(startN).limit(20).run(function(err,result2){
				if(err)
					console.log(err)
				else{
					var responce={};
					responce.pages=result2;
					responce.type='main'
					callback(responce);
				}
			})		
}


everyone.now.loadAll = function(pageName,userProfile,version,callback){
	
	//var pagesGroup = {};
	var groupName=pageName;
	if(pageName=="profile")
		groupName = "profile___"+userProfile;
		
	if (this.user.name=='n00b'){
		//groupName='invite';
		//pageName='invite';
		}
	
	console.log(groupName);
	console.log(this.user.pagePermissions[pageName]);
	if (this.user.pagePermissions[groupName] == undefined || (this.user.pagePermissions[groupName]==3 && this.user.pagePermissions[groupName]!='owner')){
		//console.log(this.user.pagePermissions[pageName])
		callback("This page is private")
		return;
	}

	if(version !=undefined)
		var sliceParam = [parseInt(version),1]
	else
		var sliceParam = -1;

	var oldthis = this;
	
	//var pageReg = new RegExp("^"+pageName+"$",'i')

	pageModel.findOne({'pageName': pageName},{versions:{$slice: sliceParam},text:{$slice:-20},notify:{$slice:-100}}, function(error, result) {
          if( error ){
          	 callback(error, null)
          }
          else{
          	
			//pageName=result.pageName;	
			nowjs.getGroup(groupName).addUser(oldthis.user.clientId);

			if(oldthis.user.name=='eyebeam')
				nowjs.getGroup('eyebeam-real-time').addUser(oldthis.user.clientId);

			
			//TODO: not n00b?
			if(result.privacy<3)
				onlineModel.update({nowId:oldthis.user.clientId},{$set : {page:groupName,user:oldthis.user.name}},{upsert:true},function(err){
				if(err) console.log(err)
				});
				
			if(nowjs.getGroup(groupName).pageUsers == undefined)
				nowjs.getGroup(groupName).pageUsers={};
			
			//leavePage
			if(oldthis.user.currentPage!=undefined && oldthis.user.currentPage != groupName){
				if(oldthis.user.currentPage != null){
					nowjs.getGroup(oldthis.user.currentPage).exclude(oldthis.user.clientId).now.updatePageUser('delete',oldthis.user.name);		
					delete nowjs.getGroup(oldthis.user.currentPage).pageUsers[oldthis.user.clientId];
					nowjs.getGroup(oldthis.user.currentPage).removeUser(oldthis.user.clientId);
					
					nowjs.getGroup('main').exclude(oldthis.user.clientId).now.updateFeed(oldthis.user.name,oldthis.user.image,oldthis.user.currentPage,'leave')
					oldthis.user.currentPage = null;
				}			
			}
				
								
			oldthis.user.currentPage=groupName;
			if(result.privacy<3)
				nowjs.getGroup('main').now.updateFeed(oldthis.user.name,oldthis.user.image,groupName,'join')
			
			oldthis.now.updatePageUser('add',nowjs.getGroup(groupName).pageUsers,userProfile);
			if(oldthis.user.name=='n00b'){
				var userObj = {}
				userObj={'n00b':true};
				nowjs.getGroup(groupName).pageUsers[oldthis.user.clientId]=userObj;
				nowjs.getGroup(groupName).now.updatePageUser('add',[userObj]);
			}
			else{
				var userObj = {}
				userObj[oldthis.user.name]=true;
				nowjs.getGroup(groupName).pageUsers[oldthis.user.clientId]=userObj;
				nowjs.getGroup(groupName).now.updatePageUser('add',[userObj]);			
			}

		callback(null, result)

     	}
     });
}


everyone.now.camera = function(transform,animate){

	if(this.user.name=='eyebeam-user'){
	
		nowjs.getGroup('eyebeam-real-time').now.updateMainDivServer(transform,animate)
	
	}


}


onlineModel.remove({},function(err){});

everyone.now.getAllUsers = function(callback){
	onlineModel.find({},{user:1,page:1,_id:0},function(err,res){
		if(!err)
			callback(res)
	})
}

everyone.now.leftWindow = function(left){

	if(this.user.currentPage != null){
		if(left){
			nowjs.getGroup(this.user.currentPage).now.clientLeftWindow(this.user.name,true);
			nowjs.getGroup(this.user.currentPage).pageUsers[this.user.clientId][this.user.name]=false;
			}
		else{
			nowjs.getGroup(this.user.currentPage).now.clientLeftWindow(this.user.name,false);
			nowjs.getGroup(this.user.currentPage).pageUsers[this.user.clientId][this.user.name]=false;
			}
	}
}

everyone.on('leave', function(){
	
	if(this.user.clicks==undefined){
		this.user.clicks=0;
	}
/*
		userModel.update({username:this.user.name},{$inc:{clicks:this.user.clicks}},function(err){
			if(err) console.log(err)
		})
*/
	
	userModel.update({username:this.user.name},{$set : {nowId:null} , $inc:{clicks:this.user.clicks}},function(err){
		if(err) console.log(err)
	})
	
	if(this.user.currentPage!=undefined)
	nowjs.getGroup('main').exclude(this.user.clientId).now.updateFeed(this.user.name,this.user.name,this.user.currentPage,'leave')

	if(nowjs.getGroup(this.user.currentPage).pageUsers!=undefined)
		delete nowjs.getGroup(this.user.currentPage).pageUsers[this.user.clientId];
	nowjs.getGroup(this.user.currentPage).now.updatePageUser('delete',this.user.name);
	//pagesGroup[this.user.currentPage].removeUser(this.user.clientId);
	onlineModel.remove({nowId:this.user.clientId},function(err){});
});

everyone.now.click = function(){
	if(this.user.clicks==undefined)
		this.user.clicks=0;
	this.user.clicks+=1;
	nowjs.getGroup('profile___'+this.user.name).now.updateClicks()
	
}


///////////////
///PERMISSIONS
/////////////

everyone.now.getPagePermissions = function(pageName,userProfile,version,callback){

	oldthis=this;
	if(this.user.pagePermissions==undefined)
		this.user.pagePermissions={};

	if (this.user.name=='n00b'){
		//groupName='invite';
		//pageName='invite';
		}
/*
	if(version==null || version==undefined)
		version=-1;
*/
	pageModel.findOne({pageName:pageName}, {privacy:true, owner:true, editors:true, currentVersion:1},function(err, result){
		if(!err && result !=undefined){	
			
			if(result.currentVersion != undefined && version != null && version !=undefined){
				if(result.currentVersion<=version){
					callback('noPage')
					return;
					}
			}
				
			
			var owner=false;
			if(result.owner == oldthis.user.name){
				oldthis.user.pagePermissions[pageName]='owner';
				owner=true;
			}
			else oldthis.user.pagePermissions[pageName]=result.privacy;
			
			if(result.editors!=undefined){
				for(var i=0;i<result.editors.length;i++){
					if(result.editors[i]==oldthis.user.name && !owner){
						oldthis.user.pagePermissions[pageName]=0;
					}
				}
			}
			
			if(oldthis.user.name == 'n00b' && result.privacy<2)
				oldthis.user.pagePermissions[pageName]=2;
			
			if(pageName=="profile"){
				pageName = "profile___"+userProfile;
				if(userProfile == oldthis.user.name)
					oldthis.user.pagePermissions[pageName]='owner';
				else if(oldthis.user.name == 'n00b')
					oldthis.user.pagePermissions[pageName]=2;
				else 
					oldthis.user.pagePermissions[pageName]=2;
			}
			if(pageName=='invite'){
				oldthis.user.pagePermissions[pageName]=0;
				if(oldthis.user.name=="balasan"){
					oldthis.user.pagePermissions[pageName]='owner';
			}			}
			if(oldthis.user.name=="gifpumper"){
				oldthis.user.pagePermissions[pageName]='owner';
			}
			
			oldthis.now.setPagePermissions(oldthis.user.pagePermissions[pageName], owner);
			callback(null, oldthis.user.name,oldthis.user.pagePermissions[pageName]);	
		}
		else {
			console.log(err)
			callback('noPage')
			}
		
	})
}

everyone.now.logStuff = function(msg){
    console.log(msg);
}


/////////////
///ELEMENTS
//////////

everyone.now.updateElement = function(pageName, _id, property, value, all, callback){
    
   	if (this.user.pagePermissions[pageName] == undefined || this.user.pagePermissions[pageName]>1)
		return;
    oldthis = this;

	nowjs.getGroup(pageName).exclude(oldthis.user.clientId).now.updateChanges(_id,property,value);
}


everyone.now.editElement = function(pageName, _id, element, all, position, callback){
    
   	if (this.user.pagePermissions[pageName] == undefined || this.user.pagePermissions[pageName]>1)
		return;
    oldthis = this;
	
	pageModel.findOne({"pageName":pageName, "images._id":_id}, function(error, result){
		//console.log(element);		
		if(all && element.type=='image'){
			result.images.forEach(function(image){
				if(image.type=="image")
					image=element;
				});
			}
		else
		result.images.id(_id).set(element);
		
		result.save(function (error,result) {
			if(!error){
				if(position)
					nowjs.getGroup(pageName).exclude(oldthis.user.clientId).now.newImg(element);
				else
					nowjs.getGroup(pageName).now.newImg(element);
			
				}
				//console.log(images)
			else console.log(error)
		})
		if(error){console.log(error)}
	});	
}


///////
///ADD
/////

everyone.now.addNewImg = function(pageName, imgArray, scrollTop, scrollLeft,callback){

	var oldthis = this;
	if (this.user.pagePermissions[pageName]>0 && this.user.pagePermissions[pageName]!='owner'){
			callback("this page is private, you can't add images")
			return;	
		}

	var imgs=[]
	for(var i=0; i<imgArray.length; i++){
		
		if(imgArray[i].type=='image' && !isUrl(imgArray[i].url)){
			callback("invalid image url")
			continue;
		}
		imgArray[i].user = this.user.name;
		imgs.push(new imageModel(imgArray[i]));
	}
	console.log(imgs);
	
	//TODO: real update feed?
	pageModel.update({"pageName":pageName}, {$pushAll: {"images" : imgs}}, function (err,result) {
		if (!err){
			var notify = {};//new notifyModel();
			notify.user = oldthis.user.name;
			notify.action = 'update'
			notify.page = pageName;
			nowjs.getGroup(pageName).now.newImg(imgs);
			//nowjs.getGroup('main').now.notify([notify],null, true)		
			everyone.now.notify([notify],null, true)		

		}
		else console.log(err)
	})
	

};

everyone.now.updateUserPic = function(username, url,callback){

	oldthis=this;
	if(username!=this.user.name){
		callback("error")
		return;
	}
	else{
		userModel.update({'username':username},{$set:{userImage:url}},function(error){
			if(!error) {callback()
				everyone.now.updateUsrImg(username,url)
			}
		})	
	}
}



//////////
///DELETE
////////

everyone.now.deleteImage=function(pageName,imgId, all,callback){

	if (this.user.pagePermissions[pageName]>0 && this.user.pagePermissions[pageName]!='owner'){
		callback("this page is private, you can't delete images")
		return;
	}

	if(all){
		pageModel.findOne({"pageName":pageName}, function(error, result){
			result.images=[];
			result.save(function (error) {
				if(!error)
			  		nowjs.getGroup(pageName).now.deleteResponce(imgId, all);	
				});
			});				
	}
	else{
		pageModel.findOne({"pageName":pageName}, function(error, result){
			
			if(result.images.id(imgId) == undefined)
		  		nowjs.getGroup(pageName).now.deleteResponce(imgId, all);
		  	else{	
				result.images.id(imgId).remove();
				result.save(function (error) {
				if(!error)
			  		nowjs.getGroup(pageName).now.deleteResponce(imgId, all);	
				});
			}
		});				
	}
}


/////////////
//BACKGROUND
///////////

everyone.now.setBackground=function(pageName, type, background,callback){

	//TODO: tweak this
	pageName=this.user.currentPage;
	if (this.user.pagePermissions[pageName] == undefined || this.user.pagePermissions[pageName]>0 && this.user.pagePermissions[pageName]!='owner'){
		callback("this page is private, you can't edit background")
		return;
	}	
	if(type=="backgroundImage"){
		//var background = 'url('+background+')';
		pageModel.update({"pageName":pageName},{$set: {backgroundImage:background}}, function(err){
			if(!err)
				nowjs.getGroup(pageName).now.backgroundResponce(type, background);
			else console.log(err)
		});
	}
	else if(type=="background"){
		pageModel.update({"pageName":pageName},{$set: {background:background}}, function(err){
			if(!err)
				nowjs.getGroup(pageName).now.backgroundResponce(type, background);
			else console.log(err)
		});
	}
	else if(type=="display"){
		pageModel.update({"pageName":pageName},{$set: {bgDisplay:background}}, function(err){
			if(!err)
				nowjs.getGroup(pageName).now.backgroundResponce(type, background);
			else console.log(err)
		});
	}
}

everyone.now.setProfileBackground = function(userProfile, type, background,callback){

	var pageName = "profile___"+userProfile;
	
	if (this.user.pagePermissions[pageName] == undefined || this.user.pagePermissions[pageName]>0 && this.user.pagePermissions[pageName]!='owner'){
		
		console.log(this.user.pagePermissions[pageName])
		return;
		
		}
		
	if(type=="backgroundImage"){
		var background = 'url('+background+')';
		userModel.update({"username":userProfile},{$set: {backgroundImage:background}}, function(err){
			if(!err)
				callback()
				//pagesGroup[pageName].now.backgroundResponce(type, background);
			else console.log(err)
		});
	}
	if(type=="background"){
		userModel.update({"username":userProfile},{$set: {background:background}}, function(err){
			if(!err)
				callback()
				//pagesGroup[pageName].now.backgroundResponce(type, background);
			else console.log(err)
		});
	}
	else if(type=="display"){
		userModel.update({"username":userProfile},{$set: {bgDisplay:background}}, function(err){
			if(!err){
				console.log(background)
				callback()
				}
			else console.log(err)
		});
	}

}


///////////
//ADD USER
/////////

function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 13;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}


//TODO: get rid of this or change to ADD USER


everyone.now.updateUsers = function(users, callback){
	
	for(var i in users){	

		var user = new RegExp("^"+users[i].username+"$",'i');
		userModel.find({username: user}, { username : 1 },function(error,result){
			if(result[0]==undefined){
				console.log(result)
				users[i].salt = randomString();
				users[i].password = hash(users[i].password, users[i].salt);
				var user={}		
				user[i] = new userModel(users[i]);    		
				user[i].save(function (err) {	    
		    		if(err){ callback("there was an error, most likely the username you chose has already been taken");
		    		console.log(err)}
		    		else callback(null);
		    		})
	    	}
	    	else{	    	
	    		callback("there was an error, most likely the username you chose has already been taken");
	    	}
	    });
	}
}

///////////
///PRIVACY
/////////


everyone.now.setPrivacy = function(pageName, privacy,editors,_2d,callback){

	if(_2d)
		var d2d=true;
	else
		var d2d=false;
		
	if (this.user.pagePermissions[pageName] !='owner')
		return;
	pageModel.update({"pageName":pageName},{$set :{"privacy":privacy,editors:editors,d2d:d2d}}, function(err){
		if(err)	callback(err);
		else{
			callback(null);
			nowjs.getGroup(pageName).now.pagePrivacy(privacy,d2d);
		}
	})
};

////////////////////
///ADD_DELETE PAGES
//////////////////


everyone.now.addPage = function(pageName, copyPageName,callback){

	var oldthis1=this;
	var name = this.user.name;
	if (this.user.name == 'n00b'){
		callback("please log in to create page");
		return;
	}
	var pageInit={};
	if (copyPageName != undefined){
		pageModel.findOne({pageName:copyPageName}, { _id : 0,likesN:0,likes:0},function(err,result){
			if(!err){
				pageInit = result;
				pageInit.pageName = pageName;
				pageInit.owner = oldthis1.user.name;
				pageInit.privacy = 0;
				pageInit.text=[];
				pageInit.versions=[];
			 	pageInit.children=[];
				pageInit.parent = result.pageName;
				pageInit.likes = [];
				
				var newPage =new pageModel(pageInit);
				newPage.save(function (error,result) {
					if(!error){
					    notifyUsers([],result.owner,oldthis1.user.name,oldthis.user.image,'new',pageName);	
						callback(null, pageName);
					}
					else callback(error);
				});
			}
		})
	}
	else{
		var checkPage = new RegExp("^"+pageName+"$",'i')
		pageModel.findOne({pageName:checkPage}, { _id : 0 },function(err1,result1){
			if(!err1 && result1==undefined){
			
				pageInit.pageName = pageName;
				var name = oldthis1.user.name;
				pageInit.owner = name;
				pageInit.privacy = 0;
				var newPage = new pageModel(pageInit);
				//console.log(newPage)
	
				newPage.save(function (error,result) {
					if(!error){
					    notifyUsers([],result.owner,oldthis1.user.name,oldthis.user.image,'new',pageName);	
						everyone.now.updateMain()						
						callback(null, pageName);
						}
					else callback(error,null);
				});
			}
			else if(result1!=undefined){
				callback("name already taken, try a different one",null);
			}
		})
	}		
}

everyone.now.deletePage = function(pageName,callback){

	if (this.user.pagePermissions[pageName] != 'owner'){
		callback("you don't have permission do delete this page");
		return;
		}
	
	pageModel.remove({pageName:pageName},function(error){
		if(!error){
			callback(null);
			everyone.now.updateMain()
			pageModel.update({pageName:'main'},{$pullAll : {notify:{page:pageName}}},function(err){
				if(err) console.log(err)
				})
			}
		else callback(error);
		});




		


}

///////////////
//////TXT/////
/////////////

everyone.now.submitComment = function(pageName,textObject, userProfile){

	//pageName=this.user.currentPage;
	if(this.user.name=='n00b' && pageName!='invite')
		return;
		
	var oldthis = this;	
	//TODO: permissions
	var groupName=pageName;
	
	var txt= new textSchema(textObject);
	txt.user = this.user.name;
	txt.text = textObject.text;
		
	var thereIsError=false;
	if(pageName=="profile"){
		groupName = "profile___"+userProfile;
		userModel.update({"username":userProfile}, {$push: {"text" : txt}}, function (err) {
				//console.log("This is groupName %", groupName);
		  if (err) console.log(err)
		  else{
			notifyUsers([],userProfile,oldthis.user.name,oldthis.user.image,'msg','');	
			nowjs.getGroup(groupName).now.updateText(oldthis.user.name,txt.text);
			}
		});

	}
	else{ 
		//nowjs.getGroup(pageName).now.updateText(this.user.name,textObject.text);
		pageModel.update({"pageName":pageName}, {$push: {"text" : txt}}, function (err) {
			if (err) console.log(err)
			else
				nowjs.getGroup(pageName).now.updateText(oldthis.user.name,txt.text);
			});
	}
}

	

everyone.now.findUser = function(userTxt, callback){

	var user = new RegExp("^"+userTxt,'i');
	userModel.find({username: user}, { username : 1 },function(error,result){
		if(!error){
				callback(result);
				
				}
		else console.log(error)
	});
}

everyone.now.findPage = function(page, callback){

	var user = new RegExp("^"+page,'i');
	pageModel.find({pageName: page}, { pageName : 1 },function(error,result){
		if(!error){
				callback(result);
				}
		else console.log(error)
	});
}


///////////////////////////
///////////VERSIONS
/////////////////////////


//TODO save local change instead of db query?
everyone.now.saveVersion = function(callback){

	oldthis=this;
	var pageName = this.user.currentPage;
	if (this.user.pagePermissions[pageName] !='owner' && this.user.pagePermissions[pageName] != 0)
		return;
		
	pageModel.findOne({pageName:pageName},{versions:0,children:0,_id:0,parent:0,privacy:0,lastId:0,text:0,likesN:0,likes:0},function(error,result){
		if(!error){
			var newVersion ={}
			newVersion = result;
			var savedVersion = result.currentVersion;
			//delete result.currentVersion;
			
			var version = new versionModel(newVersion);
			//version.images=[];
			//console.log(version);

			pageModel.update({"pageName":pageName}, {$push: {"versions" : version}, $inc:{currentVersion:1}}, function (err) {			
				//console.log(savedVersion)
				if(err)
					callback(err,null)
				else{
					callback(null,savedVersion)
					nowjs.getGroup(pageName).now.updateVersion(savedVersion);
					notifyUsers(result.images,result.owner,oldthis.user.name,oldthis.user.image,'version',pageName,savedVersion);	

					}
				})
		}
		else console.log(error)
	})
}

everyone.now.deletePageVersion = function(id,callback){

	oldthis=this;
	var pageName = this.user.currentPage;
	if (this.user.pagePermissions[pageName] !='owner')
		return;

	//pageModel.update({pageName:pageName},{$pull : {"versions._id":id}, $inc:{currentVersion:-1}},function(error){
	
	pageModel.findOne({"pageName":pageName}, function(error, result){
		if(!error){

			//console.log(result)
			
			var dVersion = result.versions.id(id).currentVersion;
			console.log(dVersion);
			
			result.versions.id(id).remove();
	
			if(result.versions.id(id) != undefined)
								
				result.versions.id(id).remove();
				console.log(result);
				result.currentVersion--;
				
				if(result.currentVersion<0)
					result.currentVersion=0;
				result.save(function (error) {
					if(!error){
					  	nowjs.getGroup(pageName).exclude(oldthis.user.clientId).now.updateVersion(dVersion,true);
						callback(null)
						}
					else{
						callback(error)
						console.log(error)
					}
			})
		}
		else
			callback(error)
	})
}

////////////
///LIKE
////////

everyone.now.likePage = function(action, version, callback){

	var oldthis = this;
	if(this.user.name=='n00b'){
		callback("you must be registered to do this!")
		return;
	}
	var pageName = this.user.currentPage;
	if(action=='like'){
		if(version == undefined)
			var ver = 0;
		else{
			var ver = {};
			ver['$slice']=[version, 1];
			}

		if(version==undefined){
			pageModel.findOne({pageName:pageName, likes:{$nin:[this.user.name]}},{privacy:1,likes:1,likesN:1,owner:1,'images.user':1},function(err,result){
			
				if(!err && result != null){
					pageModel.update({pageName:pageName},{$addToSet : {likes:oldthis.user.name},$inc:{likesN:1}},function(err){
						if(err) console.log(err)
					})	
					callback(null)
						notifyUsers(result.images,result.owner,oldthis.user.name,oldthis.user.image,'like',pageName);							everyone.now.updateMain()
					
				}
				else callback(err)
				
			})
		}
		
		if(version!=undefined){
		
			var query = {}
			query['versions.'+version+'.likes']={$nin:[this.user.name]};
			query['pageName']=pageName;
			pageModel.findOne(query,{likes:1,likesN:1,owner:1,versions:ver,privacy:1},function(err,result){
			
				if(!err && result != null){
					pageModel.update({pageName:pageName,'versions.currentVersion':version},{$addToSet : {'versions.$.likes':oldthis.user.name},$inc:{likesN:1,'versions.$.likesN':1}},function(err){
						if(err) console.log(err)
					})	
					
					callback(null)
					notifyUsers(result.versions[0].images,result.owner,oldthis.user.name,oldthis.user.image,'like',pageName,version);
					everyone.now.updateMain()
				}
				else callback(err)
			})
		}					
	}
	else if (action=='unlike'){
		if(version==undefined)
			pageModel.update({pageName:pageName},{$pull:{likes:this.user.name},$inc:{likesN:-1}},function(err){
					if(!err)
					callback(null)
				else callback(err)
			})
		else {
			var pullObj = {}
			pullObj['versions.'+version+'.likes']=this.user.name;
			var pullObj2 = {}
			pullObj2['versions.'+version+'.likesN']=-1;
			//console.log(pullObj2);
			
			pageModel.update({pageName:pageName, 'versions.currentVersion':version},{$pull:{'versions.$.likes':this.user.name},$inc:{'versions.$.likesN':-1,likesN:-1}},function(err){
					if(!err){
						//everyone.now.updateMain()
						callback(null)
						}
					else callback(err)
				})
			}
		}
}


var lastNotify={}
notifyUsers = function(images,_owner,user,image,action,pageName,version){
	
	var notify = new notifyModel();
	notify.user = user;
	notify.action = action;
	notify.page = pageName;
	notify.img = image;
	if(version!=undefined){
		notify.version = version;
	}	

	if(action!='msg' && (lastNotify!={} || lastNotify.user!=notify.user || lastNotify.page!=notify.page || lastNotify.action!=notify.action || lastNotify.version!=notify.version)){		
		pageModel.update({pageName:'main'},{$push:{notify:notify}},function(err){
			if(err) console.log(err);
/*
			else pageModel.update({pageName:'main'},{$pop:{notify : -1}},function(err2){
				if(err2) console.log(err);
				})
*/
		})
	 	everyone.now.notify([notify],undefined, true)	
	}
	//console.log(lastNotify)
	lastNotify=notify;
	
	var contributors={}
	for (var i=0;i<=images.length;i++){
	
		var owner;
		if(i==images.length)
			owner = _owner;
		else
			owner = images[i].user

		if(user==owner)
			continue;
	
		if(owner==undefined || contributors[owner]!=undefined)
			continue;
		else contributors[owner]=1;
			
		userModel.findOne({username:owner},{notify:1,nowId:1,newNotify:1},function(err,result2){
		if(!err){
			var nowId = result2.nowId;

			if(result2.notify == undefined)
				result2.notify=[];
				
			result2.notify.push(notify);
			if(nowId){
				nowjs.getClient(nowId, function() { 
					if(this.user!=undefined){
						//console.log(notify)
						this.now.notify([notify])
					}
				}); 
			}
			else result2.newNotify++;	
				result2.save(function(err){
					if(err) console.log(err)
				})
			}
		})
	}
}

everyone.now.trimAll = function(){

	pageModel.find({},{pageName:1},function(err, result){
	
		if(!err){
			for(var i=0; i<result.length;i++){
			
				console.log(result[i].pageName)
				
				var newPageName = trim1(result[i].pageName)
				
				if(newPageName==""){
					newPageName="_";
					console.log("_")
					}
				
				//console.log('!!!! ' + newPageName)


				if(result[i].pageName!=newPageName){
					
					pageModel.update({pageName:result[i].pageName},{$set:{pageName:newPageName}},function(err){
						if(err)
							console.log(err)
					})
					
					console.log('!!!! ' + newPageName)
							
				}

					

			
			}
		}
	});

}

function trim1 (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);