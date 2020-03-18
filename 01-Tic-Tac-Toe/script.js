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

    if (players[0].human === false) {
      players[0].computerMove();
    }
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
  let guard = 0;

  if (guard === 0) {
    guard = computerDecide(guard, 1, this.playerMoves, 2, 'Computer makes final winning move!');
  };

  if (guard === 0) {
    guard = computerDecide(guard, 1, players[1].playerMoves, 2, 'Computer makes move to don\'t allow the opponent to win!');
  };

  if (guard === 0) {
    guard = computerDecide(guard, 2, this.playerMoves, 1, 'Computer makes move!');
  };

  if (guard === 0) {
    guard = modyfiedComputerDecide(guard, 'Computer makes move from bestMoves!');
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

function computerDecide(guard, fieldsLeft, movesMade, movesOfPlayer, message) {
  const leftWinningMoves = waysToWin();
  const availableWays = leftWinningMoves
    .filter(movesData => movesData[0] === fieldsLeft)
    .map(movesData => {
      return movesData[1];
    });
    
  availableWays.forEach(element => {
    let j = 0;
    let availableElement;
    for (let i = 0; i !== 3; i++) {
      movesMade.find(move => move === element[i]) ? j++ : availableElement = element[i];
      if (movesMade[0] === 0 && element[i] === 0) {
        j++;
      };
    }; 
    if (j === movesOfPlayer && guard === 0 && availableElement !== undefined) {
      console.log(message);
      boardFields[availableElement].click();
      guard++;
    };
  });
  return guard;
};

function modyfiedComputerDecide(guard, message) {
  const bestMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  const leftWinningMoves = waysToWin();
  const availableWays = leftWinningMoves
    .filter(movesData => movesData[0] === 3)
    .map(movesData => {
      return movesData[1];
    });
    
  availableWays.forEach(element => {
    let i = 0;
    let availableElement;
    element.forEach(availableMove => {
      (bestMoves.find(move => move === availableMove)) ? availableElement = availableMove : i++;
      if (guard === 0 && availableElement !== undefined) {
        console.log(message);
        boardFields[availableElement].click();
        guard++;
      };
    });
  });
  return guard;
};

function findAvailableMoves() {
  const availableMoves = [];
  boardFields.forEach(field => {
    if (field.classList.contains('board__field--unchecked')) {
      const fieldIndex = Number(field.getAttribute('data-number'))
      availableMoves.push(fieldIndex);
    }});
  return availableMoves;
};

function waysToWin() {
  const availableMoves = findAvailableMoves();
  const leftWinningMoves = []

  winningMoves.forEach(movesSequence => {
    let i = 0;
    for (let possibleMove of movesSequence) {
      for (let availableMove of availableMoves) {
        (possibleMove === availableMove) ? i++ : i;
      }
    }

    (i > 0) ? leftWinningMoves.push([i, movesSequence]) : i = 0;
  })

  leftWinningMoves.sort();
  return leftWinningMoves;
};

function endGame() {
  boardFields.forEach(field => field.removeEventListener('click', players[0].makeMove));
  boardFields.forEach(field => field.removeEventListener('click', checkIfDraw));
  boardFields.forEach(field => field.classList.remove('board__field--unchecked'));
};

function game() {
  boardFields.forEach(field => field.addEventListener('click', players[0].makeMove));
  boardFields.forEach(field => field.addEventListener('click', checkIfDraw));
  
  if (players[0].human === false) {
    players[0].computerMove();
  };
};

const x = 'X';
const y = 'O';

const player1 = new Player(true, x);
const player2 = new Player(false, y);

const players = [player1, player2];

game();

// fix bug - when X is the computer it doesn't make the last move (if it's not winning move)
// add an option to change player

// add an option to change theme
// add an animation when sb wins

// add an option to keep and display scores
// add an option to write a name of the player