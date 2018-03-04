var mysql = require('mysql');
//var bcrypt = require('bcrypt');
//const saltRounds = 10;
var data = {};

function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate() + 1)].join('-');
}

function convertDate2(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
}

var connection = mysql.createConnection({
    host: 'bgabgb3vi-mysql.services.clever-cloud.com',
    user: 'uawpqbdrl3llqjpt',
    password: 'Dlff4WOTqvDqpTfu3a5',
	database: "bgabgb3vi"
});
module.exports = function(app){
	app.post("/tblJurnal",function(req,res){
		var postBody = req.body;
		var nmJurnal = postBody.nmJurnal;
		var kdAkun = postBody.kdAkun;
		var kdUser = postBody.id;
		var tgl = postBody.tgl;
		var format = convertDate(tgl);
		var harga = postBody.harga;
		
		var sql = "INSERT INTO jurnal_harian( nmJurnal, kdAkun, kdUser, tgl, harga) VALUES ('" + nmJurnal + "','"+ kdAkun +"','"+ kdUser +"','"+format+"','"+ harga +"')";
		
		connection.query(sql,function(err,rows){
			if(rows.affectedRows)
			{
				var sql2 = "SELECT kdJurnal, nmJurnal, tblakun.kdAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE kdJurnal = '"+ rows.insertId +"'";
				connection.query(sql2,function(err,rows){
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
	});
	app.get("/tblJurnal",function(req,res){
		var sql = "SELECT kdJurnal, nmJurnal, kdAkun, tblakun.nmAkun AS nmAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				data['result'] = rows;
				res.json(data);
			} 
			else{
				data['result'] = [{"kdAkun":0,"nmAkun":"kosong","nmJurnal":"kosong","harga":0}];
				res.json(data);
			}
		});
	});
	app.get("/tblJurnal/:kdUser",function(req,res){
		var kdUser = req.params.kdUser;
		var sql = "SELECT kdJurnal, nmJurnal, tblakun.kdAkun AS kdAkun, tblakun.nmAkun AS nmAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE jurnal_harian.kdUser = '"+ kdUser +"'";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				data['result'] = rows;
				res.json(data);
			} 
			else{
				data['result'] = [{"kdAkun":0,"nmAkun":"kosong","nmJurnal":"kosong","harga":0}];
				res.json(data);
			}
		});
	});
	app.get("/tblJurnal/:jenis/:kdUser",function(req,res){
		var kdUser = req.params.kdUser;
		var jenis = req.params.jenis;
		var sql = "SELECT kdJurnal, nmJurnal, tblakun.kdAkun AS kdAkun, tblakun.nmAkun AS nmAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE jurnal_harian.kdUser = '"+ kdUser +"' AND tblakun.TipeAkun = '"+jenis+"'";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				data['result'] = rows;
				res.json(data);
			} 
			else{
				data['result'] = [{"kdAkun":0,"nmAkun":"kosong","nmJurnal":"kosong","harga":0,"error":err}];
				res.json(data);
			}
		});
	});
	app.get("/tblJurnal/BulanIni/:jenis/:kdUser",function(req,res){
		var kdUser = req.params.kdUser;
		var jenis = req.params.jenis;
		var sql = "SELECT kdJurnal, nmJurnal, tblakun.kdAkun AS kdAkun, tblakun.nmAkun AS nmAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE jurnal_harian.kdUser = '"+ kdUser +"' AND tblakun.TipeAkun = '"+jenis+"' AND MONTH(tgl) = MONTH(CURRENT_DATE()) AND YEAR(tgl) = YEAR(CURRENT_DATE())";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				data['result'] = rows;
				res.json(data);
			} 
			else{
				data['result'] = [{"kdAkun":0,"nmAkun":"kosong","nmJurnal":"kosong","harga":0,"error":err}];
				res.json(data);
			}
		});
	});
	app.get("/tblJurnal/Sum/BulanIni/:kdUser",function(req,res){
		var kdUser = req.params.kdUser;
		var pemasukan = 0;
		var pengeluaran = 0;
		//var jenis = req.params.jenis;
		var sql = "SELECT SUM(harga) AS harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE jurnal_harian.kdUser = '"+ kdUser +"' AND tblakun.TipeAkun = 'pemasukan' AND MONTH(tgl) = MONTH(CURRENT_DATE()) AND YEAR(tgl) = YEAR(CURRENT_DATE())";
		var sql2 = "SELECT SUM(harga) AS harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE jurnal_harian.kdUser = '"+ kdUser +"' AND tblakun.TipeAkun = 'pengeluaran' AND MONTH(tgl) = MONTH(CURRENT_DATE()) AND YEAR(tgl) = YEAR(CURRENT_DATE())";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				
				pemasukan = rows[0]['harga'];
				//res.json(data);
				connection.query(sql2,function(err2,rows2){
					if(!err2 && rows2.length > 0) 
					{
						pengeluaran = rows2[0]['harga'];
						
						data1 = {"pemasukan":pemasukan,"pengeluaran":pengeluaran};
						console.log(data1);
						res.json(data1);
					} 
					else{
						data1 = {"pemasukan":0,"pengeluaran":0};

						res.json(data1);
					}
				});
			} 
			else{
				data1 = {"pemasukan":0,"pengeluaran":0};
				res.json(data);
			}
		});
	}); 
	app.post("/tblJurnal/GetAll/:jenis/:kdUser",function(req,res){
		var kdUser = req.params.kdUser;
		var jenis = req.params.jenis;
		
		var postBody = req.body;
		var tgl = postBody.tgl;
		var format = convertDate(tgl);
		
		var sql = "SELECT kdJurnal, nmJurnal, tblakun.kdAkun AS kdAkun, tblakun.nmAkun AS nmAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE jurnal_harian.kdUser = '"+ kdUser +"' AND tblakun.TipeAkun = '"+jenis+"' AND tgl = '"+format+"'";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				data['result'] = rows;
				res.json(data);
			} 
			else{
				data['result'] = [{"kdAkun":0,"nmAkun":"kosong","nmJurnal":"kosong","harga":0,"error":err}];
				res.json(data);
			}
		});
	});
	app.post("/tblJurnal/GetRecord/:kdUser",function(req,res){
		var kdUser = req.params.kdUser;
		
		var postBody = req.body;
		var jenis = postBody.jenis;
		var waktu = postBody.waktu;
		if(waktu == 'bulan ini' || waktu == 'tahun ini' || waktu == 'minggu ini')
		{
			if(waktu == 'bulan ini')
			{
				console.log("bulanan");
				var sql = "SELECT kdJurnal, nmJurnal, tblakun.kdAkun AS kdAkun, tblakun.nmAkun AS nmAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE tblakun.TipeAkun = '"+jenis+"' AND MONTH(tgl) = MONTH(CURRENT_DATE()) AND YEAR(tgl) = YEAR(CURRENT_DATE())";
				connection.query(sql,function(err,rows){
					if(!err && rows.length > 0) 
					{
						data['result'] = rows;
						res.json(data);
					} 
					else{
						data['result'] = [{"kdAkun":0,"nmAkun":"kosong","nmJurnal":"kosong","harga":0,"error":err}];
						res.json(data);
					}
				});
			}
			else if(waktu == 'tahun ini')
			{
				console.log("tahunan");
				var sql = "SELECT kdJurnal, nmJurnal, tblakun.kdAkun AS kdAkun, tblakun.nmAkun AS nmAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE tblakun.TipeAkun = '"+jenis+"' AND YEAR(tgl) = YEAR(CURRENT_DATE()) ORDER BY MONTH(tgl)";
				connection.query(sql,function(err,rows){
					if(!err && rows.length > 0) 
					{
						data['result'] = rows;
						res.json(data);
					} 
					else{
						data['result'] = [{"kdAkun":0,"nmAkun":"kosong","nmJurnal":"kosong","harga":0,"error":err}];
						res.json(data);
					}
				});
			}
			else if(waktu == 'minggu ini')
			{
				console.log("minguan");
				var sql = "SELECT kdJurnal, nmJurnal, tblakun.kdAkun AS kdAkun, tblakun.nmAkun AS nmAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE tblakun.TipeAkun = '"+jenis+"' AND YEARWEEK(DATE(tgl), 1) = YEARWEEK(CURRENT_DATE(), 1) ORDER BY MONTH(tgl)";
				connection.query(sql,function(err,rows){
					if(!err && rows.length > 0) 
					{
						data['result'] = rows;
						res.json(data);
					} 
					else{
						data['result'] = [{"kdAkun":0,"nmAkun":"kosong","nmJurnal":"kosong","harga":0,"error":err}];
						res.json(data);
					}
				});
			}
		}
		else{
			//console.log("error");
			data['result'] = [{"kdAkun":0,"nmAkun":"kosong","nmJurnal":"kosong","harga":0}];
			res.json(data);
		}
		
		
	});
	app.get("/tblJurnal/GetSelected/:kdJurnal/:kdUser",function(req,res){
		var kdUser = req.params.kdUser;
		var kdJurnal = req.params.kdJurnal;
		var sql = "SELECT kdJurnal, nmJurnal, tblakun.kdAkun AS kdAkun, tblakun.nmAkun AS nmAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE jurnal_harian.kdUser = '"+ kdUser +"' AND kdJurnal = '"+kdJurnal+"'";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				//data['result'] = rows;
				data = {"kdJurnal":rows[0]["kdJurnal"],"nmJurnal":rows[0]["nmJurnal"],"kdAkun":rows[0]["kdAkun"],"nmAkun":rows[0]["nmAkun"],"kdUser":rows[0]["kdUser"],"tgl":convertDate(rows[0]["tgl"]),"harga":rows[0]["harga"]};
				res.json(data);
			} 
			else{
				data = {"kdAkun":0,"nmAkun":"kosong","nmJurnal":"kosong","harga":0,"error":err};
				res.json(data);
			}
		});
	});
	app.get("/tblJurnal/:jenis/:kdUser",function(req,res){
		var kdJurnal = req.params.kdJurnal;
		var kdUser = req.params.kdUser;
		var sql = "SELECT kdJurnal, nmJurnal, tblakun.kdAkun AS kdAkun, tblakun.nmAkun AS nmAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE kdJurnal = '"+ kdJurnal +"' AND jurnal_harian.kdUser = '"+ kdUser +"'";
		connection.query(sql,function(err,rows){
			if(!err && rows.length > 0) 
			{
				res.json(rows[0]);
			} 
			else{
				data = {"kdAkun":0,"nmAkun":"kosong","nmJurnal":"kosong","harga":0,"error":err};
				res.json(data);
			}
		});
	});
	app.put("/tblJurnal/:kdJurnal/:kdUser",function(req,res){
		
		var kdJurnal = req.params.kdJurnal;
		var kdUser = req.params.kdUser;
		
		var postBody = req.body;
		var kdAkun = postBody.kdAkun;
		var tgl = postBody.tgl;
		var harga = postBody.harga;
		var nmJurnal = postBody.nmJurnal;
		var format = convertDate2(tgl);
		
		var sql = "UPDATE jurnal_harian SET nmJurnal = '" + nmJurnal + "', kdAkun = '"+ kdAkun +"', tgl = '"+ format +"', harga = '"+ harga +"' WHERE kdJurnal = '"+ kdJurnal +"' AND kdUser = '"+ kdUser +"'";
		var sql2 = "SELECT kdJurnal, nmJurnal, tblakun.kdAkun AS kdAkun, tblakun.nmAkun AS nmAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE kdJurnal = '"+ kdJurnal +"' AND jurnal_harian.kdUser = '"+ kdUser +"'";
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
			}
			else{
				res.json(err);
			}
		});
	});
	app.delete("/tblJurnal/:kdJurnal/:kdUser",function(req,res){
		var kdJurnal = req.params.kdJurnal;
		var kdUser = req.params.kdUser;
		var sql = "DELETE FROM jurnal_harian WHERE kdJurnal = '"+ kdJurnal +"' AND kdUser = '"+ kdUser +"'";
		var sql2 = "SELECT kdJurnal, nmJurnal, tblakun.kdAkun AS kdAkun, tblakun.nmAkun AS nmAkun, jurnal_harian.kdUser, tgl, harga FROM jurnal_harian LEFT JOIN tblakun ON jurnal_harian.kdAkun = tblakun.kdAkun WHERE kdJurnal = '"+ kdJurnal +"' AND jurnal_harian.kdUser = '"+ kdUser +"'";
		connection.query(sql2,function(err,rows){
			if(rows.length > 0) 
			{
				connection.query(sql,function(err,rows){
					if(!err) 
					{
						res.json(rows);
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
	});
}