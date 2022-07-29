import { CELL_STATUSES, createBoard, markCell, revealCell, checkWin, checkLose } from "./minesweeper.js"

const BOARD_SIZE = 20;
const NUMBER_OF_MINES = 55;


const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const minesLeftText = document.querySelector("[data-mine-count]");
const messageText = document.querySelector(".flagsLabel");

board.forEach(row => {
  row.forEach(cell => {
    boardElement.append(cell.element);
    cell.element.addEventListener('click',() => {
      revealCell(board, cell);
      checkGameEnd()
    })
    cell.element.addEventListener("contextmenu", e => {//right click
      e.preventDefault();//prevent menu
      markCell(cell);
      listMinesLeft();
    })
  })
})

boardElement.style.setProperty("--size", BOARD_SIZE);
minesLeftText.textContent = NUMBER_OF_MINES;

function listMinesLeft () {
  const markedCellsCount = board.reduce((count, row) => {
    return count + row.filter(cell => cell.status === CELL_STATUSES.MARKED).length
  }, 0)

  minesLeftText.textContent = NUMBER_OF_MINES - markedCellsCount
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if  (win || lose) {
    boardElement.addEventListener('click', stopProp, { capture: true })
    boardElement.addEventListener('contextmenu', stopProp, { capture: true })
  }
  if  (win) messageText.textContent= "Ganaste"
  if  (lose) {
    messageText.textContent= "Perdiste"
    board.forEach(row => {
      row.forEach(cell => {
        if(cell.status === CELL_STATUSES.MARKED) markCell(cell)
        if (cell.mine) revealCell(board, cell)
      })
    })
  }
}

function stopProp(e) {//stop previous created events
  e.stopImmediatePropagation()
}
