const axios = require('axios')

const launchesDataBase = require('./launches.mango')
const planets = require('./planets.model')

const DEFAULT_FLIGHT_NUMBER = 100
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function getLatestFlightNumber() {
  return await launchesDataBase.findOne().sort('-flightNumber')
}

async function saveLaunch(launch) {
  await launchesDataBase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  )
}

async function findLaunch(filter) {
  return await launchesDataBase.findOne(filter)
}

async function populatelaunch() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  })

  if (response.status !== 200) {
    console.log('Problem downloading launch data from SpaceX')
    throw new Error('Downloading from SpaceX failed')
  }
  const launchDocs = response.data.docs
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads']
    const customers = payloads.flatMap(payload => {
      return payload['customers']
    })

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    }
    await saveLaunch(launch)
    console.log(`${launch.flightNumber} ${launch.mission}`)
  }
}

async function getAllLaunches(skip, limit) {
  return await launchesDataBase
    .find({}, { _id: 0, __v: 0 })
    .sort('flightNumber')
    .skip(skip)
    .limit(limit)
}

async function addNewLaunch(launch) {
  const planet = planets.findOne({ kepler_name: launch.target })
  if (!planet) {
    throw new Error('No matching planet was found')
  }
  const latestflightNumber = await getLatestFlightNumber()
  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: true,
    costumers: ['NASA', 'ZTM'],
    flightNumber: latestflightNumber,
  })
  await saveLaunch(newLaunch)
}

async function checkExistLaunch(flightId) {
  return findLaunch({ flightNumber: flightId })
}

async function abortLaunch(flightId) {
  const aborted = launchesDataBase.updateOne(
    { flightNumber: flightId },
    { upcoming: false, success: false }
  )
  return aborted.ok === 1 && aborted.nModified === 1
}

async function loadLaunchSpaceX() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    mission: 'FalconSat',
    rocket: 'Falcon 1',
  })

  if (firstLaunch) {
    console.log('Launch data already exist')
  } else {
    await populatelaunch()
  }
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  checkExistLaunch,
  abortLaunch,
  loadLaunchSpaceX,
}
