var express = require('express');
var app = express();

app.set("view engine","jade")
app.use(express.static("public"));

app.get("/", function(req, res){
console.log("cliente conectado");
//res.writeHead(200, {'content-type': "text/html"});
res.render("index");
res.end();
});

app.listen(8080);
console.log("servidor iniciado!!!");