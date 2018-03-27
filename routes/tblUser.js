var mysql = require('mysql');
var bcrypt = require('bcryptjs');
const saltRounds = 10;
//const myPlaintextPassword = 's0/\/\P4$$w0rD';
//const someOtherPlaintextPassword = 'not_bacon';
var connection = mysql.createPool({
    host: 'bgabgb3vi-mysql.services.clever-cloud.com',
    user: 'uawpqbdrl3llqjpt',
    password: 'Dlff4WOTqvDqpTfu3a5',
	database: "bgabgb3vi"
});
module.exports = function(app){
	app.post("/tblUser",function(req,res){
		var postBody = req.body;
		var id = postBody.id;
		var nama = postBody.nama;
		var passwords = postBody.pass;
		
		bcrypt.genSalt(saltRounds, function(err, salt) {
			bcrypt.hash(passwords, salt, function(err, hash) {
				var sql = "INSERT INTO tbluser(kdUser,nmUser, password) VALUES ('"+ id +"','" + nama + "','"+ hash +"')";
				var sql2 = "SELECT kdUser, nmUser, password FROM tbluser WHERE kdUser = '"+id+"'";
				connection.query(sql,function(err,rows){
					if(rows.affectedRows)
					{
						connection.query(sql2,function(err,rows){
							if(!err && rows.length > 0) 
							{
								res.json(rows[0]);
							} 
							else{
								res.json(err);
							}
						});
						connection.end();
					}
					else{
						res.json(err);
					}
				});
				connection.end();
			});
		});
		
		
	});
	app.get("/tblUser",function(req,res){
		var sql = "SELECT kdUser, nmUser, password FROM tbluser";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				res.json(rows);
			} 
			else{
				res.json(err);
			}
		});
		connection.end();
	});
	app.get("/tblUser/:id",function(req,res){
		var id = req.params.id;
		var sql = "SELECT kdUser, nmUser, password FROM tbluser WHERE kdUser = '"+ id +"'";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				res.json(rows);
			} 
			else{
				res.json(err);
			}
		});
		connection.end();
	});
	app.post("/tblUser/login",function(req,res){
		var postBody = req.body;
		var id = postBody.id;
		var passwords = postBody.pass;
		var sql = "SELECT kdUser, nmUser, password FROM tbluser WHERE kdUser = '"+id+"'";
		
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				//res.json(rows[0]['password']);
				//res.json(rows[0]);
				bcrypt.compare(passwords, rows[0]['password']).then(function(ress) {
					if(ress)
					{
						connection.query(sql,function(err,rows){
							if(!err && rows.length > 0) 
							{
								res.json(rows[0]);
							} 
							else{
								res.json(err);
							}
						});
						//res.json(ress);
						connection.end();
					}
					else{
						res.json([]);
						//console.log(ress);
					}
					
				});
			} 
			else{
				res.json(err);
			}
		});
		connection.end();
	});
	app.post("/tblUser/ChangePassword",function(req,res){
		var postBody = req.body;
		var id = postBody.id;
		var PassLama = postBody.pass;
		var PassBaru = postBody.passBaru;
		var sql = "SELECT kdUser, nmUser, password FROM tbluser WHERE kdUser = '"+id+"'";
		
		
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				
				bcrypt.compare(PassLama, rows[0]['password']).then(function(ress) {
					if(ress)
					{
						bcrypt.genSalt(saltRounds, function(err, salt) {
							bcrypt.hash(PassBaru, salt, function(err, hash) {
								
								var sql2 = "UPDATE tbluser SET password = '"+ hash +"' WHERE kdUser = '"+id+"'";
								connection.query(sql2,function(err,rows){
									if(rows.affectedRows)
									{
										connection.query(sql,function(err,rows){
											if(!err && rows.length > 0) 
											{
												res.json(rows[0]);
											} 
											else{
												res.json(err);
											}
										});
									}
									else{
										res.json(err);
									}
								});
								connection.end();
							});
						});
						
						
					}
					else{
						res.json(null);
						//console.log(ress);
					}
					
				});
			} 
			else{
				res.json(err);
			}
		});
		connection.end();
	});
	app.post("/tblUser/UpdateNama",function(req,res){
		var postBody = req.body;
		var id = postBody.id;
		var Nama = postBody.nama;
		var sql = "SELECT kdUser, nmUser, password FROM tbluser WHERE kdUser = '"+id+"'";
		var sql2 = "UPDATE tbluser SET nmUser = '"+Nama+"' WHERE kdUser = '"+id+"'";
		
		connection.query(sql2,function(err,rows){
			if(rows.affectedRows) 
			{
				connection.query(sql,function(err,rows){
					if(!err && rows.length > 0) 
					{
						res.json(rows[0]);
					} 
					else{
						res.json(err);
					}
				});
			} 
			else{
				res.json(err);
			}
		});
		connection.end();
	});
	//connection.end();
}