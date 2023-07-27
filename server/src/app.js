const express = require('express')
const path = require('path')

const planetsRouter = require('./routers/planets/planets.router')
const launchesRouter = require('./routers/launches/launches.router')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))


app.use('/launches', launchesRouter)
app.use('/planets', planetsRouter)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app