
'use strict';

var TetrisPresenter = require('modules/tetrisPresenter.js').TetrisPresenter;
var getRandomPiece = require('modules/piecesGenerator.js').getRandomPiece;
var Gameboard = require('modules/gameboard.js').Gameboard;

function Tetris(containerElement) {
    this._presenter = new TetrisPresenter(containerElement);
    this.initGame();
}

Tetris.prototype.initGame = function() {
    this._gameboard = new Gameboard();
    this._nextPiece = getRandomPiece();

    this._presenter.setLevel(1);
    this._presenter.setPoints(0);

    this.nextPiece();
};

Tetris.prototype.nextPiece = function() {
    this._currentPiece = this._nextPiece;
    this._nextPiece = getRandomPiece();
    this._presenter.updateNext(this._nextPiece);
};

Tetris.prototype.run = function(driver) {
    var ks = driver.keyboardState;

    try {
        if (ks.isEscapePressed()) {
            driver.setModule('MainMenu');
        }
        else if (ks.isDownArrowPressed()) {
            // this._presenter.moveDown();
            this._currentPiece.translate(+1,0);
        }
        else if (ks.isUpArrowPressed()) {
            this.nextPiece();
        }
        else if (ks.isLeftArrowPressed()) {
            this._currentPiece.translate(0,-1);
        }
        else if (ks.isRightArrowPressed()) {
            this._currentPiece.translate(0,+1);
        }
        else if (ks.isSpacePressed()) {
            this._lock = true;
            this._currentPiece.rotateClockwise();
            this._presenter.rotateCurrent(this._currentPiece.getBlocks(), function() {
                console.log('ANIMATION ENDED');
                this._lock = false;
            }.bind(this));
            return;
        }
        else { return; }

        this._presenter.updateCurrent(this._currentPiece);
        this._presenter.updateGameboard(this._gameboard);
    }
    finally {
        ks.clear();
    }
};

exports.Tetris = Tetris;
