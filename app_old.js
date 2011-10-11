/**
 * Module dependencies.
 */

var express = require('express');

var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;
//var ArticleProvider = require('./articleprovider-memory').ArticleProvider;


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var articleProvider = new ArticleProvider('localhost', 27017);
// Routes

var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/gifpumper');

mongoose.connect('localhost','gifpumper',27017)

var Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

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
	opacity : Number
	
});
	
var pageSchema = new Schema({
    pageName    : String
  , owner 		: Number
  , images      : [imageSchema]
  , lastId      : Number
  , privacy		: Number
  , backgroundImageType : Number
  ,	pageNumber 	: Number
  ,	background 	: String
  ,	backgroundImage: String
  , text : []
});



var pageModel = mongoose.model('pageModel', pageSchema);
var imageModel = mongoose.model('imageModel', imageSchema);


app.get('/', function(req, res){
        res.render('index.jade');
});


/*
app.get('/blog/new', function(req, res) {
    res.render('blog_new.jade', { locals: {
        title: 'New Post'
    }
    });
});

app.post('/blog/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.get('/blog/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('blog_show.jade',
        { locals: {
            title: article.title,
            article:article
        }
        });
    });
});

app.get('/update', function(req, res) {
    articleProvider.findByPageName(req.param('pageName'), function(error, page) {
		res.contentType('text');
      	res.send(page);
    });
});

app.post('/blog/addComment', function(req, res) {
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/blog/' + req.param('_id'))
       });
});

app.post('/blog/addComment', function(req, res) {
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/blog/' + req.param('_id'))
       });
});

app.post('/update', function(req, res){
    articleProvider.save1({
        reqType: req.param('reqType'),
        pageName: req.param('pageName'),
        pageData: req.param('pageData')
    }, function( error, docs) {
		res.contentType('json');
      	res.send(docs);
 		//res.redirect('/')
    });
});
*/

app.get('/:page', function(req,res) {
	res.render('index.jade');
});

app.listen(80);
var everyone = require("now").initialize(app);

var primaryKey=0;

everyone.connected(function(){
		this.now.uuid = ++primaryKey;
	}
);

everyone.now.logStuff = function(msg){
    console.log(msg);
}

everyone.now.updateAll = function(pageData,callback){
	pageModel.update({pageName:pageData.pageName}, pageData,{upsert:true,multi:false}, function(error) {
      		if(error) console.log(error)
      		else
				pageModel.findOne({pageName:pageData.pageName}, function(error, result){
					callback(result)
				});
    });


/*
	pageModel.save(function (err) {
  		if (!err) console.log('Success!');
	});
*/

    //console.log('done!!!');
	
/*
    oldthis = this;
    articleProvider.getCollection('pages', function(error, article_collection) {
    	if( error ) callback(error)
		else
    	article_collection.update({pageName:pageData.pageName}, pageData,{upsert:true,multi:false}, function() {
      		callback(null, 'done');
    	});
    });
*/
}


everyone.now.updateElement = function(pageName, _id, property, value, all, callback){
    
    oldthis = this;

	var n = "images."+"$"+"."+property;
	var index = {};                
	index[n] = value;

	pageModel.findOne({"pageName":pageName}, function(error, result){
		
		if(all){
			result.images.forEach(function(image){
				image[property]=value;
				});
			}
		else
			result.images.id(_id)[property]=value;
		
		result.save(function (error,result) {
		if(!error)
			if(all)
				pagesGroup[pageName].now.pushChanges(result);
				//pagesGroup[pageName].exclude(oldthis.user.clientId).now.updateChanges(_id,property,value);
			else if(property == 'url')
				pagesGroup[pageName].now.updateChanges(_id,property,value);
			else
				pagesGroup[pageName].exclude(oldthis.user.clientId).now.updateChanges(_id,property,value);
		});
	});	

/*
    articleProvider.getCollection('pages', function(error, article_collection) {
		if( error ) callback(error)
		else{
			var n = "images."+"$"+"."+property;
			var index = {};                
			index[n] = value;
			var id1 = parseInt(id);
	    	article_collection.update({"pageName":pageName, "images.id":id1}, {$set : index}, function() {
  				callback(null, 'done');
  				pagesGroup[pageName].exclude(oldthis.user.clientId).now.updateChanges(id,property,value);
	  			//everyone.now.filterUpdateBroadcast( oldthis.now.uuid, id1, property,value );
				//console.log(oldthis.now.uuid);
    		});
    		}
    });
*/
}

var pagesGroup = {};

everyone.now.setUserPage = function(pageName){

	if(pagesGroup[pageName] == undefined)
		pagesGroup[pageName]=require("now").getGroup(pageName);
		//console.log(pages[pageName]);
	pagesGroup[pageName].addUser(this.user.clientId);

}

everyone.now.filterUpdateBroadcast = function(ownerUuid, id, property,value ){
    	
    	if(this.now.uuid == ownerUuid){
    		return;
    	}    	
    	this.now.updateChanges(id,property,value);
}


everyone.now.loadAll = function(pageName, callback){
	
	pageModel.findOne({'pageName': pageName}, function(error, result) {
          if( error ) callback(null, error)
          else callback(result)
      	});
	
/*
	articleProvider.getCollection('pages',function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.findOne({'pageName': pageName}, function(error, result) {
          if( error ) callback(null, error)
          else callback(result)
        });
      }
    });
*/

}

everyone.now.addNewImg = function(pageName, imgUrl, number, scrollTop, scrollLeft){

	for(var i=0; i<number; i++){
	
		var img= new imageModel();
		img.url = imgUrl;
		img.height="auto";
		img.width="auto";
		img.top = Math.random()*500 + scrollTop+"px";
		img.left = Math.random()*900 + scrollLeft+"px";
		img.z = Math.random()*50;
		img.angler=0;
		img.angley=0;
		img.anglex=0;

		pageModel.update({"pageName":pageName}, {$push: {"images" : img}}, function (err,result) {
		  if (!err){} 
			//pagesGroup[pageName].now.newImg(img);
		});
		pagesGroup[pageName].now.newImg(img);

	}


/*
	articleProvider.getCollection('pages',function(error, pages) {
	      if( error ) callback(error)
	      else {
	      
          	pages.findAndModify({'pageName': pageName}, [], {$inc: {lastId: number}} ,{},function(error, result) {	
          		
          		if( error ) console.log(error)
       			else{
       			
       				for(var i=0; i<number; i++){
						var lastId = result.lastId+i;
						var img={};
						img.url = imgUrl;
						img.height="auto";
						img.width="auto";
						img.top = Math.random()*500 + scrollTop+"px";
						img.left = Math.random()*900 + scrollLeft+"px";
						img.z = 0;
						img.angler=0;
						img.angley=0;
						img.anglex=0;
						img.id = "img"+lastId;
						var images = {};
						images["img"+lastId]=img;
						
				    	pages.update({"pageName":pageName}, {$set: images}, function(error) {
			  				if( error ) console.log(error)
			  				else{
			  					pagesGroup[pageName].now.newImg(img);
			  				}
						});
					}
				};	
			})
		}
	});
*/
};

everyone.now.deleteImage=function(pageName,imgId, all){

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
			result.images.id(imgId).remove();
			result.save(function (error) {
			if(!error)
		  		pagesGroup[pageName].now.deleteResponce(imgId, all);	
			});
		});				
	}
}

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);