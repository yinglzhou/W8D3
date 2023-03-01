/**
 * Initializes the Piece with its color.
 */
function Piece (color) {
    this.color = color;
}

/**
 * Returns the color opposite the current piece.
 */
Piece.prototype.oppColor = function () {
};

/**
 * Changes the piece's color to the opposite color.
 */
Piece.prototype.flip = function () {
    this.color === 'black' ? this.color = 'white' : this.color = 'black';
};

/**
 * Returns a string representation of the piece
 * based on its color.
 */
Piece.prototype.toString = function () {
    let output;
    this.color === 'black' ? output = 'B' : output = 'W';
    return output;
};

// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
    module.exports = Piece;
}
// DON'T TOUCH THIS CODE