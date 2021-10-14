import { StringMap } from '@naturalcycles/js-lib'
import { InfoResponse, GameState, MoveResponse, Game, Coord } from './types'

type Dir = 'up' | 'right' | 'down' | 'left'

export function info(): InfoResponse {
    console.log("INFO")
    const response: InfoResponse = {
        apiversion: "1",
        author: "",
        color: "#888888",
        head: "default",
        tail: "default"
    }
    return response
}

export function start(gameState: GameState): void {
    console.log(`${gameState.game.id} START`)
}

export function end(gameState: GameState): void {
    console.log(`${gameState.game.id} END\n`)
}

export function move(gameState: GameState): MoveResponse {
    let possibleMoves: Record<Dir, boolean> = {
        up: true,
        down: true,
        left: true,
        right: true
    }

    let dir: Dir

    // Step 0: Don't let your Battlesnake move back on it's own neck
    const myHead = gameState.you.head
    const head = myHead
    const myNeck = gameState.you.body[1]
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
    Object.keys(possibleMoves).filter(d => possibleMoves[d as Dir]).forEach(dir => {
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

        if (gameState.you.body.slice(0, gameState.you.body.length - 1).some(coord => coord.x === next.x && coord.y === next.y)) {
            possibleMoves[dir as Dir] = false
        }
    })

    // TODO: Step 3 - Don't collide with others.
    // Use information in gameState to prevent your Battlesnake from colliding with others.

    // TODO: Step 4 - Find food.
    // Use information in gameState to seek out and find food.

    // Finally, choose a move from the available safe moves.
    // TODO: Step 5 - Select a move to make based on strategy, rather than random.
    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key as Dir])
    const response: MoveResponse = {
        move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}
