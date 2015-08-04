var express = require('express');
var mongoose = require('mongoose');
var pg = require('pg');
var bodyParser = require('body-parser');
var path = require('path');
var method_override = require('method-override');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser({uploadDir: '/public/imgs/M'}));
app.use(method_override("_method"));
//mongo
mongoose.connect("mongodb://127.0.0.1/netflix");
var peliculasesquema ={
	  "Title" : String,
	  "Year" : String,
	  "Rated" : String,
	  "Released" : String,
	  "Runtime" : String,
	  "Genre" : String,
	  "Director" : String,
	  "Writer" : String,
	  "Actors" : String,
	  "Plot" : String,
	  "Language" : String,
	  "Country" :String,
	  "Awards" : String,
	  "Poster" : String,
	  "Metascore" : String,
	  "imdbRating" : String,
	  "imdbVotes" : String,
	  "imdbID" : String,
	  "Type" : String
};
//

var Peliculas = mongoose.model("pelicula",peliculasesquema);

app.set("view engine","jade");
app.use(express.static("public"));


app.get("/", function(req, res){
console.log("cliente conectado");
Peliculas.find(function(err,documento){
		res.render("index",{peliculas: documento});;
	}).sort({imdbRating : -1});
});


app.get("/pelicula/:id",function(req,res){
	var idpelicula = req.params.id;
	console.log(idpelicula);
	Peliculas.findOne({_id: idpelicula}, function(err,documento){ 
		res.render("pelicula",{peli: documento});
		console.log(documento);
	});
});


app.get("/peliculas",function(req,res){
	Peliculas.find(function(err,documento){
		res.render("crud_peliculas",{peliculas: documento});
	}).sort({Title : 1});
});

app.get("/newpelicula",function(req,res){
	res.render("crearpelicula");
});

app.post("/crearpeli",function(req,res){
	console.log(req.body);

	/*var tmp_path = req.body.imagen.path;
	console.log(tmp_path);
	var nombrearchivo=req.body.imagen.name;
	var target_path='/public/imgs/M/'+nombrearchivo;
	fs.rename(tmp_path,target_path,function (err) {
		fs.unlink(tmp_path,function (err) {
			//res.send('<p>El archivo se subio correctamente</p></br><img  src="./uploads/'+nombrearchivo+'"/>');
		});
	});*/

	var data ={ 
	  "Title" : req.body.titulo,
	  "Year" : req.body.año,
	  "Rated" : req.body.clasificacion,
	  "Released" : req.body.estreno,
	  "Runtime" : req.body.duracion,
	  "Genre" : req.body.generos,
	  "Director" : req.body.director,
	  "Writer" : req.body.escritor,
	  "Actors" : req.body.actores,
	  "Plot" : req.body.texto,
	  "Language" : req.body.lenguaje,
	  "Country" :req.body.locacion,
	  "Awards" : req.body.premios
	};
	var peli = new Peliculas(data);
	peli.save(function(err){
		console.log(peli);
		res.redirect("/peliculas");
	})
	
});

app.get("/pelicula/edit/:id",function(req,res){
	var idpelicula = req.params.id;
	//console.log(idpelicula);
	Peliculas.findOne({_id: idpelicula}, function(err,documento){ 
		res.render("actualizarpelicula",{peli: documento});
		//console.log(documento);
	});
});
app.put("/pelicula/:id",function(req,res){
	var idpelicula = req.params.id;
	var data ={ 
	  "Title" : req.body.titulo,
	  "Year" : req.body.año,
	  "Rated" : req.body.clasificacion,
	  "Released" : req.body.estreno,
	  "Runtime" : req.body.duracion,
	  "Genre" : req.body.generos,
	  "Director" : req.body.director,
	  "Writer" : req.body.escritor,
	  "Actors" : req.body.actores,
	  "Plot" : req.body.texto,
	  "Language" : req.body.lenguaje,
	  "Country" :req.body.locacion,
	  "Awards" : req.body.premios
	};
	
	console.log(idpelicula);
	Peliculas.update({"_id": idpelicula}, data,function(err){
		console.log("actualizacion exitosa")
		//console.log(peli);
		console.log(err)
		res.redirect("/peliculas");
	})
});

app.get("/pelicula/:id/delete",function(req,res){
	var idpelicula = req.params.id;
	//console.log(idpelicula);
	Peliculas.findOne({_id: idpelicula}, function(err,documento){ 
		res.render("eliminarpelicula",{peli: documento});
		//console.log(documento);
	});
});

app.delete("/pelicula/:id",function(req,res){
	var idpelicula = req.params.id;

	Peliculas.remove({_id: idpelicula},function(err){
		console.log("eliminacion exitosa")
		console.log(err)
		res.redirect("/peliculas");
	})
});


app.get("/login",function(req,res){
	res.render("admin");
});

app.post("/verificacion",function(req,res){
	console.log(req.body);
	if (req.body.user == 'admin' && req.body.password == 'admin' ){
		res.redirect("/peliculas");
	}else{
		res.render("admin");
	}

});



app.get("/newcomentario",function(req,res){
	res.render("crearcomentario");
});

app.post("/comentario",function(req,res){
	console.log(req.body);
	var data ={
	  "Title" : req.body.titulo,
	  "Poster" : req.body.comentario,

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

app.listen(8080);
console.log("servidor iniciado!!!");