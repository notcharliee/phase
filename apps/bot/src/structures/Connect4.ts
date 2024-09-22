import { Emojis } from "~/lib/emojis"

import type { Client, Snowflake, User } from "discord.js"

export const Markers = {
  Empty: Emojis.Connect4_Empty,
  Player1: Emojis.Connect4_Player1,
  Player2: Emojis.Connect4_Player2,
}

export type Marker = (typeof Markers)[keyof typeof Markers]

export type Board = [
  [Marker, Marker, Marker, Marker, Marker, Marker, Marker],
  [Marker, Marker, Marker, Marker, Marker, Marker, Marker],
  [Marker, Marker, Marker, Marker, Marker, Marker, Marker],
  [Marker, Marker, Marker, Marker, Marker, Marker, Marker],
  [Marker, Marker, Marker, Marker, Marker, Marker, Marker],
  [Marker, Marker, Marker, Marker, Marker, Marker, Marker],
]

export type BoardColumnIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6

class Player {
  readonly connect4: Connect4
  readonly marker: Marker
  readonly id: Snowflake

  constructor(connect4: Connect4, user: User) {
    this.connect4 = connect4
    this.id = user.id
    this.marker =
      (connect4.players.length ?? 0) % 2 === 0
        ? Markers.Player1
        : Markers.Player2
  }

  get user() {
    return this.connect4.client.users.resolve(this.id)
  }
}

export class Connect4 {
  public readonly client: Client
  public readonly players: [Player, Player]
  public readonly board: Board

  constructor(
    client: Client,
    users: [User, User],
    board: Board = Array.from({ length: 6 }, () =>
      Array<Marker>(7).fill(Markers.Empty),
    ) as Board,
  ) {
    this.client = client
    this.players = [] as unknown as [Player, Player]
    this.board = board

    for (const user of users) {
      this.players.push(new Player(this, user))
    }
  }

  public get availableColumns(): BoardColumnIndex[] {
    return this.board[0].flatMap((cell, index) =>
      cell === Markers.Empty ? [index as BoardColumnIndex] : [],
    )
  }

  public get currentPlayer(): Player {
    const flatBoard = this.board.flat()
    const playerMoves = flatBoard.filter((cell) => cell !== Markers.Empty)
    return this.players[playerMoves.length % 2]!
  }

  public get winner(): Player | null {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal down-right
      [1, -1], // diagonal down-left
    ] as const

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const cell = this.board[row]![col]
        if (cell === Markers.Empty) continue

        for (const [dx, dy] of directions) {
          let count = 1
          for (let i = 1; i < 4; i++) {
            const newRow = row + i * dx
            const newCol = col + i * dy
            if (
              newRow < 0 ||
              newRow >= 6 ||
              newCol < 0 ||
              newCol >= 7 ||
              this.board[newRow]![newCol] !== cell
            ) {
              break
            }
            count++
          }
          if (count === 4) {
            return this.players.find((player) => player.marker === cell) ?? null
          }
        }
      }
    }

    return null
  }

  public get draw(): boolean {
    // check if there's already a winner
    if (this.winner !== null) {
      return false
    }

    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal down-right
      [1, -1], // diagonal down-left
    ] as const

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        if (this.board[row]![col] !== Markers.Empty) continue

        // check if placing a marker here could lead to a win
        for (const [dx, dy] of directions) {
          let count = 1
          let emptyCount = 1

          // check in positive direction
          for (let i = 1; i < 4; i++) {
            const newRow = row + i * dx
            const newCol = col + i * dy
            if (newRow < 0 || newRow >= 6 || newCol < 0 || newCol >= 7) break
            const cell = this.board[newRow]![newCol]
            if (cell === Markers.Empty) {
              emptyCount++
            } else if (
              cell === this.board[row + (i - 1) * dx]![col + (i - 1) * dy] ||
              i === 1
            ) {
              count++
            } else {
              break
            }
          }

          // check in negative direction
          for (let i = 1; i < 4; i++) {
            const newRow = row - i * dx
            const newCol = col - i * dy
            if (newRow < 0 || newRow >= 6 || newCol < 0 || newCol >= 7) break
            const cell = this.board[newRow]![newCol]
            if (cell === Markers.Empty) {
              emptyCount++
            } else if (
              cell === this.board[row - (i - 1) * dx]![col - (i - 1) * dy] ||
              i === 1
            ) {
              count++
            } else {
              break
            }
          }

          if (count + emptyCount > 4) {
            return false // still possible to win
          }
        }
      }
    }

    return true // no possible winning moves left
  }

  public get gameOver(): boolean {
    return this.draw || this.winner !== null
  }

  public makeMove(column: BoardColumnIndex) {
    if (this.gameOver) throw new Error("Game is over")

    for (let row = 5; row >= 0; row--) {
      if (this.board[row]![column] === Markers.Empty) {
        this.board[row]![column] = this.currentPlayer.marker
        return
      }
    }

    throw new Error("Column is full")
  }

  public static resolveBoard(text: string) {
    const discordEmojiRegex = /<a?:([a-zA-Z0-9_]+):([0-9]+)>/g

    const parseCell = (cell: string): Marker => {
      switch (cell) {
        case Emojis.Connect4_Empty:
          return Markers.Empty
        case Emojis.Connect4_Player1:
          return Markers.Player1
        case Emojis.Connect4_Player2:
          return Markers.Player2
        default:
          throw new Error(`Invalid cell content: ${cell}`)
      }
    }

    const lines = text.split("\n")
    return lines.map((line) => {
      const cells = line.match(discordEmojiRegex) ?? Array.from(line)
      return cells.map(parseCell)
    }) as Board
  }
}
