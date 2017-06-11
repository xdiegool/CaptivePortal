/*
 * https://coligo.io/building-ajax-file-uploader-with-node/
 * Let's start off by requiring all the modules needed for the file uploader:
 * express handles our routing and serves up the index.html page and static files to our visitors
 * formidable will parse the incoming form data (the uploaded files)
 * The fs module will be used to rename uploaded files
 */
var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var userController = require('./js/userController');

/*
 * We'll use the express.static middleware to serve up the static files in our public/ directory
 * and we'll create a route which will serve up the homepage (index.html) when someone visits the website:
 */
app.use(express.static(path.join(__dirname, '')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

/*
 * Create the upload/ route to handle the incoming uploads via the POST method:
 */
app.post('/upload', function(req, res){
    // create an incoming form object
    var form = new formidable.IncomingForm();
    // specify that we want to allow the user to upload multiple files in a single request
    // form.multiples = true;
    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/uploads');
    // every time a file has been uploaded successfully,
    // rename it to it's original name
    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name), function(){});
    });
    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });
    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        // FUNCION DE LEER JSON Y DEVOLVER STRING??
        res.end('success');
        userController.getInactiveUser();
        //userController.setUserActive(userId);
    });
    // parse the incoming request containing the form data
    form.parse(req);
});

/*
 * Now that we have everything set up and the route to handle the uploads in place,
 * all we need to do it start our NodeJS server and start processing uploads!
 */
var server = app.listen(3000, function(){
    console.log('Server listening on port 3000');
});

/*
 * Aquí falta función que sea llamada cuando form.on('end', ...), en 47:5, para proporcionar las credenciales :)
 * y conectarse usando ChilliLibrary y todos esos rollos.
 */
/*
function getInactiveUser(){
    var jsonContents = fs.readFileSync("./users/users.json");
    var usersList = JSON.parse(jsonContents);
    //console.log(usersList.users[1].username); //Esto me daría CORRECTAMENTE el username del segundo elemento del JSON
    for (var i =0; i<usersList.users.length; i++){
        if (!usersList.users[i].isActive){
            usersList.users[i].isActive = true;
            fs.writeFileSync("./users/users.json", JSON.stringify(usersList, null, 2));
            var userAndPass = [usersList.users[i].username, usersList.users[i].password];
            console.log(userAndPass); // TODO las tres lineas anteriores deberían ir en otra función o módulo!!
            return userAndPass;
        }
    }
}
*/
