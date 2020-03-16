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
  const availableMoves = findAvailableMoves();
  const leftWinningMoves = []

  let j = 0;

  if (this.human === false) {
    
    winningMoves.forEach(movesSequence => {

      let i = 0;
      for (let possibleMove of movesSequence) {
        for (let availableMove of availableMoves) {
          if (possibleMove === availableMove) {
            i++;
          }
        }
      }

      if (i > 0) {
        leftWinningMoves.push([i, movesSequence]);      
      };
    });

    leftWinningMoves.sort()
    console.log(leftWinningMoves);
  };

  if (this.human === false) {
    // let j = 0;
    leftWinningMoves.forEach(movesData => {
      if (movesData[0] <= 2 && j === 0) {
        let i = 0;

        if (j === 0) {
          movesData[1].forEach(element => {
          if (this.playerMoves.find(move => move === element)) {
            i++;
          };
        })

          if (i === 2) {
            j++;

            movesData[1].forEach(element => {
              if (this.playerMoves.find(move => move !== element)) {
                setTimeout(function() {
                boardFields[element].click()
                }, computerMoveDelay(1, 3));
              };
            })
            console.log('dupa');
          }
      }}
    })
    // get player(computer) moves - this will go as second move
    // compare with leftWinningMoves:
      // if movesSequence of leftWinningMoves doesn't contain any enemy move fulfill it
  };

  // get human moves - this will go as first move
  // compare with leftWinningMoves
    // if the first element of movesSequence of leftWinningMoves === 1 and it contains 2 enemy moves - fulfill the last one to not allow opponent to win

  if (this.human === false && j === 0) { // this will go as the last option
    let guard = 0;
    bestMoves.forEach(move => {
      if (boardFields[move].classList.contains('board__field--unchecked') && guard === 0) {
        setTimeout(function() {
          boardFields[move].click()
        }, computerMoveDelay(1, 3));
        guard++;
        console.log('dupa2');
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

function findAvailableMoves() {
  const availableMoves = [];
  boardFields.forEach(field => {
    if (field.classList.contains('board__field--unchecked')) {
      const fieldIndex = Number(field.getAttribute('data-number'))
      availableMoves.push(fieldIndex);
    }});
  return availableMoves;
};

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

// add computer as a player
// add an option to write a name of the player
// add an option to keep and display scores
// add an animation when sb wins
// add an option to change theme