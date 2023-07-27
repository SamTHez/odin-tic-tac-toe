const startButton = document.getElementById("startButton");
const boardSquares = document.getElementsByClassName("moveImg");
const playerToggle = document.getElementById("playerToggle");
const gameText = document.getElementById("gameText");
const gameElement =  document.getElementById("gameElement");
const squareStates = ["noMove", "xMove", "oMove"];
const computerMoves = [4,1,3,5,7,0,2,6,8];
const winStates = [                 
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6] ]; 

const gameState = (function() {
    'use strict';

    //Represents current game board where 0=empty, 1=p1Move, 2=p2Move
    let gameBoard = [0,0,0,0,0,0,0,0,0];
    let currTurn = 1;
    let isSinglePlayer = true;
    let inGame = false;

    function updateDisplay(newText) {
        gameText.textContent = newText;
    }

    function updateNumPlayers() {
        if(!inGame) {
            isSinglePlayer = !isSinglePlayer;
        }

        if(isSinglePlayer) {
            playerToggle.style.backgroundColor = "#fc8282";
            playerToggle.innerText = "One Player";
        } else {
            playerToggle.style.backgroundColor = "#8284fc";
            playerToggle.innerText = "Two Players";
        }
    }

    function initGame() {
        currTurn = 1;
        inGame = true;
        updateDisplay("Player 1 make your move");
        gameElement.style.opacity = "1";

        for(let i = 0; i < gameBoard.length; i++) {
            gameBoard[i] = 0;
        }

        for(let i = 0; i < boardSquares.length; i++) {
            boardSquares[i].addEventListener("click", function() {playerMove(i);});
            if(!isSinglePlayer) {
                boardSquares[i].addEventListener("click", function() {playerTwoMove(i);});
            }
        }        

        for(let i = 0; i < boardSquares.length; i++) {
            if(boardSquares[i].classList.contains("xMove")) {
                boardSquares[i].classList.remove("xMove");
            }
            if(boardSquares[i].classList.contains("oMove")) {
                boardSquares[i].classList.remove("oMove");
            }
            if(!(boardSquares[i].classList.contains("noMove"))) {
                boardSquares[i].classList.add("noMove");
            }
        } 
    }

    function gameShutdown() {
        inGame = false;
        gameElement.style.opacity = "0.5";

        if(playerToggle.innerText == "One Player") {
            isSinglePlayer = true;
        } else {
            isSinglePlayer = false;
        }
    }

    function checkForWin(currTurn) {
        for(let i = 0; i < winStates.length; i++) {
            if(gameBoard[winStates[i][0]] == currTurn && gameBoard[winStates[i][1]] == currTurn && gameBoard[winStates[i][2]] == currTurn) {
                return(true);
            }
        }
        return(false);
    }

    function checkForTie() {
        for(let i = 0; i < gameBoard.length; i++) {
            if(gameBoard[i] == 0) {return false};
        }
        return true;
    }

    function computerMove() {
        let i = 0;

        while(gameBoard[computerMoves[i]] != 0) {
            i++;
        }

        gameBoard[computerMoves[i]] = currTurn;
        boardSquares[computerMoves[i]].classList.remove(squareStates[0]);
        boardSquares[computerMoves[i]].classList.add(squareStates[currTurn]);
        if(checkForWin(currTurn)) {
            setTimeout(function() {updateDisplay("The Computer Wins, play again?");}, 100);
            gameShutdown();
            return;
        }
        updateDisplay("Player 1 make your move");
        currTurn = 1;
    }

    function playerTwoMove(squareNum) {
        if(inGame && currTurn == 2) {
            let thisSquare = boardSquares[squareNum];

            if(gameBoard[squareNum] == 0) {
                gameBoard[squareNum] = currTurn;
                thisSquare.classList.remove(squareStates[0]);
                thisSquare.classList.add(squareStates[currTurn]);
                if(checkForWin(currTurn)) {
                    setTimeout(function() {updateDisplay("Player 2 Wins! Play again?");}, 100);
                    gameShutdown();
                    return;
                }
                if(checkForTie()) {
                    setTimeout(function() {updateDisplay("Its a tie, play again?");}, 100);
                    gameShutdown();
                    return;
                }
                updateDisplay("Player 1 make your move");
                currTurn = 1;
            }
        }
    }

    function playerMove(squareNum) {
        if(inGame && currTurn == 1) {
            let thisSquare = boardSquares[squareNum];

            if(gameBoard[squareNum] == 0) {
                gameBoard[squareNum] = currTurn;
                thisSquare.classList.remove(squareStates[0]);
                thisSquare.classList.add(squareStates[currTurn]);
                if(checkForWin(currTurn)) {
                    setTimeout(function() {updateDisplay("Player 1 Wins! Play again?");}, 100);
                    gameShutdown();
                    return;
                }
                if(checkForTie()) {
                    setTimeout(function() {updateDisplay("Its a tie, play again?");}, 100);
                    gameShutdown();
                    return;
                }
                currTurn = 2;
                if(isSinglePlayer) {
                    updateDisplay("Waiting for Computer...");
                    setTimeout(function() {computerMove();}, 300);
                } else {
                    updateDisplay("Player 2 make your move");
                }
            }
        }
    }

    return {
        initGame:initGame,
        updateNumPlayers:updateNumPlayers
    }

})();

startButton.addEventListener("click", function() {gameState.initGame()});
playerToggle.addEventListener("click", function() {gameState.updateNumPlayers()});