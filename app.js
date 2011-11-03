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


MemoryStore = express.session.MemoryStore,
sessionStore = new MemoryStore();


//TODO:change cookie settings to the right domain
var app = module.exports = express.createServer(    
	express.bodyParser()
  , express.cookieParser()
  , express.session({store: sessionStore, secret: 'something sweet', cookie: {path:'/',domain:"gifpumper.net", expires: false 
}}));
// Configuration

app.configure(function(){

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use('/public', express.static(__dirname + '/public'));
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
	url : String,
	backgroundColor : String,
	backgroundImage : String,
	backgroundType : String,	
	content : String,
	contentType : String,
	opacity : Number,
	user : String
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
});

var userSchema = new Schema({
	  username : {type :String,  unique: true }
	, salt : {type: String}
	, password : Buffer
	, email : String 
	, pages: []
	, contributedTo : []
	, favoritePages : []
	, favoriteUsers : []
	, text 		: [textSchema]
	, likes: []
	, userImage: {type:String, default:""}
	, backgroundImage : String
	, background : String
	, info : String
});

//var profilePageSchema = new Schema({


var textSchema = new Schema({
	  user : String
	, text : String
	, time : { type: Date, default: Date.now }
	, at : []
	, hash : []
});



function hash(msg, key) {
  return crypto.createHmac('sha256', key).update(msg).digest('hex');
}



var pageModel = mongoose.model('pageModel', pageSchema);
var imageModel = mongoose.model('imageModel', imageSchema);
var userModel = mongoose.model('userModel', userSchema);
var textSchema = mongoose.model('textModel', textSchema);
var versionModel = mongoose.model('versionModel', versionSchema);

//var divSchema = mongoose.model('divModel', divSchema);


///////
//GETS
/////

app.get('/', function(req, res){

	var loggedIn = false;
	var user = 'not logged in';	
	var owner= false;
	var privacy=null;

	if (req.session.user) {
		loggedIn = true;
		user = req.session.user.username;
		
		//TODO default page
				
		pageModel.findOne({'pageName':'main'},{privacy:true, owner:true},function(err, result){
			if(!err){
				var owner=false;
				if(result.owner == req.session.user.username){
					owner=true;
				}
				var privacy=result.privacy;
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




app.get("/:page/:version?", function(req,res) {

	if(req.params.page == "javascripts" || req.params.page == "stylesheets")
		return;
	//req.params.page = req.params[0];
	//console.log(req.params.page);
	//console.log(req.params.version);

	if(req.params.page!='favicon.ico'){
		var loggedIn = false;
		var user = 'not logged in';	
		var owner= false;
		var privacy=null;

		if (req.session.user) {
			loggedIn = true;
			user = req.session.user.username;
					pageModel.findOne({'pageName':req.params.page},{privacy:true, owner:true},function(err, result){
			if(!err && result != undefined){
				var owner=false;
				if(result.owner == req.session.user.username){
					owner=true;
				}
				var privacy=result.privacy;
				//oldthis.now.setPagePermissions(oldthis.user.pagePermissions[pageName], owner)
			}
			//else(console.log(err))
		
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

app.get(/^\/profile?(?:\/(\d+)(?:\.\.(\d+))?)?/, function(req,res) {
	req.params.user=req.params[0];
	if(req.params.user!='favicon.ico'){
		var loggedIn = false;
		var user = 'not logged in';	
		var owner= false;
		var privacy=null;

		if (req.session.user) {
			loggedIn = true;
			user = req.session.user.username;
			
			var page = 'profile_'+req.params.user;
			
			pageModel.findOne({'pageName':page},{privacy:true, owner:true},function(err, result){
			if(!err && result != undefined){
				var owner=false;
				if(result.owner == req.session.user.username){
					owner=true;
				}
				var privacy=result.privacy;
				//oldthis.now.setPagePermissions(oldthis.user.pagePermissions[pageName], owner)
			}
			//else(console.log(err))
		
			//TODO: create new page?
			//if(result == undefined)
	       	//	res.redirect('back');
			//else
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




app.listen(80, "127.0.0.1");
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
	        req.session.user = user;
	        res.redirect('back');
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

everyone.connected(function(){

  
  	var cookie=this.user.cookie['connect.sid']
	
	cookie = parseCookie(cookie)['']
		
	var oldthis = this;
	
	sessionStore.get(cookie, function (err, session) {
            if (err) {
               console.log('something is wrong')
            } 
            else {
            	if(session == undefined || session.user == undefined)
					oldthis.user.name = 'noob'
				else {
					oldthis.user.name = session.user.username;
                	}
                console.log(oldthis.user.name + ' connected');
            }
        });	

	}
);



everyone.now.updateAll = function(pageData,callback){
	
	for(var page in pageData){
	

		
		pageModel.update({pageName:page}, pageData[page]['pageData'],{upsert:true,multi:false}, function(error) {
	      		if(error) console.log(error)
	/*
	      		else
					pageModel.findOne({pageName:pageData.pageName}, function(error, result){
						callback(result);
				});
	*/
	    });
    }
}

nowjs.on('connect', function () {
  

  

  //this.now.receiveMessage('SERVER', 'Welcome to NowJS.');
});

var pagesGroup = {};


everyone.now.loadAll = function(pageName,userProfile,version,callback){
	
	var groupName=pageName;
	if(pageName=="profile")
		groupName = "profile___"+userProfile;
	
	console.log(groupName);
		
	if ((this.user.pagePermissions[pageName] == undefined || (this.user.pagePermissions[pageName]==3) && this.user.pagePermissions[pageName]!='owner')){
		//console.log(this.user.pagePermissions[pageName])
		callback("This page is private")
		return;
	}

	if(version !=undefined)
		var sliceParam = [parseInt(version),1]
	else
		var sliceParam = -1;

	var oldthis = this;
	pageModel.findOne({'pageName': pageName},{versions:{$slice: sliceParam},text:{$slice:-20}}, function(error, result) {
          if( error ){
          	 callback(error, null)
          }
          else{
          	callback(null, result)
     		if(pagesGroup[groupName] == undefined){
				pagesGroup[groupName]=nowjs.getGroup(groupName);
				pagesGroup[groupName].pageUsers={};
				}
			pagesGroup[groupName].addUser(oldthis.user.clientId);
						
			oldthis.user.currentPage=groupName;
			
			oldthis.now.updatePageUser('add',pagesGroup[groupName].pageUsers,userProfile);
			
			userModel.findOne({username:oldthis.user.name},{userImage:1},function(err,result){
			
				if(!err && oldthis.user.name !='noob'){
					//console.log(result);
					var userObj = {}
					if(result.userImage==undefined)
						result.userImage="";
					userObj[oldthis.user.name]=result.userImage;
					//console.log(userObj);
					pagesGroup[groupName].pageUsers[oldthis.user.clientId]=userObj;
					pagesGroup[groupName].now.updatePageUser('add',[userObj]);
				
				}
				else console.log(err)
				if(oldthis.user.name=='noob'){
					var userObj = {}
					userObj={'noob':null};
					pagesGroup[groupName].pageUsers[oldthis.user.clientId]=userObj;
					pagesGroup[groupName].now.updatePageUser('add',[userObj]);
				}
				

			})
     	}
     });
}



everyone.now.leavePage = function(userProfile, callback){	

	if(this.user.currentPage != null){
	
	pagesGroup[this.user.currentPage].exclude(this.user.clientId).now.updatePageUser('delete',this.user.name,userProfile);
	
	//if(this.user.currentPage != "main" && this.user.currentPage != "profile")
	delete pagesGroup[this.user.currentPage].pageUsers[this.user.clientId];
	pagesGroup[this.user.currentPage].removeUser(this.user.clientId);


	this.user.currentPage = null;
	callback();
	}
};

nowjs.on('disconnect', function(){

	pagesGroup[this.user.currentPage].now.updatePageUser('delete',this.user.name);
	delete pagesGroup[this.user.currentPage].pageUsers[this.user.clientId];
	//pagesGroup[this.user.currentPage].removeUser(this.user.clientId);

});




///////////////
///PERMISSIONS
/////////////

everyone.now.getPagePermissions = function(pageName,userProfile,callback){

	oldthis=this;
	if(this.user.pagePermissions==undefined)
		this.user.pagePermissions={};
		

	
	pageModel.findOne({pageName:pageName}, {privacy:true, owner:true, editors:true},function(err, result){
		if(!err && result !=undefined){
			//console.log(result)
			//if(result==undefined)
			
			var owner=false;
			if(result.owner == oldthis.user.name){
				oldthis.user.pagePermissions[pageName]='owner';
				owner=true;
			}
			else oldthis.user.pagePermissions[pageName]=result.privacy;
			
			//console.log(result)
			if(result.editors!=undefined){
				for(var i=0;i<result.editors.length;i++){
					if(result.editors[i]==oldthis.user.name && !owner){
						oldthis.user.pagePermissions[pageName]=0;
					}
				}
			}
			if(oldthis.user.name=="gifpumper"){
				oldthis.user.pagePermissions[pageName]='owner';
			}
			if(pageName=="profile"){
				pageName = "profile___"+userProfile;
				if(userProfile == oldthis.user.name)
					oldthis.user.pagePermissions[pageName]='owner';
				else if(oldthis.user.name == 'noob')
					oldthis.user.pagePermissions[pageName]=3;
				else 
					oldthis.user.pagePermissions[pageName]=2;
					
			}
			
					
			oldthis.now.setPagePermissions(oldthis.user.pagePermissions[pageName], owner);
			callback(null, oldthis.user.name);	
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

	var n = "images."+"$"+"."+property;
	var index = {};                
	index[n] = value;

	pageModel.findOne({"pageName":pageName, "images._id":_id}, function(error, result){
		
		
		if(all){
			result.images.forEach(function(image){
				image[property]=value;
				});
			}
		else {
			
			if(result.images.id(_id) != undefined)
				result.images.id(_id)[property]=value;
			else{
		  		pagesGroup[pageName].now.deleteResponce(_id, false);	
			 	return; 
			 }
			}
		result.save(function (error,result) {
		if(!error)
			if(all)
				pagesGroup[pageName].now.pushChanges(result);
			else if(property == 'url')
				pagesGroup[pageName].now.updateChanges(_id,property,value);
			else
				pagesGroup[pageName].exclude(oldthis.user.clientId).now.updateChanges(_id,property,value);
		});
	});	

}


everyone.now.editElement = function(pageName, _id, element, all, callback){
    
   	if (this.user.pagePermissions[pageName] == undefined || this.user.pagePermissions[pageName]>1)
		return;
    oldthis = this;
	
	pageModel.findOne({"pageName":pageName, "images._id":_id}, function(error, result){

		console.log(element);
	
		//delete element._id;
		result.images.id(_id).set(element);
		//result.images.update({_id:_id},[element]);
		
		result.save(function (error,result) {
			if(!error){
				pagesGroup[pageName].now.newImg(element);
			
				}
				//console.log(images)
			else console.log(error)
		})

	//delete element._id;
	//console.log(element);
	//pageModel.update({"pageName":pageName, "images._id":_id},{$set : {"images.$.backgroundColor":'yellow'}},{upsert: true}, function(error){
	//pageModel.update({pageName:page}, pageData[page]['pageData'],{upsert:true,multi:false}, function(error) {
		
/*
		if(all){
			result.images.forEach(function(image){
				image[property]=value;
				});
			}
		else {
			
			if(result.images.id(_id) != undefined)
				
				result.images.id(_id).update(element);
				
				
			else{
		  		pagesGroup[pageName].now.deleteResponce(_id, false);	
			 	return; 
			 }
			}
*/
		//result.save(function (error,result) {
		if(error){console.log(error)}
/*
			if(all)
				pagesGroup[pageName].now.pushChanges(result);
			else
				pagesGroup[pageName].now.updateEditChanges(_id,result.images.id(_id),value);
*/
		//});
	});	

}


/*
everyone.now.setUserPage = function(pageName){
	if(pagesGroup[pageName] == undefined)
		pagesGroup[pageName]=require("now").getGroup(pageName);
	pagesGroup[pageName].addUser(this.user.clientId);
}
*/

///////
///ADD
/////

everyone.now.addNewImg = function(pageName, imgObj, number, scrollTop, scrollLeft){

	if (this.user.pagePermissions[pageName]>0 && this.user.pagePermissions[pageName]!='owner')
			return;

	for(var i=0; i<number; i++){
		var img= new imageModel(imgObj);

		img.user = this.user.name;
		
		var thereIsError=false;

		pageModel.update({"pageName":pageName}, {$push: {"images" : img}}, function (err,result) {
		  if (err)
		  	thereIsError=true;
		});
		if(!thereIsError)
			pagesGroup[pageName].now.newImg(img);
	}
};

everyone.now.updateUserPic = function(username, url,callback){

	if(username!=this.user.name){
		callback("error")
		return;
	}
	else{
		userModel.update({'username':username},{$set:{userImage:url}},function(error){
			if(!error) callback()
		})
	}
}

//////////
///DELETE
////////

everyone.now.deleteImage=function(pageName,imgId, all){

	if (this.user.pagePermissions[pageName]>0 && this.user.pagePermissions[pageName]!='owner')
		return;

	if(all){
		pageModel.findOne({"pageName":pageName}, function(error, result){
			result.images=[];
			result.save(function (error) {
				if(!error)
			  		pagesGroup[pageName].now.deleteResponce(imgId, all);	
				});
			});				
	}
	else{
		pageModel.findOne({"pageName":pageName}, function(error, result){
			
			if(result.images.id(imgId) == undefined)
		  		pagesGroup[pageName].now.deleteResponce(imgId, all);
		  	else{	
				result.images.id(imgId).remove();
				result.save(function (error) {
				if(!error)
			  		pagesGroup[pageName].now.deleteResponce(imgId, all);	
				});
			}
		});				
	}
}


/////////////
//BACKGROUND
///////////

everyone.now.setBackground=function(pageName, type, background){

	//TODO: tweak this
	if (this.user.pagePermissions[pageName] == undefined || this.user.pagePermissions[pageName]>0 && this.user.pagePermissions[pageName]!='owner')
		return;
		
	if(type=="backgroundImage"){
		var background = 'url('+background+')';
		pageModel.update({"pageName":pageName},{$set: {backgroundImage:background}}, function(err){
			if(!err)
				pagesGroup[pageName].now.backgroundResponce(type, background);
			else console.log(err)
		});
	}
	if(type=="background"){
		pageModel.update({"pageName":pageName},{$set: {background:background}}, function(err){
			if(!err)
				pagesGroup[pageName].now.backgroundResponce(type, background);
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
		users[i].salt = randomString();
		users[i].password = hash(users[i].password, users[i].salt);
		var user={}		
		user[i] = new userModel(users[i]);
		
/*
		var profilePage={};
		profilePage.pageName = "profile_"+users[i].username;
		profilePage.owner = users[i].username;
		profilePage.profilePage = true;
		profilePage.privacy = 2;

		tmpPage={}
		tmpPage[i] = new pageModel(profilePage)
		
		//user.set(users[i]);
		//console.log(user[i])
		//console.log(tmpPage[i])

		tmpPage[i].save(function (err) {	    
	    	if(err) console.log(err);
	    	else console.log(tmpPage[i]);
	    });
*/
	    		
		user[i].save(function (err) {	    
	    	if(err) callback("there was an error, most likely the username you chose has already been taken");
	    	else callback(null);
	    });
	}
}

///////////
///PRIVACY
/////////


everyone.now.setPrivacy = function(pageName, privacy,editors,callback){

	if (this.user.pagePermissions[pageName] !='owner')
		return;
	pageModel.update({"pageName":pageName},{$set :{"privacy":privacy,editors:editors}}, function(err){
		if(err)	callback(err);
		else{
			callback(null);
			pagesGroup[pageName].now.pagePrivacy(privacy);
		}	
	})
};

////////////////////
///ADD_DELETE PAGES
//////////////////

everyone.now.addPage = function(pageName, copyPageName,callback){

	var oldthis1=this;
	var name = this.user.name;
	if (this.user.name == 'noob'){
		callback("please log in to create page");
		return;
	}
		var pageInit={};
		if (copyPageName != undefined){
			pageModel.findOne({pageName:copyPageName}, { _id : 0 },function(err,result){
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
/*
							userModel.update({username:name}, {$push:{pages:pageName}},function(err){
								if(err) console.log(err);
							})
*/
							callback(null, pageName);
						}
						else callback(error);
					});
				}
			})
		}
		else{
			pageInit.pageName = pageName;
			var name = oldthis1.user.name;
			pageInit.owner = name;
			pageInit.privacy = 0;
			var newPage = new pageModel(pageInit);
			//console.log(newPage)

			newPage.save(function (error,result) {
				if(!error){
					callback(null, pageName);
/*
					userModel.update({username:name}, {$push : {pages:pageName}},function(err){
						if(err) console.log(err);
						})
*/
					}
				else callback(error,null);
			});
		}
		
}

everyone.now.deletePage = function(pageName,callback){

	if (this.user.pagePermissions[pageName] != 'owner'){
		callback("you don't have permission do delete this page");
		return;
		}
	
	pageModel.remove({pageName:pageName},function(error){
		if(!error)
			callback(null);
		else callback(error);
		});

}

///////////////
//////TXT/////
/////////////

everyone.now.submitComment = function(pageName,textObject, userProfile){


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
				console.log("This is groupName %", groupName);
		  if (err)
		  	thereIsError=true;

		else if(!thereIsError)
			pagesGroup[groupName].now.updateText(oldthis.user.name,txt.text);
					});

	}
		else{ 
		pagesGroup[groupName].now.updateText(this.user.name,textObject.text);
		pageModel.update({"pageName":pageName}, {$push: {"text" : txt}}, function (err,result) {
		  if (err)
		  	thereIsError=true;
		
		if(!thereIsError)
			pagesGroup[pageName].now.updateText(this.user.name,txt.text);
			});
	}
}

	

everyone.now.loadProfileInfo = function(user, callback){

	userModel.findOne({username:user}, { password : 0, salt:0 },function(error,result){
		if(!error){
				
			pageModel.find({$or :[{owner:user},{"images.user":user}]},['pageName','likes','contributors','owner'],function(error,result2){
				result.pages=result2;
				callback(result);
			})
		}		
	})	
}

everyone.now.loadMainPage = function(user, callback){

	userModel.find({}, { password : 0, salt:0 },function(error,result){
		if(!error){
			var responce = {}
			responce.users = result;	
			pageModel.find({},['pageName','likes','contributors','owner'],function(error,result2){
				responce.pages=result2;
				callback(responce);
			})
		}
	})
}

everyone.now.findUser = function(userTxt, callback){

	var user = new RegExp("^"+userTxt);
	console.log(user)
	userModel.find({username: user}, { username : 1 },function(error,result){
	//userModel.find({username: { $regex : user}}, { username : 1 },function(error,result){
		if(!error){
				console.log(result);
				callback(result);
				
				}
		else console.log(error)
	}).limit(10);
}

////////////////////
//SAVE DELETE PAGE VERSION
///////////////////


//TODO save local change instead of db query?
everyone.now.saveVersion = function(callback){

	var pageName = this.user.currentPage;
	if (this.user.pagePermissions[pageName] !='owner' && this.user.pagePermissions[pageName] != 0)
		return;
		
	pageModel.findOne({pageName:pageName},{versions:0,children:0,_id:0,parent:0,privacy:0,lastId:0},function(error,result){
		if(!error){
			var newVersion ={}
			newVersion = result;
			var savedVersion = result.currentVersion;
			//delete result.currentVersion;
			
			var version = new versionModel(newVersion);
			console.log(version);

			pageModel.update({"pageName":pageName}, {$push: {"versions" : version}, $inc:{currentVersion:1}}, function (err) {
			
				console.log(savedVersion)
				if(err)
					callback(err,null)
				else
					callback(null, savedVersion)
				})
		}
		else console.log(error)
	})
}

everyone.now.deletePageVersion = function(id,callback){

	var pageName = this.user.currentPage;
	if (this.user.pagePermissions[pageName] !='owner')
		return;

	//pageModel.update({pageName:pageName},{$pull : {"versions._id":id}, $inc:{currentVersion:-1}},function(error){
	
	pageModel.findOne({"pageName":pageName}, function(error, result){
		if(!error){

			//result.images.id(imgId).remove();
			//result.save(function (error) {
			console.log(result)
			//result.versions.id(rid)
			//console.log(result.images)
			//result.versions.id(id).set({});
			result.versions.id(id).remove();


			if(result.versions.id(id) != undefined)
								
				result.versions.id(id).remove();
				
				//console.log(result.versions)
				console.log(result);
				result.currentVersion--;
				
				if(result.currentVersion<0)
					result.currentVersion=0;
				result.save(function (error) {
					if(!error)
						callback(null)
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


console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);