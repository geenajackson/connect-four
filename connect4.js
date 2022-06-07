/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let gameEnd = false; //boolean to track if the game has finished

const reset = document.querySelector("button");
reset.addEventListener("click", function () {
  window.location.reload();
})


/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++) {
    let array = [];
    for (let x = 0; x < WIDTH; x++) {
      array.push(null);
    }
    board.push(array);
  }
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");

  // TODO: add comment for this code
  //gets the top row of the board table and adds an id for styling and event handler for calling handleClick
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  //creates a unique id for each cell based on the cell's x and y position
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }

}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let i = 1; i < WIDTH; i++) {
    if (board[HEIGHT - i][x] === null) {
      board[HEIGHT - i][x] = currPlayer;
      return (HEIGHT - i);
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const cell = document.getElementById(`${y}-${x}`);
  const piece = document.createElement("div");
  let pClass = "";
  (currPlayer === 1 ? pClass = "p1" : pClass = "p2");
  piece.classList.add("piece", pClass);
  cell.append(piece);
  return cell;
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  gameEnd = true;
  setTimeout(() => alert(msg), 10);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (!gameEnd) {
    // get x from ID of clicked cell
    let x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    let y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    placeInTable(y, x);
    board[y][x] = currPlayer;

    // check for win
    if (checkForWin()) {
      return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so call, call endGame
    if (checkForTie()) {
      return endGame("It's a tie!");
    }

    // switch players
    // TODO: switch currPlayer 1 <-> 2
    (currPlayer === 1 ? currPlayer = 2 : currPlayer = 1);
  }
}

//checks every board cell for a non-null value
function checkForTie() {
  return board.every(cell => cell.every(val => val !== null))
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  //for each cell in the board:
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //checks the position of each cell by moving the coordinates of the cell in a line of four, a la a coordinate plane
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      //x position moves to the right
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      //x position moves to the left
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // if any of these conditions turns out to be true, we have a winner!
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}



makeBoard();
makeHtmlBoard();
