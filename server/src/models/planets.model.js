const fs = require('fs')
const path = require('path')

const planets = require('./planets.mango')
const { parse } = require('csv-parse')

function isHabitualPlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  )
}

async function loadPlanetsData() {
  return new Promise((res, rej) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async data => {
        if (isHabitualPlanet(data)) {
          await saveplanet(data)
        }
      })
      .on('error', err => {
        console.log(err)
        rej(err)
      })
      .on('end', async () => {
        const totalPlants = (await getAllPlanets()).length
        console.log(`${totalPlants} are habitual`)
        res()
      })
  })
}

async function saveplanet(planet) {
  try {
    await planets.updateOne(
      {
        kepler_name: planet.kepler_name,
      },
      {
        kepler_name: planet.kepler_name,
      },
      {
        upsert: true,
      }
    )
  } catch (err) {
    console.log(`Loading planets error: ${err}`)
  }
}

async function getAllPlanets() {
  return await planets.find({}, { __v: 0, _id: 0 })
}

module.exports = {
  loadPlanetsData,
  saveplanet,
  getAllPlanets,
}
