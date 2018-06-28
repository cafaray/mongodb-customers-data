const express=require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')
const customer = require('./repository/customer')
const async = require('async')

const url = 'mongodb://localhost:27017/'
const args = process.argv.slice(2)
const limite = 1000/args
console.log("limite: ", limite)

let app=express()
app.use(logger('dev'))
app.use(bodyParser.json())

// integrate json files:
//var customers = customer.integrate(0, limite)
//console.log(customers)

var packs = []
for (var x=0;x<limite;x++){
	from = x*args
	to = (x+1)*args	
	console.log('from: ' + from)
	packs.push(customer.integrate(from, to))			
}

mongodb.MongoClient.connect(url, (err, client)=>{	
	if (err) {
		console.log(err)
		return process.exit(1)
	}
	var db = client.db('edx-course-customers')	
	console.log('ready the database, go for the data ...')
	const collection = db.collection('customer');
	console.log('ready the collection, working with data ...')
	async.map(packs, function(pack, callback){
		collection.insertMany(pack, (error, result)=>{
			if (error){ 
				console.log(error)
				return process.exit(1)
			}
			console.log('Records stored: '+result.result.n)
			callback(null)
		})
	}, function done(error, results){
		if (error){
			throw error
		}
		console.log('Have finished :)')
	})
	client.close()
})

app.listen(3000)
