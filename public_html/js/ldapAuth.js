var basicAuth = require('basic-auth');
var LdapAuth = require('ldapauth-fork');

var ldap = new LdapAuth({
  url: 'ldap://52.233.129.104:389',
  bindDN: 'uid=admin,dc=gamingservice,dc=cc',
  bindCredentials: 'root',
  searchBase: 'dc=gamingservice,dc=cc',
  searchFilter: '(uid={{username}})',
  reconnect: true
});

var rejectBasicAuth = function(res) {
  res.statusCode = 401;
  res.setHeader('WWW-Authenticate', 'Basic realm="Example"');
  res.end('Access denied');
}

var basicAuthMiddleware = function(req, res, next) {
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

