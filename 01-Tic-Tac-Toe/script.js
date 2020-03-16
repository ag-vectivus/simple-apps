const boardFields = document.querySelectorAll('.board__field');

const winningMoves = [[0, 1, 2], 
                      [3, 4, 5], 
                      [6, 7, 8], 
                      [0, 3, 6], 
                      [1, 4, 7], 
                      [2, 5, 8], 
                      [0, 4, 8], 
                      [2, 4, 6]];

const Player = function(human, mark, playerMoves = []) {
  this.human = human;
  this.mark = mark;
  this.playerMoves = playerMoves;
};

Player.prototype.makeMove = function(e) {
  if (e.target.classList.contains('board__field--unchecked')) {
    e.target.textContent = players[0].mark;
    e.target.style.setProperty('scale', '1');
    e.target.classList.remove('board__field--unchecked');

    players[0].playerMoves.push(Number(this.getAttribute('data-number')));
    players[0].playerMoves.sort();
    
    if (players[0].playerMoves.length >= 3) {
      players[0].checkIfWin();
    };

    players.reverse();
    players[0].computerMove();
  };
};

Player.prototype.checkIfWin = function() {
  winningMoves.forEach(movesSequence => {
    let i = 0;
    movesSequence.forEach(move => {
      if (this.playerMoves.includes(move)) {
        i++;
      }
    });

    if (i === 3) {
      endGame();
      if (window.confirm(`${this.mark} is the winner! \nDo you want to play again?`)) {
        window.location.reload();
      };
    };
  });
};

Player.prototype.computerMove = function() {
  const bestMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7];

  // possible moves (must contain available field)
  // check how many fields from winning lists has the computer (playerMoves)
  // sort them by current length (but it must contain free field)
  // if true - make move on list with biggest number of computerMoves
  
  // possible human moves (must contain available field)
  // check how many fields from winning lists has human (playerMoves)
  // sort them by current length (but it must contain free field)
  // if true - make move on list with biggest number of computermoves - don't allow to win

  if (this.human === false) {
    let guard = 0;
    bestMoves.forEach(move => {
      if (boardFields[move].classList.contains('board__field--unchecked') && guard === 0) {
        setTimeout(function() {
          boardFields[move].click()
        }, computerMoveDelay(1, 3));
        guard++;
      };
    });
  };
};

function checkIfDraw() {
  let markedFields = boardFields.length;

  for (let i = 1; i < boardFields.length; i++) {
    if (!(boardFields[i].classList.contains('board__field--unchecked'))) {
      markedFields--;
    };
  };

  if (markedFields === 1) {
    endGame();
    if (window.confirm(`It's a draw! \nDo you want to play again?`)) {
      window.location.reload();
    };
  };
};

function computerMoveDelay(min, max) {
  return Math.floor(Math.random() * (max - min) + min) * 1000;
}

function endGame() {
  boardFields.forEach(field => field.removeEventListener('click', players[0].makeMove));
  boardFields.forEach(field => field.removeEventListener('click', checkIfDraw));
  boardFields.forEach(field => field.classList.remove('board__field--unchecked'));
};

function game() {
  boardFields.forEach(field => field.addEventListener('click', players[0].makeMove));
  boardFields.forEach(field => field.addEventListener('click', checkIfDraw));
};

const x = 'X';
const y = 'O';

const player1 = new Player(true, x);
const player2 = new Player(false, y);

const players = [player1, player2];

game();

// add computer as a player - done
// add an option to write a name of the player
// add an option to keep and display scores
// add an animation when sb wins
// add an option to change theme