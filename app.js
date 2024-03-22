const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

let db = null

const dbpath = path.join(__dirname, 'cricketTeam.db')
const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('hello world')
    })
  } catch (e) {
    console.log(`server stopped ${e.message}`)
    process.exit(1)
  }
}

intializeDBAndServer()

app.get('/players/', async (request, response) => {
  const getPlayerDetails = `select * from cricket_team;`
  const playerArray = await db.all(getPlayerDetails)
  response.send(playerArray)
})

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  //console.log(playerDetails)
  const {playerName, jerseyNumber, role} = playerDetails

  const playerData = `insert into cricket_team (playerName,jerseyNumber,role) values (${playerName},${jerseyNumber},${role});`
  //console.log(playerData)

  const dbResponse = await db.run(playerData)
  const playerId = dbResponse.lastID
  response.send(playerId)
  console.log('item added')
  //response.send('Player Added to Team')
})
