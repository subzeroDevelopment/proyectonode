var express = require('express');
var mongoose = require('mongoose');
var pg = require('pg');

var app = express();

//mongo
mongoose.connect("mongodb://127.0.0.1/comentarios");
var comentariosesquema ={
	Title: String,
	usuario:String,
	comentario:String,
	estrellas:Number
};
var comentario = mongoose.model("comentario",comentariosesquema);
//
//postgres
var conString = "postgres://postgres:pelicula@127.0.0.1/netflix";
var client = new pg.Client(conString);
client.connect();         
//

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
	console.log(req);
	res.render("crearpelicula");
});

app.get("/pelicula",function(req,res){

	client.query('SELECT * FROM netflix.pelicula', function(err, result) {
    
    console.log(result.rows[0]);

	res.render("pelicula", { peliculas: result.rows[0]});
    
    if(err) {return console.error('error running query', err);}


  });


});

app.listen(8080);
console.log("servidor iniciado!!!");