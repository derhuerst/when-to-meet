'use strict'

const path = require('path')
const level = require('level')
const express = require('express')
const hsts = require('hsts')
const compression = require('compression')
const serve = require('serve-static')
const preferredLocales = require('negotiator/lib/language')
const bodyParsers = require('body-parser')

const start = require('./routes/start')
const createPoll = require('./routes/create-poll')
const showPoll = require('./routes/show-poll')
const editPoll = require('./routes/edit-poll')
const createVote = require('./routes/create-vote')
const renderError = require('./ui/error')

const db = level(process.env.DB || './when-to-meet.ldb', {valueEncoding: 'json'})
const app = express()
app.locals.db = db

app.use(hsts({maxAge: 24 * 60 * 60 * 1000}))
app.use(compression())
app.use('/static', serve(path.join(__dirname, 'static'), {index: false}))

app.use((req, res, next) => {
	req.locales = preferredLocales(req.headers['accept-language'])
	next()
})
const bodyParser = bodyParsers.urlencoded({extended: false})

app.get('/', start)
app.post('/p', bodyParser, createPoll)
app.get('/p/:title/:id', showPoll)
app.get('/p/:title/:id/edit', editPoll)
app.post('/p/:title/:id', bodyParser, createVote)

app.use((err, req, res, next) => {
	console.error(err)
	res.status(err.notFound ? 404 : err.statusCode || 500)
	res.type('html')
	res.end(renderError(err))
})

module.exports = app
