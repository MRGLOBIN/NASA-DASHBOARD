const { createServer } = require('http')

const app = require('./app')
const connectToMango = require('./services/connectMango')
const { loadPlanetsData } = require('./models/planets.model')
const { loadLaunchSpaceX } = require('./models/launches.model')

const PORT = process.env.PORT || 3000
const server = createServer(app)

async function startServer() {
  await connectToMango()
  await loadPlanetsData()

  await loadLaunchSpaceX()

  server.listen(PORT, () => {
    console.log('server listening on port: ', PORT)
  })
}

startServer()
