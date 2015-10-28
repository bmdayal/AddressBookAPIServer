var express = require("express");
var mongojs = require('mongojs');
var collections = ['Persons']

var app = express();

//help: http://jonathanmh.com/how-to-enable-cors-in-express-js-node-js/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app.use(express.logger());
//app.use(app.router);
//app.set('views', __dirname + '/app');

//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(express.static(__dirname + '/app'));

//DB Configuration
localDatabaseURI = "mongodb://MongoLab-3:ojLtYaTSeM.6Ywk2BDxCO8.qq1KpeyMMLklH4_mVg2s-@ds048368.mongolab.com:48368/MongoLab-3";
localDBUri = "mongodb://localhost:27017/AddressBook";

var databaseURI = process.env.PERSON_MONGOLAB_CONNECTION || localDBUri;
console.log("DB URI Set as : " + databaseURI);

var db = mongojs(databaseURI, collections, {authMechanism: 'ScramSHA1'});
//End DB Configuration

app.get('/', function(request, response) {
  response.render('index.html')
});


app.get('/persons', function(req, res){
	console.log('Received find all persons request');
	
	db.Persons.find(function(err, docs){
		if(err){
			console.log(err); throw err;
		} else
		{
			console.log(docs);
			res.json(docs);
		}
	});
});

app.get('/person/:id', function(req, res){
	console.log('Received findOne person request');
	
	db.Persons.findOne({_id: new mongojs.ObjectId(req.params.id)}, function(err, docs){
		if(err){
			console.log(err); throw err;
		} else
		{
			console.log(docs);
			res.json(docs);
		}
	})
});

app.post('/addPerson', function(req, res){
	console.log(req.body);
	db.Persons.insert(req.body, function(docs){
		console.log(docs);
		res.json(docs);
	})
});

app.delete('/deletePerson/:id', function(req, res){
	console.log("Received delete one person request...");
	db.Persons.remove({_id: new mongojs.ObjectId(req.params.id)}, function(err, docs){
		console.log(docs);
		res.json(docs);
	});
});

app.put('/updatePerson', function(req, res){
	console.log("Received updatePerson request");
	db.Persons.findAndModify({query: {"_id": new mongojs.ObjectId(req.body._id)}, 
										update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}}
										}, function(err, docs){
											console.log(docs);
											res.json(docs);
										})
	});


app.get('/addresses/:id', function(req, res){
	console.log('Received findOne person addresses request');
	console.log(req.params.id);
	db.Persons.findOne({_id: new mongojs.ObjectId(req.params.id)}, function(err, docs){
		console.log(docs.addresses);
		res.json(docs);
	})
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
