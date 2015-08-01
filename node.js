var express = require('express');
var mongoose = require('mongoose');
var pg = require('pg');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//mongo
mongoose.connect("mongodb://127.0.0.1/peliculas");
var peliculasesquema ={
	titulocoment: String,
	usuariocoment:String,
	pelicomentario:String,
	peliestrellas:Number
};
//

var Peliculas = mongoose.model("pelicula",peliculasesquema);

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

app.post("/comentario",function(req,res){
	console.log(req.body);
	var data ={
		titulocoment: req.body.titulo,
		usuariocoment: req.body.usuario,
		pelicomentario: req.body.comentario,
		peliestrellas: req.body.estrellas
	};
	var peli = new Peliculas(data);
	peli.save(function(err){
		console.log(peli);
		res.redirect("/comentarios");
	})
	
});


app.get("/comentarios",function(req,res){
	Peliculas.find(function(err,documento){
		res.render("comentario",{comentarios: documento});
	});

});

app.get("/pelicula",function(req,res){

});


app.listen(8080);
console.log("servidor iniciado!!!");