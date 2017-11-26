'use strict'

const app = require('./app')

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

const server = http.createServer(app)
server.listen(port, (err) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}{
		else console.info(`Listening on port ${port}.`)
})
