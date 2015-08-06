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

//postgres
var conString = "postgres://postgres:@127.0.0.1/comentarios";
var client = new pg.Client(conString);
client.connect();         
//

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
	var resulpost = "";
	Peliculas.findOne({_id: idpelicula}, function(err,documento){ 

		client.query('SELECT * FROM comentarios where idpelicula = $1 ORDER BY id DESC', [idpelicula], function(err, result) {
	    console.log(result.rows);
		//res.render("pelicula", { peliculas: result.rows[0]});
		resulpost = result.rows;
		res.render("pelicula",{peli: documento, comentarios: resulpost});
	    if(err) {return res.render("pelicula",{peli: documento});}  });

		
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



app.post("/comentario",function(req,res){
	console.log(req.body);
	
	var data = {
		idpelicula : req.body.idpelicula,
		nombre : req.body.nombre, 
		email : req.body.correo,
		comentario : req.body.comentario 
		};

        // SQL Query > Insert Data
        client.query("INSERT INTO comentarios (idpelicula, nombre, email,comentario) values($1, $2, $3, $4)", [data.idpelicula, data.nombre, data.email, data.comentario]);

		res.redirect("/pelicula/"+ req.body.idpelicula);
	
 
});


app.get("/comentario/edit/:id",function(req,res){
	var idcomen = req.params.id;
	console.log(idcomen);
	client.query('SELECT * FROM comentarios where id = $1 ', [idcomen], function(err, result) {
	    console.log(result.rows);
		res.render("modificarcomentario",{comentario: result.rows});
	    if(err) {return res.redirect("/");}  });

});


app.put("/comentario/:id",function(req,res){
	var idcomentario = req.params.id;
	console.log(idcomentario);
	
	var data = {
		idpelicula : req.body.idpelicula,
		nombre : req.body.nombre, 
		email : req.body.correo,
		comentario : req.body.comentario 
		};
    console.log(data)
        // SQL Query > Update Data
        client.query("UPDATE comentarios SET idpelicula=($1), nombre=($2), email=($3),comentario=($4) where id=($5)", [data.idpelicula, data.nombre, data.email, data.comentario, idcomentario], function(err, result) {
		res.redirect("/pelicula/"+ data.idpelicula);
		//res.redirect("/pelicula");
	    if(err) {return res.redirect("/");  }  });
});

app.get("/comentario/:id/delete",function(req,res){
	var idcomen = req.params.id;
	console.log(idcomen);
	client.query('SELECT * FROM comentarios where id = $1 ', [idcomen], function(err, result) {
	    console.log(result.rows);
		res.render("eliminarcomentario",{comentario: result.rows});
	    if(err) {return res.redirect("/");}  });
	


});

app.delete ("/comentario/:id",function(req,res){
	var idcomentario = req.params.id;
	console.log(idcomentario);


        client.query("DELETE FROM comentarios WHERE id=($1)",[idcomentario], function(err, result) {
		//res.redirect("/pelicula/"+ req.body.idpelicula);
		res.redirect("/");
	    if(err) {return res.redirect("/");  }  });
});

app.listen(8080);
console.log("servidor iniciado!!!");