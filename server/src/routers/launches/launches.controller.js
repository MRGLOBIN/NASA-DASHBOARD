const {
  getAllLaunches,
  addNewLaunch,
  checkExistLaunch,
  abortLaunch,
} = require('../../models/launches.model')
const { pagination } = require('../../services/query')

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = pagination(req.query)
  const launches = await getAllLaunches(skip, limit)
  return res.status(200).json(launches)
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body
  if (
    !launch.mission ||
    !launch.launchDate ||
    !launch.target ||
    !launch.rocket
  ) {
    return res.status(400).json({
      errror: 'missing required fields',
    })
  }
  const launchDate = new Date(launch.launchDate)
  if (isNaN(launchDate)) {
    return res.status(400).json({
      errror: 'Invalid Date',
    })
  }
  await addNewLaunch(launch)
  res.status(200).json(launch)
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id
  const existLaunch = await checkExistLaunch(launchId)

  if (!existLaunch) {
    return res.status(400).json({
      error: 'Invalid flight number',
    })
  }
  const aborted = await abortLaunch(launchId)
  if (!aborted) {
    return res.status(400).json({
      error: 'Launch was not aborted',
    })
  }
  res.status(200).json({
    ok: true,
  })
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
}
