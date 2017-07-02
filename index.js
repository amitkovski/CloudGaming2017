var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,	port = process.env.Port || 3000
,	bodyParser = requier("body-parser")
,	urlencodedParser = bodyParser.urlencode({ extended: false });