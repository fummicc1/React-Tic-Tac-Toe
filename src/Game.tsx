import * as React from "react";
import "./Game.css"

interface Movement {
	column: number
	row: number
	isX: boolean
}

interface GameState {
  history: Array<{ squares: string[], lastMovement: Movement | null }>
  stepNumber: number
  xIsNext: boolean
}

interface SquareProps {
    value: string
    onClick: () => void
}

function Square(props: SquareProps) {
  return <button className="square" onClick={props.onClick}>{props.value}</button>;
}

interface BoardState {
  squares: Array<string>
  xIsNext: boolean
}

interface BoardProps {
  squares: Array<string>
  onClick: (i: number) => void
}

class Board extends React.Component<BoardProps, BoardState> {

  renderSquare(i: number) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {

	let rows: React.ReactNode[] = []

	for (let i = 0; i < 3; i++) {

		let container: React.ReactNode = <div className="board-row">
			{[0, 1, 2].map(index => i * 3 + index).map(index => {
				return this.renderSquare(index)
			})}
		</div>

		rows.push(container)
	}

    return (
      <div>
		  { rows }
      </div>
    );
  }
}

export class Game extends React.Component<{}, GameState> {

  constructor(props: {}) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(""),
		lastMovement: null
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick = (i: number) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (this.calculateWinners(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? "X" : "0"
    console.log(squares)
    this.setState({
      history: history.concat([{
        squares: squares,
		lastMovement: { column: i % 3, row: Math.floor(i / 3), isX: !this.state.xIsNext }
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  calculateWinners = (squares: Array<string>) => {
    const list = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
    for (let i = 0; i < list.length; i++) {
      const [a, b, c] = list[i]

      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }      
    }
    return null
  }

  render() {

    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = this.calculateWinners(current.squares)

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start"
      return <li key={move} className={ this.state.stepNumber == move ? "boldStyle" : "" }>
        <button onClick={() => this.jumpTo(move)}>
          {desc}
        </button>
		<ol>
			(column: { history[move].lastMovement?.column }, row: {history[move].lastMovement?.row})
		</ol>
      </li> 
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={this.handleClick} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  jumpTo = (step: number) => {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }
}
