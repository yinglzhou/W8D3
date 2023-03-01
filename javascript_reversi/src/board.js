// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let spaces = new Array(8);
  for (let i = 0; i < spaces.length; i++){
    spaces[i] = new Array(8);
  };
  spaces[3][4] = new Piece('black');
  spaces[4][3] = new Piece('black');

  spaces[3][3] = new Piece('white');
  spaces[4][4] = new Piece('white');

  return spaces;

};

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
};

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let x = pos[0];
  let y = pos[1];

  if (x < 0 || y < 0 || x > 7 || y > 7) {
    return false;
  } else {
    return true;
  };

};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  let x = pos[0];
  let y = pos[1];

  if (this.isValidPos(pos)) {
    // debugger
    return this.grid[x][y];
  } else {
    throw new Error('Not valid pos!')
  };

};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  // if (this.getPiece(pos).color === color) {
  //   return true
  // } 
  if (!this.getPiece(pos)) {
    return false;
  };
  return this.getPiece(pos).color === color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return !!this.getPiece(pos);
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip=[]) {
  let nextPos = [(pos[0]+ dir[0]), (pos[1] + dir[1])];
  // debugger
  if (!this.isValidPos(nextPos) || !this.isOccupied(nextPos) ) {
    return new Array();

  } else if (this.getPiece(nextPos).color === color) {
    // piecesToFlip.push(this.getPiece(nextPos));
    return piecesToFlip;

  } else { // if (this.getPiece(nextPos).color !== color)
    piecesToFlip.push((nextPos));
    return this._positionsToFlip(nextPos, color, dir, piecesToFlip);

  };


};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function(pos, color) {
  // const instance = this;
  // let piecesToFlip = [];
 
  // Board.DIRS.forEach(function(dir) {
  //   let result = instance._positionsToFlip(pos, color, dir, piecesToFlip)
  //   // debugger
  //   if (result.length > 0) {
  //     return true;
  //   }
  // })

  // return false;
  // we cannot use a for each loop because there is no way to return early out of a forEach loop
  
  
  for (let i = 0 ; i < Board.DIRS.length ; i++) {
    let dir = Board.DIRS[i];
    let result = this._positionsToFlip(pos, color, dir);
    if (result.length !== 0) {
      return true;
    }
  };

  return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  // let pos = [poss[1], poss[0]]
  // debugger
  if (!this.isValidPos(pos, color)) {
    throw new Error('Invalid move!');
  };

  if (!this.validMove(pos, color)) {
    throw new Error ('Invalid move!');
  }
 
  if (this.isOccupied(pos)) {
    throw new Error ('Invalid move!');
  }
  this.grid[pos[0]][pos[1]] = new Piece(color);
  let needFlipping = [];

  for (let i = 0 ; i < Board.DIRS.length ; i++) {
    let dir = Board.DIRS[i];
    let result = this._positionsToFlip(pos, color, dir);
    // debugger
    if (result.length !== 0){
      needFlipping = needFlipping.concat(result)
    }
  };
  // debugger
  for (let i = 0; i < needFlipping.length; i++) {
    this.getPiece(needFlipping[i]).flip();
  }

};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {

  let newArray = [];

  // debugger 
  // ask about why this.length cannot replace 8 here. 
  for (let i = 0; i < this.grid.length; i++) {
    // debugger
    for (let j = 0; j < this.grid.length; j++) {
      let pos = [i, j];
      // debugger
      if (this.validMove(pos, color)) {
        newArray = newArray.concat([pos]);
      }
    }
  }
  // debugger
  return newArray
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  let result = this.validMoves(color);
  if (result.length === 0) {
    return false;
  }
  return true;
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if (!this.hasMove('black') && !this.hasMove('white')) {
    return true
  }
  return false
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  console.log("  0 1 2 3 4 5 6 7")
  for (let i = 0; i < this.grid.length; i++) {
    rowStr = `${i}`
    for (let j = 0; j < this.grid.length; j++) {
      let pos = [i, j];
      if (this.isOccupied(pos)) {
        let piece = this.getPiece(pos);
        rowStr = rowStr + " " + piece.toString();
      } else {
        rowStr = rowStr + " " + '_'
      }
      
    }
    console.log(rowStr);
  }
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE
