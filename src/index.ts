import { _ms } from '@naturalcycles/js-lib'
import * as express from 'express'
import { Request, Response } from 'express'
import { move } from './logic'
import { GameState, InfoResponse } from './types'

const app = express()
app.use(express.json())

const port = process.env['PORT'] || 8080

app.get('/', (req: Request, res: Response) => {
  res.send(info())
})

app.post('/start', (req: Request, res: Response) => {
  res.send(start(req.body))
})

app.post('/move', (req: Request, res: Response) => {
  res.send(move(req.body))
})

app.post('/end', (req: Request, res: Response) => {
  res.send(end(req.body))
})

// Start the Express server
app.listen(port, () => {
  console.log(
    `Started Battlesnake Server at http://0.0.0.0:${port} in ${_ms(process.uptime() * 1000)}`,
  )
})

function info(): InfoResponse {
  console.log('INFO')
  const response: InfoResponse = {
    apiversion: '1',
    author: '',
    color: '#888888',
    head: 'default',
    tail: 'default',
  }
  return response
}

function start(gameState: GameState): void {
  console.log(`${gameState.game.id} START`)
}

function end(gameState: GameState): void {
  console.log(`${gameState.game.id} END\n`)
}
