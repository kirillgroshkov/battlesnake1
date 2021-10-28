import { _objectKeys, _range, _sortBy } from '@naturalcycles/js-lib'
import { GameState, MoveResponse, Coord } from './types'

export type Dir = 'up' | 'right' | 'down' | 'left'

export function move(gameState: GameState): MoveResponse {
  const possibleMoves: Record<Dir, boolean> = {
    up: true,
    down: true,
    left: true,
    right: true,
  }

  let dir: Dir

  // Step 0: Don't let your Battlesnake move back on it's own neck
  const myHead = gameState.you.head
  const head = myHead
  const myNeck = gameState.you.body[1]!
  const neck = myNeck
  if (myNeck.x < myHead.x) {
    possibleMoves.left = false
  } else if (myNeck.x > myHead.x) {
    possibleMoves.right = false
  } else if (myNeck.y < myHead.y) {
    possibleMoves.down = false
  } else if (myNeck.y > myHead.y) {
    possibleMoves.up = false
  }

  if (myHead.x === 0) {
    possibleMoves.left = false
  }
  if (myHead.x === gameState.board.width - 1) {
    possibleMoves.right = false
  }
  if (myHead.y === 0) {
    possibleMoves.down = false
  }
  if (myHead.y === gameState.board.height - 1) {
    possibleMoves.up = false
  }

  // TODO: Step 2 - Don't hit yourself.
  Object.keys(possibleMoves)
    .filter(d => possibleMoves[d as Dir])
    .forEach(dir => {
      let next: Coord
      if (dir === 'up') {
        next = {
          x: gameState.you.head.x,
          y: gameState.you.head.y + 1,
        }
      } else if (dir === 'right') {
        next = {
          x: gameState.you.head.x + 1,
          y: gameState.you.head.y,
        }
      } else if (dir === 'down') {
        next = {
          x: gameState.you.head.x,
          y: gameState.you.head.y - 1,
        }
      } else {
        next = {
          x: gameState.you.head.x - 1,
          y: gameState.you.head.y,
        }
      }

      if (
        gameState.you.body
          .slice(0, gameState.you.body.length - 1)
          .some(coord => coord.x === next.x && coord.y === next.y)
      ) {
        possibleMoves[dir as Dir] = false
      }
    })

  // TODO: Step 3 - Don't collide with others.
  // Use information in gameState to prevent your Battlesnake from colliding with others.

  // TODO: Step 4 - Find food.
  // Use information in gameState to seek out and find food.

  // Finally, choose a move from the available safe moves.
  // TODO: Step 5 - Select a move to make based on strategy, rather than random.

  let safeMoves = _objectKeys(possibleMoves).filter(key => possibleMoves[key])

  // Project next step, aim to go where there's no snake
  if (safeMoves.length > 1) {
    const move1 = safeMoves[0]!
    const move2 = safeMoves[1]!
    const move3 = safeMoves[2]
    if (isSnakeOnTheWay(nextCell(head, move1), move1, gameState)) {
      safeMoves = safeMoves.filter(m => m !== move1)
    } else if (isSnakeOnTheWay(nextCell(head, move2), move2, gameState)) {
      safeMoves = safeMoves.filter(m => m !== move2)
    } else if (move3 && isSnakeOnTheWay(nextCell(head, move3), move3, gameState)) {
      safeMoves = safeMoves.filter(m => m !== move3)
    }
  }

  // If 2 possibilities - choose one that goes to the center
  if (safeMoves.length === 2) {
    const bestMove = _sortBy(safeMoves.map(m => {
      return {
        m,
        d: distanceness(nextCell(head, m), gameState),
      }
    }), r => r.d)[0]!.m

    safeMoves = [bestMove]
  }

  const response: MoveResponse = {
    move: safeMoves[Math.floor(Math.random() * safeMoves.length)]!,
  }

  console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
  return response
}

function nextCell(current: Coord, move: Dir): Coord {
  const {x, y} = current
  if (move === 'up') {
    return {
      x,
      y: y + 1,
    }
  }
  if (move === 'down') {
    return {
      x,
      y: y - 1,
    }
  }
  if (move === 'left') {
    return {
      x: x - 1,
      y,
    }
  }
  // right
  return {
    x: x + 1,
    y,
  }
}

function distanceness(c: Coord, s: GameState): number {
  return Math.abs(c.x - s.board.width / 2) + Math.abs(c.y - s.board.height / 2)
}

function isSnakeOnTheWay(c: Coord, d: Dir, s: GameState): boolean {
  if (d === 'up') {
    return s.you.body.some(cBody => cBody.x === c.x && cBody.y > c.y)
  }

  if (d === 'down') {
    return s.you.body.some(cBody => cBody.x === c.x && cBody.y < c.y)
  }

  if (d === 'left') {
    return s.you.body.some(cBody => cBody.y === c.y && cBody.x < c.x)
  }

  return s.you.body.some(cBody => cBody.y === c.y && cBody.x > c.x)
}
