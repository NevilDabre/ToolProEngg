
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load route
var customers = require('./routes/customers'); 
var employers = require('./routes/employers'); 
var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

// all environments

app.set('ip_address',process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1'); //OPENSHIFT_NODEJS_IP = '127.0.0.1 and Heroku IP = '0.0.0.0'
app.set('port',process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080); //var port = process.env.OPENSHIFT_NODEJS_PORT || 8080

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

app.use(
    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'nodejs'

    },'pool') //or single
);



app.get('/', routes.index);
app.get('/customers', customers.list);
app.get('/customers/add', customers.add);
app.post('/customers/add', customers.save);
app.get('/customers/delete/:id', customers.delete_customer);
app.get('/customers/edit/:id', customers.edit);
app.post('/customers/edit/:id',customers.save_edit);

app.get('/employers', employers.list);
app.get('/employers/add', employers.add);
app.post('/employers/save', employers.save);

app.use(app.router);

var server = http.createServer(app);

server.listen(app.get('port'), app.get('ip_address'), function(){
  console.log('Server ' + app.get('ip_address') + ' as Express server listening on port ' + app.get('port'));
});