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
      window.alert(`${this.mark} is the winner!`);
    };
  });
};

function checkIfDraw() {
  let markedFields = boardFields.length;

  for (let i = 1; i < boardFields.length; i++) {
    if (!(boardFields[i].classList.contains('board__field--unchecked'))) {
      markedFields--;
    }
  };

  if (markedFields === 1) {
    window.alert(`It's a draw!`);
  };
};

const x = 'X';
const y = 'O';

const player1 = new Player(true, x);
const player2 = new Player(true, y);

const players = [player1, player2];

boardFields.forEach(field => field.addEventListener('click', players[0].makeMove));
boardFields.forEach(field => field.addEventListener('click', checkIfDraw));