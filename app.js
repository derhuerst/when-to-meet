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
const showPoll = require('./routes/show-poll')
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

app.get('/', start)
app.get('/p/:title/:id', showPoll)
app.post('/p/:title/:id', bodyParsers.urlencoded({extended: false}), createVote)

app.use((err, req, res, next) => {
	res.status(err.notFound ? 404 : err.statusCode || 500)
	res.type('html')
	res.end(renderError(err))
})

module.exports = app
