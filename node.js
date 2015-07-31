var express = require('express');
var mongoose = require('mongoose');
var pg = require('pg');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//mongo
/*mongoose.connect("mongodb://127.0.0.1/comentarios");
var comentariosesquema ={
	titulo: String,
	usuario:String,
	comentario:String,
	estrellas:Number
};
var Comentario = mongoose.model("comentario",comentariosesquema);
//
//postgres
var conString = "postgres://postgres:pelicula@127.0.0.1/netflix";
var client = new pg.Client(conString);
client.connect();         
//
*/
app.set("view engine","jade");
app.use(express.static("public"));


app.get("/", function(req, res){
console.log("cliente conectado");
res.render("index");
});

app.get("/newpelicula",function(req,res){
	res.render("crearpelicula");
});

app.get("/newcomentario",function(req,res){
	res.render("crearcomentario");
});

/*
app.post("/comentario",function(req,res){
	console.log(req.body);
	var data ={
		titulo: req.body.titulo,
		usuario: req.body.usuario,
		comentario: req.body.comentario,
		estrellas: req.body.estrellas
	};
	var coment = new Comentario(data);
	coment.save(function(err){
		console.log(coment);
		res.redirect("/comentarios");
	})
	
});


app.get("/comentarios",function(req,res){
	Comentario.find(function(err,documento){
		res.render("comentario",{comentarios: documento});
	});

});

app.get("/pelicula",function(req,res){

	client.query('SELECT * FROM netflix.pelicula', function(err, result) {
    
    console.log(result.rows[0]);

	res.render("pelicula", { peliculas: result.rows[0]});
    
    if(err) {return console.error('error running query', err);}


  });


});
*/

app.listen(8080);
console.log("servidor iniciado!!!");