
//declare global {
    interface Game_CharacterBase {
        _mover: any;
        _moveDefault: boolean;

        canAnalogMove(): boolean;
        hasMover(): boolean;
        refreshMover(): void;
        shouleMoveDefault(): boolean;
        updateMover(): void;

        //----------

        _shouleMoveDefaultOverride: boolean;
    }
//}



var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this._shouleMoveDefaultOverride = false;
}

/*
// @ts-ignore
var _CharacterMover_updatePosition = CharacterMover.prototype.updatePosition;
// @ts-ignore
CharacterMover.prototype.updatePosition = function() {
    _CharacterMover_updatePosition.call(this);
    this._tmpVecLN = this._velVec;
};

var _PlayerMover_update = PlayerMover.prototype.update;
PlayerMover.prototype.update = function() {
    _PlayerMover_update.call(this);
}
*/

/**
 * SAN_AnalogMove.js の移動処理の後、移動できなかった場合は AMPS の移動処理を実施してみる。
 * 移動できなかったことの検出には、「速度ベクトルが十分に小さい場合」を判定基準とする。
 * 
 * 壁に接触するときは速度ベクトルが 0 になるが、イベントに対しては SAN_AnalogMove.js は円柱のようなヒットボックスを用意しているため、
 * イベントとプレイヤーの座標が完全一致していない場合わずかに速度ベクトルが発生する。
 * そのため完全に 0 を基準としてしまうと、イベントを押すためにピクセル単位でプレイヤーの位置を移動させなければならなくなる。
 * 
 */
var _Game_CharacterBase_updateMover = Game_CharacterBase.prototype.updateMover;
Game_CharacterBase.prototype.updateMover = function() {
    var thr = 0.005;

    _Game_CharacterBase_updateMover.call(this);

    if (this._mover.isInputed && this._mover.isInputed() && this.canAnalogMove()) {


        if (Input.dir8 == 6 && Math.abs(this._mover._lasPosVec.x() - this._mover._posVec.x()) < thr) {
            this.moveStraight(6);
        }
        if (Input.dir8 == 4 && Math.abs(this._mover._lasPosVec.x() - this._mover._posVec.x()) < thr) {
            this.moveStraight(4);
        }
        if (Input.dir8 == 8 && Math.abs(this._mover._lasPosVec.y() - this._mover._posVec.y()) < thr) {
            this.moveStraight(8);
        }
        if (Input.dir8 == 2 && Math.abs(this._mover._lasPosVec.y() - this._mover._posVec.y()) < thr) {
            this.moveStraight(2);
        }
       /*
       console.log(Math.abs(this._mover._lasPosVec.y() - this._mover._posVec.y()));
        if (Input.dir8 == 6 && this._mover._lasPosVec.x() == this._mover._posVec.x()) {
            this.moveStraight(6);
        }
        if (Input.dir8 == 4 && this._mover._lasPosVec.x() == this._mover._posVec.x()) {
            this.moveStraight(4);
        }

        if (Input.dir8 == 8 && this._mover._lasPosVec.y() == this._mover._posVec.y()) {
            this.moveStraight(8);
        }
        if (Input.dir8 == 2 && this._mover._lasPosVec.y() == this._mover._posVec.y()) {
            this.moveStraight(2);
        }
        */
    }
};


var _Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
Game_CharacterBase.prototype.updateJump = function() {
    _Game_CharacterBase_updateJump.call(this);

    if (!this.isJumping() && this.hasMover()) {
        this.refreshMover();
    }
}

// SAN_AnalogMove.js の isMoving はジャンプ中を考慮していないため、そのままだと キー押し中に moveStraight を毎フレーム呼んでしまう。
var _Game_Player_isMoving = Game_Player.prototype.isMoving;
Game_Player.prototype.isMoving = function() {
    var r = _Game_Player_isMoving.call(this);
    return r || this.isJumping();
}

var _Game_Player_shouleMoveDefault = Game_Player.prototype.shouleMoveDefault;
Game_Player.prototype.shouleMoveDefault = function() {
    if (this.isRidding()) return true;
    if (this._movingSequel != undefined) return true;


    return _Game_Player_shouleMoveDefault.call(this);// && this._shouleMoveDefaultOverride;

};

var _Game_Player_updateMove = Game_Player.prototype.updateMove;
Game_Player.prototype.updateMove = function() {
    //this._shouleMoveDefaultOverride = true;
    if (this.shouleMoveDefault()) {
        Game_Character.prototype.updateMove.call(this);
        this._moveDefault = this.isMoving();
    }
};

