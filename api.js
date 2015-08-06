var http = require("http");
var mongoose = require('mongoose');
var url = require("url");

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


http.createServer(function(peticion, respuesta) {

     respuesta.writeHead(200, {"Content-Type": "text/plain"});
     var params = url.parse(peticion.url, true).query;
     
     if (params.peliculas){
     var input = params.peliculas;
     var numInput = new Number(input);

     console.log(numInput)

     Peliculas.find(function(err,documento){
	
	  console.log(documento);
     respuesta.write("las peliculas son\n " + documento);
     respuesta.end();
			}).sort({imdbRating : -1}).limit(numInput);
	}

	else if(params.nombre){
      var input = params.nombre;
     var nomInput = new String(input);

     console.log(nomInput)
  
     Peliculas.find({Title: {$regex:".*"+nomInput, $options:"i"} }, function(err,documento){
	
	  console.log(documento);
     respuesta.write("las peliculas son\n " + documento);
     respuesta.end();
			}).sort({imdbRating : -1});

	}

	else{
		
		respuesta.write("Escriba un comando valido\n ejemplos:\n http://127.0.0.1:8090/?peliculas=10 \n http://127.0.0.1:8090/?nombre=julia ");
		respuesta.end();
	}

}).listen(8090);



http.createServer(function(peticion, respuesta) {

     respuesta.writeHead(200, {"Content-Type": "aplication/json"});
     var params = url.parse(peticion.url, true).query;
     
     if (params.peliculas){
     var input = params.peliculas;
     var numInput = new Number(input);

     console.log(numInput)

     Peliculas.find(function(err,documento){
	
	  console.log(documento);
     respuesta.write("las peliculas son\n " + documento);
     respuesta.end();
			}).sort({imdbRating : -1}).limit(numInput);
	}

	else if(params.nombre){
      var input = params.nombre;
     var nomInput = new String(input);

     console.log(nomInput)
  
     Peliculas.find({Title: {$regex:".*"+nomInput, $options:"i"} }, function(err,documento){
	
	  console.log(documento);
     respuesta.write("las peliculas son\n " + documento);
     respuesta.end();
			}).sort({imdbRating : -1});

	}

	else{
		console.log("Escriba un comando valido");
		respuesta.write("Escriba un comando valido\n ejemplos:\n http://127.0.0.1:8010/?peliculas=10 \n http://127.0.0.1:8010/?nombre=julia ");
		respuesta.end();
	}

}).listen(8010);

console.log("CORRIENDO API...");

