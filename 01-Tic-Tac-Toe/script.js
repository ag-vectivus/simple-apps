// || Catch DOM Elements
const boardFields = document.querySelectorAll('.board__field');
const startButton = document.querySelector('.settings__menu--start');
const settingButtons = document.querySelectorAll('.settings__player');

// || DOM manipulation settings
const colorToChange = 'rgb(255, 235, 210)';

// || Moves sequences
const bestMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7];
const winningMoves = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

// || Initial global variables
const x = 'X';
const o = 'O';

// || Player object
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
    startButton.textContent="reset";

    players[0].playerMoves.push(Number(this.getAttribute('data-number')));
    players[0].playerMoves.sort();
    
    if (players[0].playerMoves.length >= 3) {
      players[0].checkIfWin();
    };

    players.reverse();

    if (players[0].human === false) {
      sleep(1000).then(() => { players[0].computerMove(); });
    };
  };
};

Player.prototype.checkIfWin = function() {

  winningMoves.forEach(movesSequence => {
    let i = 0;
    movesSequence.forEach(move => {
      this.playerMoves.includes(move) ? i++ : i;
    });

    if (i === 3) {
      movesSequence.forEach(move => boardFields[move].style.setProperty('color', colorToChange));
      startButton.style.setProperty('color', colorToChange);
      endGame();
    };
  });
};

Player.prototype.computerMove = function() {
  let guard = 0;

  (guard === 0) ? guard = computerDecide(guard, 1, this.playerMoves, 2, 'Computer makes final winning move!') : guard;
  (guard === 0) ? guard = computerDecide(guard, 1, players[1].playerMoves, 2, 'Computer makes move to don\'t allow the opponent to win!') : guard;
  (guard === 0) ? guard = computerDecide(guard, 2, this.playerMoves, 1, 'Computer makes move!') : guard;
  (guard === 0) ? guard = modyfiedComputerDecide(guard, 'Computer makes move from bestMoves!') : guard;

  if (guard === 0) {
    for (let i = 1; i < boardFields.length; i++) {
      if ((boardFields[i].classList.contains('board__field--unchecked'))) {
        boardFields[i].click();
      };
    };
  };
};

// || Functions - computer move
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
  const modyfiedBestMoves = bestMoves.slice(randomNumber(0, 2));
  const leftWinningMoves = waysToWin();
  const availableWays = leftWinningMoves
    .filter(movesData => movesData[0] === 3)
    .map(movesData => {
      return movesData[1];
    });

  function availableElement() {
    for (let i = 0; i < modyfiedBestMoves.length; i++) {
      let availableMove = availableWays
        .flat(1)
        .find(move => move === modyfiedBestMoves[i]);
      if (guard === 0 && availableMove !== undefined) {
        console.log(message);
        boardFields[availableMove].click();
        guard++;
      };
    };
    return guard;
  };
  
  guard = availableElement();
  return guard;
};

// || Function - check if there is a draw
function checkIfDraw() {
  let markedFields = boardFields.length;

  for (let i = 1; i < boardFields.length; i++) {
    if (!(boardFields[i].classList.contains('board__field--unchecked'))) {
      markedFields--;
    };
  };

  if (markedFields === 1) {
    endGame();
    startButton.style.setProperty('color', colorToChange);
  };
};

// || Functions - find available ways to win
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
      };
    };

    (i > 0) ? leftWinningMoves.push([i, movesSequence]) : i = 0;
  });

  leftWinningMoves.sort();
  return leftWinningMoves;
};

// || Service functions
function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
};

function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// || Player settings function
function changePlayer(e) {
  resetGame();
  e.target.classList.toggle('js-human');
  e.target.classList.toggle('js-computer');
  if (e.target.classList.contains('js-player-x')) {
    if (e.target.classList.contains('js-human')) {
      e.target.textContent='X: Human';
      player1.human = true;
    } else {
      e.target.textContent='X: Computer';
      player1.human = false;
    }
  } else {
    if (e.target.classList.contains('js-human')) {
      e.target.textContent='O: Human';
      player2.human = true;
    } else {
      e.target.textContent='O: Computer';
      player2.human = false;
    };
  };
  if (player1.human === true) {
    game();
  };
};

// || Game functions
function game() {
  resetGame();
  players[0] = player1;
  players[1] = player2;
  boardFields.forEach(field => {
    field.addEventListener('click', players[0].makeMove);
    field.addEventListener('click', checkIfDraw);
  });

  if (players[0].human === false) {
    players[0].computerMove();
  };
};

function resetGame() {
  endGame();
  players.forEach(player => player.playerMoves = []);
  
  startButton.textContent="start";
  startButton.style.removeProperty('color');

  boardFields.forEach(field => {
    field.textContent='';
    field.style.removeProperty('scale');
    field.style.removeProperty('color');
    field.classList.add('board__field--unchecked');
  });
};

function endGame() {
  boardFields.forEach(field => {
    field.removeEventListener('click', players[0].makeMove);
    field.removeEventListener('click', checkIfDraw);
    field.classList.remove('board__field--unchecked');
  });
};

// || Start game when the page is loaded
settingButtons.forEach(button => button.addEventListener('click', changePlayer));
startButton.addEventListener('click', game);

const player1 = new Player(true, x);
const player2 = new Player(false, o);
const players = [player1, player2];

if (player1.human === true) {
  game();
};