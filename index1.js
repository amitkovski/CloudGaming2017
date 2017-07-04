var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.Port || 3000;
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var basicAuth = require('basic-auth');
var LdapAuth = require('ldapauth-fork');

app.use(express.static(__dirname + '/public')); //redirect public Folder with static Assets
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/img', express.static(__dirname + '/public/img'));

app.use(urlencodedParser);

var ldap = new LdapAuth({
  url: 'ldap://52.233.129.104:389',
  bindDN: 'uid=admin,dc=gamingservice,dc=cc',
  bindCredentials: 'root',
  searchBase: 'dc=gamingservice,dc=cc',
  searchFilter: '(uid={{username}})',
  reconnect: true
});

function rejectBasicAuth (res) {
  res.statusCode = 401;
  res.setHeader('WWW-Authenticate', 'Basic realm="Example"');
  res.end('Access denied');
}

function basicAuthMiddleware (req, res, next) {
	var credentials = basicAuth(req);
	if (!credentials) {
    return rejectBasicAuth(res);
  }
 
  ldap.authenticate(credentials.name, credentials.pass, function(err, user) {
    if (err) {
      return rejectBasicAuth(res);
    }
 
    req.user = user;
    next();
  });
};

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', function(req, res) {	
	var user = basicAuth(req);
	/*var user = req.body.name;
	var pass = req.body.pass;

	console.log("User: " + user);
	console.log("Pass: " + pass);

	res.sendFile(__dirname + '/public/gamepool.html');*/

	console.log(user.name);
	console.log(user.pass);

	if(!user) {
		return rejectBasicAuth(res);
	}

	ldap.authenticate(user.name, user.pass, function(err, user) {
		console.log("Ich bin im /login 1");
		if (err) {
			console.log("LDAP-Error: " + err);
			return rejectBasicAuth(res);
		} else {
			console.log("LDAP-User: " + user);
		}
		console.log("Ich bin im /login 2");
		req.user = user;
		//next();
	});
	res.json(req.user);
});

var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Example app listening at http://%s:%s", host, port);
})