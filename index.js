var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.Port || 3000;
var passport = require('passport');
var bodyParser = require('body-parser');
var LdapStrategy = require('passport-ldapauth');
var ldapjs = require('ldapjs');

app.use(express.static(__dirname + '/public')); //redirect public Folder with static Assets
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/img', express.static(__dirname + '/public/img'));

var OPTS = {
  server: {
    url: 'ldap://52.233.129.104:389',
    bindDN: 'cn=admin,dc=gamingservice,dc=cc',
    bindCredentials: 'root',
    searchBase: 'dc=gamingservice,dc=cc',
    searchFilter: '(uid={{username}})'
  }
};

var ldapURL = 'ldap://52.233.129.104:389';
var adminuser = 'admin';
var adminpw = 'root';

passport.use(new LdapStrategy(OPTS));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(passport.initialize());


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', passport.authenticate('ldapauth', { session : false }), function(req, res) {
	res.send({status: 'ok'});
});

app.post('/signup', function(req, res) {
	console.log(req.body);
	//addNewUser(req.body.username, req.body.password, req.body.mail);
});

function addNewUser(username, password, mail) {
	function ldapBind(adminuser, adminpw, callback) {
		var client = ldapjs.createClient({
			url: ldapURL
		});

		var newDN = "cn="+ username + ",dc=gamingservice,dc=cc";
		var newUser = {
			objectClass: "top",
			objectClass: "account",
			objectClass: "posixAccount",
			objectClass: "shadowAccount",
			cn: username,
			sn: username,
			uid: username,
			gidNumber: 100,
			homeDirectory: "/home/" + username,
			loginShell: "/bin/bash",
			gecos: unsername,
			userPassword: password,
		}

		client.bind(adminuser, adminpw, function(err) {
			console.log(err);
			client.add(newDN, newUser, callback);
		});
	}
}




var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Example app listening at http://%s:%s", host, port);
});
