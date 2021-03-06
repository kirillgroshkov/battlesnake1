// See https://docs.battlesnake.com/references/api for all details and examples.

import { Dir } from './logic'

export interface InfoResponse {
  apiversion: string
  author?: string
  color?: string
  head?: string
  tail?: string
  version?: string
}

export interface MoveResponse {
  move: Dir
  shout?: string
}

export interface Game {
  id: string
  ruleset: { name: string; version: string }
  timeout: number
}

export interface Coord {
  x: number
  y: number
}

export interface Battlesnake {
  id: string
  name: string
  health: number
  body: Coord[]
  latency: string
  head: Coord
  length: number
}

export interface Board {
  height: number
  width: number
  food: Coord[]
  snakes: Battlesnake[]
}

export interface GameState {
  game: Game
  turn: number
  board: Board
  you: Battlesnake
}
