var mysql = require('mysql');
//var bcrypt = require('bcrypt');
//const saltRounds = 10;
var data = {};

var connection = mysql.createPool({
    host: 'bgabgb3vi-mysql.services.clever-cloud.com',
    user: 'uawpqbdrl3llqjpt',
    password: 'Dlff4WOTqvDqpTfu3a5',
	database: "bgabgb3vi"
});
module.exports = function(app){
	app.post("/tblAkun",function(req,res){
		var postBody = req.body;
		var nmAkun = postBody.nmAkun;
		var TipeAkun = postBody.TipeAkun;
		var kdUser = postBody.id;
		
		var sql = "INSERT INTO tblakun(nmAkun, TipeAkun,kdUser) VALUES ('" + nmAkun + "','"+ TipeAkun +"','"+ kdUser +"')";
		
		connection.query(sql,function(err,rows){
			if(rows.affectedRows)
			{
				var sql2 = "SELECT kdAkun, nmAkun, kdUser, TipeAkun FROM tblakun WHERE kdAkun = '"+ rows.insertId +"'";
				connection.query(sql2,function(err,rows){
					if(!err && rows.length > 0) 
					{
						res.json(rows[0]);
						//connection.end();
					} 
					else{
						res.json(err);
						//connection.end();
					}
				});
			}
			else{
				res.json(err);
				//connection.end();
			}
		});
		//connection.end();
	});
	app.get("/tblAkun",function(req,res){
		var sql = "SELECT kdAkun, nmAkun, kdUser, TipeAkun FROM tblakun";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				data['result'] = rows;
				res.json(data);
				//connection.end();
			} 
			else{
				res.json(err);
				//connection.end();
			}
		});
		//connection.end();
	});
	app.get("/tblAkun/:kdUser",function(req,res){
		var kdUser = req.params.kdUser;
		var sql = "SELECT kdAkun, nmAkun, kdUser, TipeAkun FROM tblakun WHERE kdUser = '"+ kdUser +"'";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				
				data['result'] = rows;
				res.json(data);
				//connection.end();
			} 
			else{
				data['result'] = [{"kdAkun":0,"nmAkun":"kosong"}];
				res.json(data);
				//connection.end();
			}
		});
		//connection.end();
	});
	app.get("/tblAkun/:tipe/:kdUser",function(req,res){
		var kdUser = req.params.kdUser;
		var tipe = req.params.tipe;
		var sql = "SELECT kdAkun, nmAkun, kdUser, TipeAkun FROM tblakun WHERE kdUser = '"+ kdUser +"' AND TipeAkun = '"+ tipe +"'";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				data['result'] = rows;
				res.json(data);
				//res.json(rows);
				//connection.end();
			} 
			else{
				data['result'] = [{"kdAkun":0,"nmAkun":"kosong"}];
				res.json(data);
				//connection.end();
			}
		});
		//connection.end();
	});
	app.get("/tblAkun/GetSelected/:kdAkun/:kdUser",function(req,res){
		var kdAkun = req.params.kdAkun;
		var kdUser = req.params.kdUser;
		var sql = "SELECT kdAkun, nmAkun, kdUser, TipeAkun FROM tblakun WHERE kdAkun = '"+ kdAkun +"' AND kdUser = '"+ kdUser +"'";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				res.json(rows[0]);
				//connection.end();
			} 
			else{
				data = {"kdAkun":0,"nmAkun":"kosong"};
				res.json(data);
				//connection.end();
			}
		});
		//connection.end();
	});
	app.get("/tblAkun/:tipe/:kdAkun/:kdUser",function(req,res){
		var kdAkun = req.params.kdAkun;
		var kdUser = req.params.kdUser;
		var tipe = req.params.tipe;
		var sql = "SELECT kdAkun, nmAkun, kdUser, TipeAkun FROM tblakun WHERE kdAkun = '"+ kdAkun +"' AND kdUser = '"+ kdUser +"' AND TipeAkun = '"+ tipe +"'";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				res.json(rows[0]);
				//connection.end();
			} 
			else{
				data = {"kdAkun":0,"nmAkun":"kosong"};
				res.json(data);
				//connection.end();
			}
		});
		//connection.end();
	});
	app.put("/tblAkun/:kdAkun/:kdUser",function(req,res){
		
		var kdAkun = req.params.kdAkun;
		var kdUser = req.params.kdUser;
		
		var postBody = req.body;
		var nmAkun = postBody.nmAkun;
		var TipeAkun = postBody.TipeAkun;
		
		var sql = "UPDATE tblakun SET nmAkun = '" + nmAkun + "', TipeAkun = '"+ TipeAkun +"' WHERE kdAkun = '"+ kdAkun +"' AND kdUser = '"+ kdUser +"'";
		var sql2 = "SELECT kdAkun, nmAkun, kdUser, TipeAkun FROM tblakun WHERE kdAkun = '"+ kdAkun +"' AND kdUser = '"+ kdUser +"'";
		connection.query(sql,function(err,rows){
			if(rows.affectedRows)
			{
				connection.query(sql2,function(err,rows){
					if(!err && rows.length > 0) 
					{
						res.json(rows[0]);
						//connection.end();
					} 
					else{
						res.json(err);
						//connection.end();
					}
				});
				connection.end();
			}
			else{
				res.json(err);
				//connection.end();
			}
		});
		//connection.end();
	});
	app.delete("/tblAkun/:kdAkun/:kdUser",function(req,res){
		var kdAkun = req.params.kdAkun;
		var kdUser = req.params.kdUser;
		var sql = "DELETE FROM tblakun WHERE kdAkun = '"+ kdAkun +"' AND kdUser = '"+ kdUser +"'";
		var sql2 = "SELECT kdAkun, nmAkun, kdUser, TipeAkun FROM tblakun WHERE kdAkun = '"+ kdAkun +"' AND kdUser = '"+ kdUser +"'";
		connection.query(sql2,function(err,rows){
			if(rows.length > 0) 
			{
				connection.query(sql,function(err,rows){
					if(!err) 
					{
						res.json(rows);
						//connection.end();
					} 
					else{
						res.json(err);
						//connection.end();
					}
				});
				connection.end();
			} 
			else{
				res.json(err);
				//connection.end();
			}
		});
		//connection.end();
	});
	//connection.end();
}