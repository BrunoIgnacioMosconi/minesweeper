
export const CELL_STATUSES = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  MARKED: 'marked'
}

export function createBoard (boardSize, numberOfMines) {
  const board = [];
  const minesPositions = getMinesPositions(boardSize, numberOfMines);
  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement('div');
      element.dataset.status = CELL_STATUSES.HIDDEN;
      const cell = {
        element,
        x,
        y,
        mine: minesPositions.some(positionMatch.bind(null, {x, y})),
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(cell);
    }
    board.push(row);
  }
  return board;
}

export function markCell(cell) {
  if  (cell.status !== CELL_STATUSES.HIDDEN && cell.status !== CELL_STATUSES.MARKED) return
  if  (cell.status === CELL_STATUSES.MARKED) {
    cell.status = CELL_STATUSES.HIDDEN;
  } else {
    cell.status = CELL_STATUSES.MARKED;
  }
}

export function revealCell(board, cell) {
  if  (cell.status !== CELL_STATUSES.HIDDEN) return;
  if  (cell.mine) {
    cell.status = CELL_STATUSES.MINE;
    return
  }

  cell.status = CELL_STATUSES.NUMBER;
  const adjacentCells = nearbyCells(board, cell);
  const mines = adjacentCells.filter(t => t.mine);
  if(mines.length === 0)  {
    adjacentCells.forEach(revealCell.bind(null, board))
  } else {
    cell.element.textContent = mines.length;
  }
}

export function checkWin(board) {
  return board.every(row => {
    return row.every(cell => {
      return cell.status === CELL_STATUSES.NUMBER ||
      (cell.mine &&
        (cell.status === CELL_STATUSES.HIDDEN ||
          cell.status === CELL_STATUSES.MARKED))
    })
  })
};

export function checkLose(board) {
  return board.some(row => {
    return row.some(cell => {
      return cell.status === CELL_STATUSES.MINE
    })
  })
};

function getMinesPositions(boardSize, numberOfMines) {
  const positions = [];
  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize)
    }
    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position);
    }
  }
  return positions;
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y
}

function randomNumber(size) {
  return Math.floor(Math.random() * size)
}

function nearbyCells(board, {x, y}) {
  const cells = [];

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        const cell = board[x + xOffset]?.[y + yOffset];
        if (cell) cells.push(cell)
      }
    }
  return cells;
}