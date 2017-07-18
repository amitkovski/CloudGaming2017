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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

var OPTS = {
  server: {
    url: 'ldap://52.233.129.104:389',
    bindDN: 'cn=admin,dc=gamingservice,dc=cc',
    bindCredentials: 'root',
    searchBase: 'dc=gamingservice,dc=cc',
    searchFilter: '(uid={{username}})'
  }
};

passport.use(new LdapStrategy(OPTS));
app.use(passport.initialize());

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/login.html');
});

app.get('/signup', function(req, res) {
	res.sendFile(__dirname + '/public/signUp.html');
})

app.post('/login', passport.authenticate('ldapauth', { session : false }), function(req, res) {
	res.send({status: '200'});
});

app.post('/newUser', function(req, res) {
	console.log(req.body);
	addNewUser(req.body.username, req.body.password, req.body.mail, res);
});

var ldapURL = 'ldap://52.233.129.104:389';
var adminuser = 'cn=admin';
var adminpw = 'root';
var bindDN = 'cn=admin,dc=gamingservice,dc=cc'

function addNewUser(username, password, mail, res) {	
	var client = ldapjs.createClient({
		url: ldapURL
	});

	var rand_uid = randomInt(1,99999);

	//define domain (address) in LDAP tree for new user
	var newDN = "cn="+ username + ",dc=gamingservice,dc=cc";
	//create new user object
	var newUser = {
		objectClass: ["inetOrgPerson", "posixAccount"],
		cn: username,
		sn: username,
		uid: username,
		//userid is given randomly, there is no logic which ckecks if id is already 
		//in use. If so, this function will fail with an ldap error => user can just try it again
		uidNumber: rand_uid,
		gidNumber: 1337,
		homeDirectory: "/home/" + username,
		loginShell: "/bin/bash",
		gecos: username,
		userPassword: password,
	}

	//bind webapp as new client on ldap-server (with admin credentials)
	client.bind(bindDN, adminpw, function(bindErr) {
		console.log("client.bind Error: " + bindErr);
		//create new user on ldap-server
		client.add(newDN, newUser, function(addErr){
			console.log("client.add Error: " + addErr);
			if (addErr == null) {
				res.send({status: '200', success: true});
			} else {
				res.send({status: '400', error: addErr});
			}
		});
	});
}

function randomInt (low, high) 
{
    return Math.floor(Math.random() * (high - low) + low);
}

server.listen(port, function() 
{
	console.log("Example app listening at http://%s:%s", server.address().address, server.address().port);
});