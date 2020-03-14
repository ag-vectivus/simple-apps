// Global variables
const x = 'X';
const y = 'O';
const playerOneMoves = [];
const playerTwoMoves = [];

// Catch DOM elements
const boardFields = document.querySelectorAll('.board__field');

// Create the list of moves

const winningMoves = [[0, 1, 2], 
                      [3, 4, 5], 
                      [6, 7, 8], 
                      [0, 3, 6], 
                      [1, 4, 7], 
                      [2, 5, 8], 
                      [0, 4, 8], 
                      [2, 4, 6]];

// Ascertain who is the winner
function checkIfWin() {
  if (playerOneMoves.length >= 3) {

    winningMoves.forEach(movesSequence => {
      let i = 0;

      movesSequence.forEach(move => {
        if (playerOneMoves.includes(move)) {
          i++;
        }

      });

      if (i === 3) {
        window.alert('Wygrałeś!');
      };

    });
  };
};

// Allow to choose X or O
  // if O - computer is doing the first move
  // else - human

// Moves
function makeMove(e) {
  if (e.target.classList.contains('board__field--unchecked')) {

    this.textContent=player1;
    this.style.setProperty('scale', '1');
    this.classList.remove('board__field--unchecked');

    playerOneMoves.push(Number(this.getAttribute('data-number')));
    playerOneMoves.sort();
  }
  checkIfWin();
};

// Event listeners
boardFields.forEach(field => field.addEventListener('click', makeMove));
