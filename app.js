'use strict'

const path = require('path')
const level = require('level')
const express = require('express')
const hsts = require('hsts')
const compression = require('compression')
const serve = require('serve-static')

const showPoll = require('./routes/show-poll')

const db = level(process.env.DB || './when-to-meet.ldb', {valueEncoding: 'json'})
const app = express()
app.locals.db = db

app.use(hsts({maxAge: 24 * 60 * 60 * 1000}))
app.use(compression())
app.use('/static', serve(path.join(__dirname, 'static'), {index: false}))

app.get('/poll/:id', showPoll)

module.exports = app
