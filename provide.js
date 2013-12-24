var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


teacherProvider = function (host, port) {
	this.db = new Db('node-mongo-teacher', new Server (host, port, {safe: false}, {auto_reconnect: true}, {}));
	this.db.open(function(){});
}

teacherProvider.prototype.getCollection = function (callcack) {
	this.db.collection('teachers', function (error, teacher_collection) {
		if (error) callcack(error);
		else callcack(null, teacher_collection);
	});
}

//find all

teacherProvider.prototype.findAll = function (callcack) {
	this.getCollection(function (error, teacher_collection) {
		if (error) callcack(error);
		else {
			teacher_collection.find().toArray(function (error, results) {
				if (error) callcack(error);
				else callcack(null, results);
			});
		}
	});
}

//save new teacher
teacherProvider.prototype.save = function (teachers, callcack) {
	this.getCollection(function (error, teacher_collection) {
		if (error) callcack(error);
		else {
			if(typeof(teachers.length) === "undefined") {
				teachers = [teachers];
				for(var i = 0; i < teachers.length; i++){
					teachers = teachers[i];
					teachers.created_at = new Date();
				}
				teacher_collection.insert(teachers, function () {
					callcack(null, teachers);
				});
			}
		}
	});
}

exports.teacherProvider = teacherProvider;