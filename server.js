//mongodb commands: http://howtonode.org/node-js-and-mongodb-getting-started-with-mongojs
//http://docs.mongodb.org/manual/reference/mongo-shell/

//Configure routing, and break this app.js in different node routes
//http://expressjs.com/guide/routing.html

//Routing help: https://codeforgeek.com/2015/05/expressjs-router-tutorial/
//See at the bottom

//References: https://github.com/mafintosh/mongojs
//Node.js and MongoLab on Windows Azure: http://blog.mongolab.com/2013/02/node-js-and-mongolab-on-windows-azure/

var express = require('express');
var app = express();
var mongojs = require('mongojs');
var collections = ['Persons']

databaseURI = process.env.PERSON_MONGOLAB_CONNECTION;
//localDatabaseURI = "mongodb://MongoLab-3:ojLtYaTSeM.6Ywk2BDxCO8.qq1KpeyMMLklH4_mVg2s-@ds048368.mongolab.com:48368/MongoLab-3";
//localDatabaseURI = "localhost:27017/AddressBook";

var databaseURI = process.env.PERSON_MONGOLAB_CONNECTION || localDatabaseURI;
console.log("DB URI Set as : " + databaseURI);

var db = mongojs(databaseURI, collections, {authMechanism: 'ScramSHA1'});

var bodyParser = require('body-parser');

app.use(express.static(__dirname));
app.use(bodyParser.json());

//CORS on ExpressJS: http://enable-cors.org/server_expressjs.html
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://addressbookclient.azurewebsites.net');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
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

//app.listen(3000);
//console.log("server running on port 3000");
